from datetime import datetime
from sqlalchemy import Column, String, Date, DateTime
from app.database.config import Base

class User(Base):
    __tablename__ = "users"

    username = Column(String, primary_key=True)
    password = Column(String, nullable=False)
    birthday = Column(Date)
    create_time = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime, nullable=True) 