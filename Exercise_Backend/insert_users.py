import hashlib
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.database.config import SessionLocal, engine
from app.models.user import User

# Create tables if they don't exist
from app.database.config import Base
Base.metadata.create_all(bind=engine)

# Function to hash password with SHA-256
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Sample users data
users_data = [
    {
        "username": "john_doe",
        "password": "securepass123",
        "birthday": date(1990, 5, 15),
    },
    {
        "username": "jane_smith",
        "password": "mypassword456",
        "birthday": date(1988, 11, 22),
    },
    {
        "username": "bob_wilson",
        "password": "strongpass789",
        "birthday": date(1995, 3, 10),
    }
]

# Insert users into the database
def insert_users():
    db = SessionLocal()
    try:
        for user_data in users_data:
            # Hash the password
            hashed_password = hash_password(user_data["password"])
            
            # Create user object
            user = User(
                username=user_data["username"],
                password=hashed_password,
                birthday=user_data["birthday"],
                create_time=datetime.utcnow(),
                last_login=None  # Initially no login
            )
            
            # Add to session
            db.add(user)
        
        # Commit the transaction
        db.commit()
        print("Successfully inserted 3 users into the database!")
        
    except Exception as e:
        db.rollback()
        print(f"Error inserting users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    insert_users() 