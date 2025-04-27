from sqlalchemy import inspect
from app.database.config import engine

# Get the inspector
inspector = inspect(engine)

# Get all columns in the users table
columns = inspector.get_columns('users')

print("Users Table Structure:")
print("-" * 50)
for column in columns:
    print(f"Column: {column['name']}")
    print(f"  Type: {column['type']}")
    print(f"  Nullable: {column['nullable']}")
    if 'default' in column and column['default'] is not None:
        print(f"  Default: {column['default']}")
    print() 