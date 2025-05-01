from pydantic import BaseModel, UUID4
from datetime import datetime
from typing import List, Optional
from enum import Enum

class PriorityEnum(str, Enum):
    HIGH = "high"
    MEDIUM = "medium"
    LOW = "low"

# Task schemas
class TaskBase(BaseModel):
    name: str
    description: Optional[str] = None
    deadline: datetime
    priority: PriorityEnum
    completed: bool = False

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: str
    project_id: str

    class Config:
        from_attributes = True

# Project schemas
class ProjectBase(BaseModel):
    name: str

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    tasks: List[Task] = []

    class Config:
        from_attributes = True 