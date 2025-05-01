from app.db.session import SessionLocal
from app.models.todo import TodoList, Task
from sqlalchemy.orm import joinedload

def view_data():
    db = SessionLocal()
    try:
        # Get all todo lists with their tasks
        todo_lists = db.query(TodoList).options(joinedload(TodoList.tasks)).all()
        
        print("\n=== Todo Lists and Tasks ===")
        for todo_list in todo_lists:
            print(f"\nList: {todo_list.name} (ID: {todo_list.id})")
            print("Tasks:")
            for task in todo_list.tasks:
                print(f"""  - {task.name}
    ID: {task.id}
    Description: {task.description}
    Deadline: {task.deadline}
    Priority: {task.priority}
    Completed: {task.completed}""")
            print(f"Total tasks: {len(todo_list.tasks)}")
        
        # Print some statistics
        print("\n=== Statistics ===")
        total_lists = db.query(TodoList).count()
        total_tasks = db.query(Task).count()
        completed_tasks = db.query(Task).filter(Task.completed == True).count()
        
        print(f"Total lists: {total_lists}")
        print(f"Total tasks: {total_tasks}")
        print(f"Completed tasks: {completed_tasks}")
        print(f"Completion rate: {(completed_tasks/total_tasks*100 if total_tasks else 0):.1f}%")
        
    except Exception as e:
        print(f"Error viewing data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Viewing database data...")
    view_data() 