from sqlalchemy import inspect, text
from app.db.session import engine
from app.models.todo import TodoList, Task, PriorityEnum

def check_tables():
    inspector = inspect(engine)
    
    print("\n=== Database Tables ===")
    for table_name in inspector.get_table_names():
        print(f"\nTable: {table_name}")
        print("Columns:")
        for column in inspector.get_columns(table_name):
            print(f"  - {column['name']}: {column['type']}")
        
        # Get foreign keys
        foreign_keys = inspector.get_foreign_keys(table_name)
        if foreign_keys:
            print("Foreign Keys:")
            for fk in foreign_keys:
                print(f"  - {fk['constrained_columns']} -> {fk['referred_table']}.{fk['referred_columns']}")
        
        # Get indices
        indices = inspector.get_indexes(table_name)
        if indices:
            print("Indices:")
            for idx in indices:
                print(f"  - {idx['name']}: {idx['column_names']}")

def check_enum_values():
    print("\n=== Priority Enum Values ===")
    for priority in PriorityEnum:
        print(f"  - {priority.value}")

if __name__ == "__main__":
    print("Checking database structure...")
    check_tables()
    check_enum_values()
    print("\nDatabase check complete!") 