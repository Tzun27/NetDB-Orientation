# 🚀 FastAPI + PostgreSQL + JWT Backend Project Guide

Welcome! This guide will walk you through building a modern backend using **FastAPI**, **PostgreSQL**, and **JWT authentication**. We'll go step by step, explaining what each file and piece of code does, so you can learn and build with confidence. Let's get started!

---

## 📝 1. Project Setup

### 1.1. Create Your Project Directory
```bash
mkdir my-backend-project
cd my-backend-project
```
*Creates a new folder for your project and moves into it.*

### 1.2. Initialize Python Project with Poetry
[Poetry](https://python-poetry.org/) helps manage dependencies easily.
```bash
poetry init --no-interaction
poetry add fastapi uvicorn sqlalchemy alembic psycopg2-binary python-jose[cryptography] passlib[bcrypt] python-multipart
```
*Initializes a new Python project and installs all the packages you'll need for this backend.*

---

## 🗂️ 2. Project Structure

Here's a simple structure:
```
my-backend-project/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app and endpoints
│   ├── models/
│   │   └── user.py       # SQLAlchemy User model
│   ├── database/
│   │   └── config.py     # DB connection and Base
│   └── auth/
│       ├── jwt_handler.py    # JWT creation/verification
│       └── dependencies.py   # Auth dependencies for FastAPI
├── migrations/           # Alembic migration scripts
├── alembic.ini           # Alembic config
├── run.py                # Script to run the app
└── guide/
    └── backend_guide.md  # This guide!
```
*This structure keeps your code organized and easy to maintain.*

---

## 🛢️ 3. Set Up PostgreSQL (with Docker)

If you don't have PostgreSQL locally, use Docker:
```bash
docker run --name my-postgres -e POSTGRES_PASSWORD=postgresmaster -p 5432:5432 -d postgres
```
*This command starts a PostgreSQL server in a Docker container, with the password set to `postgresmaster`.*

---

## 🏗️ 4. SQLAlchemy Database Setup

### 4.1. `app/database/config.py`
This file sets up the database connection and session:
```python
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "postgresql://postgres:postgresmaster@localhost:5432/postgres"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
```
**Explanation:**
- `create_engine`: Connects SQLAlchemy to your PostgreSQL database.
- `SessionLocal`: Used to create database sessions for each request.
- `Base`: The base class for all your models (tables).

---

## 👤 5. Create the User Model

### 5.1. `app/models/user.py`
```python
from datetime import datetime
from sqlalchemy import Column, String, Date, DateTime
from app.database.config import Base

class User(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True)  # Unique username, primary key
    password = Column(String, nullable=False)    # Hashed password
    birthday = Column(Date)                      # User's birthday
    create_time = Column(DateTime, default=datetime.utcnow)  # When the user was created
    last_login = Column(DateTime, nullable=True)             # Last login time
```
**Explanation:**
- This class defines the structure of the `users` table in your database.
- Each attribute is a column in the table.
- `Base` tells SQLAlchemy this is a model.

---

## 🧬 6. Database Migrations with Alembic

### 6.1. Initialize Alembic
```bash
alembic init migrations
```
*Sets up Alembic for managing database schema changes (migrations).* 

### 6.2. Configure Alembic
- Edit `alembic.ini` and set:
  ```ini
  sqlalchemy.url = postgresql://postgres:postgresmaster@localhost:5432/postgres
  ```
- Edit `migrations/env.py` to import your Base and models:
  ```python
  from app.database.config import Base
  from app.models.user import User
  target_metadata = Base.metadata
  ```
*This tells Alembic where to find your models and how to connect to your database.*

### 6.3. Generate and Apply Migration
```bash
alembic revision --autogenerate -m "create users table"
alembic upgrade head
```
*Alembic will create a migration script and apply it, creating the `users` table in your database.*

---

## 🔑 7. JWT Authentication Setup

### 7.1. `app/auth/jwt_handler.py`
Handles creating and verifying JWT tokens.
```python
from datetime import datetime, timedelta
from jose import jwt, JWTError
from fastapi import HTTPException, status

SECRET_KEY = "your_secret_key_here"  # Used to sign tokens (keep it secret!)
ALGORITHM = "HS256"                   # JWT signing algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = 30       # Token expiry time

def create_access_token(data: dict, expires_delta=None):
    to_encode = data.copy()  # Copy the data to encode
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})  # Add expiry to the token
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)  # Create the JWT

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])  # Decode and verify
        username = payload.get("sub")  # Get the username from the token
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
```
**Explanation:**
- `create_access_token`: Makes a JWT token with user info and expiry.
- `verify_token`: Checks if a token is valid and extracts the username.

### 7.2. `app/auth/dependencies.py`
Dependency for FastAPI endpoints to require authentication.
```python
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from app.auth.jwt_handler import verify_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")  # Tells FastAPI how to get the token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    username = verify_token(token)  # Verifies the JWT
    if username is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return username
```
**Explanation:**
- `get_current_user`: Used as a dependency to protect endpoints. If the token is missing or invalid, the request is rejected.

---

## 🚦 8. FastAPI Main Application

### 8.1. `app/main.py`
This is where you define your API endpoints.

#### Common Setup
```python
import hashlib
from datetime import datetime, timedelta
from typing import Optional
from fastapi import FastAPI, Depends, HTTPException, status, Form
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database.config import SessionLocal
from app.models.user import User
from app.auth.jwt_handler import create_access_token
from app.auth.dependencies import get_current_user

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```
**Explanation:**
- Imports all necessary modules.
- `get_db()` provides a database session for each request.

---

#### 8.2. Register a New User (POST `/user/`)
```python
class UserCreate(BaseModel):
    username: str
    password: str
    birthday: Optional[datetime] = None

@app.post("/user/")
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.username == user.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")
    hashed_password = hashlib.sha256(user.password.encode()).hexdigest()
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
```
**Explanation:**
- Defines a Pydantic model for user creation.
- Checks if the username already exists.
- Hashes the password before saving.
- Adds the new user to the database.

---

#### 8.3. Log In (POST `/login`)
```python
@app.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == form_data.username).first()
    hashed_input_password = hashlib.sha256(form_data.password.encode()).hexdigest()
    if not user or user.password != hashed_input_password:
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    user.last_login = datetime.utcnow()
    db.commit()
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
```
**Explanation:**
- Accepts username and password.
- Hashes the input password and compares it to the stored hash.
- Updates the last login time.
- Returns a JWT token if successful.

---

#### 8.4. Get User Info (GET `/user/`)
```python
class UserResponse(BaseModel):
    username: str
    birthday: Optional[datetime] = None
    create_time: Optional[datetime] = None
    last_login: Optional[datetime] = None
    class Config:
        orm_mode = True

@app.get("/user/", response_model=UserResponse)
async def get_user(username: str, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    return user
```
**Explanation:**
- Requires authentication.
- Takes a username as a query parameter.
- Returns user info if found, otherwise 400 error.

---

#### 8.5. Edit User Info (PATCH `/user/`)
```python
class UserEdit(BaseModel):
    username: str
    password: Optional[str] = None
    birthday: Optional[datetime] = None

@app.patch("/user/")
async def edit_user(user_edit: UserEdit, db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.username == user_edit.username).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    try:
        if user_edit.password is not None:
            user.password = hashlib.sha256(user_edit.password.encode()).hexdigest()
        if user_edit.birthday is not None:
            user.birthday = user_edit.birthday
        db.commit()
        return {"message": "User updated successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Invalid data format: {e}")
```
**Explanation:**
- Requires authentication.
- Updates only the fields provided in the request.
- Hashes the password if it's being changed.

---

#### 8.6. Delete User (DELETE `/user/`)
```python
@app.delete("/user/")
async def delete_user(username: str = Form(...), db: Session = Depends(get_db), current_user: str = Depends(get_current_user)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=400, detail="User does not exist")
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}
```
**Explanation:**
- Requires authentication.
- Deletes the user with the given username if they exist.

---

#### 8.7. Get Current User (GET `/users/me`)
```python
@app.get("/users/me")
async def read_users_me(current_user: str = Depends(get_current_user)):
    return {"username": current_user}
```
**Explanation:**
- Requires authentication.
- Returns the username of the currently authenticated user (from the JWT token).

---

## 🏃 9. Running the App

### 9.1. `run.py`
```python
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
```
**Explanation:**
- Runs your FastAPI app with hot-reload enabled for development.

### 9.2. Start the Server
```bash
poetry run python run.py
```
*Starts your backend server on http://localhost:8000.*

---

## 🧪 10. Testing Your API

- Use **Swagger UI** at [http://localhost:8000/docs](http://localhost:8000/docs) to try out endpoints.
- Use **Postman** or **curl** for manual testing.
- Remember to:
  - Register a user (`POST /user/`)
  - Log in to get a token (`POST /login`)
  - Use the token in the `Authorization` header for all protected endpoints:
    ```
    Authorization: Bearer <your_jwt_token>
    ```

---

## 🎉 Congratulations!
You've built a secure, modern backend with FastAPI, PostgreSQL, and JWT authentication. You now know how to:
- Structure a backend project
- Set up a database and models
- Use Alembic for migrations
- Implement JWT authentication
- Protect endpoints
- Test your API

If you have any questions or want to add more features, just ask. Happy coding! 🚀
