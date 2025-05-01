from sqlalchemy import Column, String, DateTime, Boolean, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
from enum import Enum as PyEnum

from app.db.base_class import Base

class PriorityEnum(str, PyEnum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

class TodoList(Base):
    __tablename__ = "todo_lists"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    
    # Relationship with Task model
    tasks = relationship("Task", back_populates="todo_list", cascade="all, delete-orphan")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    deadline = Column(DateTime, nullable=False)
    priority = Column(Enum(PriorityEnum), nullable=False)
    completed = Column(Boolean, default=False)
    
    # Foreign key to TodoList
    todo_list_id = Column(String, ForeignKey("todo_lists.id"), nullable=False)
    todo_list = relationship("TodoList", back_populates="tasks") 