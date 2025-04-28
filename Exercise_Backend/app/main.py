from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
import hashlib
from fastapi.middleware.cors import CORSMiddleware

from app.database.config import SessionLocal
from app.models.user import User
from app.auth.jwt_handler import create_access_token, verify_token
from app.auth.dependencies import get_current_user

# Create FastAPI app
app = FastAPI()

# Add CORS middleware to allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Pydantic models for request/response
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserResponse(BaseModel):
    username: str
    birthday: Optional[datetime] = None
    create_time: Optional[datetime] = None
    last_login: Optional[datetime] = None

    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    username: str
    password: str
    birthday: Optional[datetime] = None

class UserEdit(BaseModel):
    username: str
    password: Optional[str] = None
    birthday: Optional[datetime] = None
    # Optionally allow editing last_login, but usually not exposed

# Login endpoint
@app.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    # Find user by username
    user = db.query(User).filter(User.username == form_data.username).first()
    
    # Hash the incoming password
    hashed_input_password = hashlib.sha256(form_data.password.encode()).hexdigest()
    
    # Check if user exists and password matches
    if not user or user.password != hashed_input_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Update last_login
    user.last_login = datetime.utcnow()
    db.commit()
    
    # Create access token
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

# Get user by username endpoint
@app.get("/user/", response_model=UserResponse)
async def get_user(username: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    # Find user by username
    user = db.query(User).filter(User.username == username).first()
    
    # Check if user exists
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
    
    return user

# Protected endpoint example
@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}

@app.post("/user/")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )
    # Hash the password
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
    # Create new user
    new_user = User(
        username=user.username,
        password=hashed_password,
        birthday=user.birthday,
        create_time=datetime.utcnow(),
        last_login=None
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.delete("/user/")
async def delete_user(username: str = Form(...), db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@app.patch("/user/")
async def edit_user(user_edit: UserEdit, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.username == user_edit.username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User does not exist"
        )
    try:
        if user_edit.password is not None:
            user.password = hashlib.sha256(user_edit.password.encode()).hexdigest()
        if user_edit.birthday is not None:
            user.birthday = user_edit.birthday
        db.commit()
        return {"message": "User updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid data format: {e}"
        ) 