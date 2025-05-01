from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.todo import Project, ProjectCreate, Task, TaskCreate
from app.crud import todo as crud
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Todo API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Project endpoints
@app.post("/projects/", response_model=Project, status_code=status.HTTP_201_CREATED)
def create_project(project: ProjectCreate, db: Session = Depends(get_db)):
    return crud.create_project(db=db, project=project)

@app.get("/projects/", response_model=List[Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    projects = crud.get_projects(db, skip=skip, limit=limit)
    return projects

@app.get("/projects/{project_id}", response_model=Project)
def read_project(project_id: str, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

@app.delete("/projects/{project_id}")
def delete_project(project_id: str, db: Session = Depends(get_db)):
    success = crud.delete_project(db, project_id=project_id)
    if not success:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"message": "Project deleted successfully"}

@app.patch("/projects/{project_id}", response_model=Project)
def update_project(project_id: str, project_update: dict, db: Session = Depends(get_db)):
    db_project = crud.update_project(db, project_id=project_id, project_data=project_update)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project

# Task endpoints
@app.post("/projects/{project_id}/tasks/", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(project_id: str, task: TaskCreate, db: Session = Depends(get_db)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    return crud.create_task(db=db, task=task, project_id=project_id)

@app.get("/projects/{project_id}/tasks/", response_model=List[Task])
def read_tasks(project_id: str, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    tasks = crud.get_tasks_by_project(db, project_id=project_id, skip=skip, limit=limit)
    return tasks

@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: str, db: Session = Depends(get_db)):
    db_task = crud.get_task(db, task_id=task_id)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.patch("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: dict, db: Session = Depends(get_db)):
    db_task = crud.update_task(db, task_id=task_id, task_data=task_update)
    if db_task is None:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, db: Session = Depends(get_db)):
    success = crud.delete_task(db, task_id=task_id)
    if not success:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"} 