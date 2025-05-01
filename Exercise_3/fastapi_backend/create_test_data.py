from datetime import datetime, timedelta
import uuid
from app.db.session import SessionLocal
from app.models.todo import TodoList, Task, PriorityEnum

def create_test_data():
    db = SessionLocal()
    try:
        # Create two todo lists
        work_list = TodoList(
            id=str(uuid.uuid4()),
            name="Work Tasks"
        )
        
        personal_list = TodoList(
            id=str(uuid.uuid4()),
            name="Personal Tasks"
        )
        
        db.add_all([work_list, personal_list])
        db.flush()  # Flush to get the IDs
        
        # Create tasks for work list
        work_tasks = [
            Task(
                id=str(uuid.uuid4()),
                name="Complete project proposal",
                description="Write and submit Q2 project proposal",
                deadline=datetime.now() + timedelta(days=2),
                priority=PriorityEnum.HIGH,
                completed=False,
                todo_list_id=work_list.id
            ),
            Task(
                id=str(uuid.uuid4()),
                name="Team meeting",
                description="Weekly sync with the development team",
                deadline=datetime.now() + timedelta(days=1),
                priority=PriorityEnum.MEDIUM,
                completed=True,
                todo_list_id=work_list.id
            )
        ]
        
        # Create tasks for personal list
        personal_tasks = [
            Task(
                id=str(uuid.uuid4()),
                name="Grocery shopping",
                description="Buy groceries for the week",
                deadline=datetime.now() + timedelta(days=1),
                priority=PriorityEnum.LOW,
                completed=False,
                todo_list_id=personal_list.id
            ),
            Task(
                id=str(uuid.uuid4()),
                name="Gym session",
                description="Weekly workout routine",
                deadline=datetime.now() + timedelta(hours=4),
                priority=PriorityEnum.MEDIUM,
                completed=False,
                todo_list_id=personal_list.id
            )
        ]
        
        db.add_all(work_tasks + personal_tasks)
        db.commit()
        print("Test data created successfully!")
        
    except Exception as e:
        print(f"Error creating test data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("Creating test data...")
    create_test_data() 