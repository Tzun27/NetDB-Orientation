from sqlalchemy.orm import Session
from app.database.config import SessionLocal
from app.models.user import User

def verify_users():
    db = SessionLocal()
    try:
        # Query all users
        users = db.query(User).all()
        
        print("Users in the database:")
        print("-" * 50)
        for user in users:
            print(f"Username: {user.username}")
            print(f"Password Hash: {user.password}")
            print(f"Birthday: {user.birthday}")
            print(f"Create Time: {user.create_time}")
            print(f"Last Login: {user.last_login}")
            print("-" * 50)
            
    except Exception as e:
        print(f"Error querying users: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_users() 