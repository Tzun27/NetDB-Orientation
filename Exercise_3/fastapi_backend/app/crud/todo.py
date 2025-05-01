from sqlalchemy.orm import Session
from app.models.todo import TodoList as Project, Task
from app.schemas.todo import ProjectCreate, TaskCreate
import uuid

# Project operations
def get_project(db: Session, project_id: str):
    return db.query(Project).filter(Project.id == project_id).first()

def get_projects(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Project).offset(skip).limit(limit).all()

def create_project(db: Session, project: ProjectCreate):
    db_project = Project(id=str(uuid.uuid4()), **project.model_dump())
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def update_project(db: Session, project_id: str, project_data: dict):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project:
        for key, value in project_data.items():
            setattr(db_project, key, value)
        db.commit()
        db.refresh(db_project)
    return db_project

def delete_project(db: Session, project_id: str):
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if db_project:
        db.delete(db_project)
        db.commit()
        return True
    return False

# Task operations
def get_task(db: Session, task_id: str):
    return db.query(Task).filter(Task.id == task_id).first()

def get_tasks_by_project(db: Session, project_id: str, skip: int = 0, limit: int = 100):
    return db.query(Task).filter(Task.project_id == project_id).offset(skip).limit(limit).all()

def create_task(db: Session, task: TaskCreate, project_id: str):
    db_task = Task(id=str(uuid.uuid4()), **task.model_dump(), project_id=project_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: str, task_data: dict):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task:
        for key, value in task_data.items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: str):
    db_task = db.query(Task).filter(Task.id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
        return True
    return False 