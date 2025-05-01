"""Rename todo_lists to projects

Revision ID: 267db1a62674
Revises: d26bd510ed09
Create Date: 2024-05-01 20:08:01.123456

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '267db1a62674'
down_revision: Union[str, None] = 'd26bd510ed09'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Drop the foreign key constraint first
    op.drop_constraint('tasks_todo_list_id_fkey', 'tasks', type_='foreignkey')
    
    # Create the new table
    op.create_table('projects',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_projects_id'), 'projects', ['id'], unique=False)
    
    # Copy data from old table to new table
    op.execute('INSERT INTO projects SELECT * FROM todo_lists')
    
    # Add the project_id column to tasks
    op.add_column('tasks', sa.Column('project_id', sa.String(), nullable=True))
    
    # Copy the todo_list_id values to project_id
    op.execute('UPDATE tasks SET project_id = todo_list_id')
    
    # Make project_id not nullable
    op.alter_column('tasks', 'project_id', nullable=False)
    
    # Add the new foreign key
    op.create_foreign_key(None, 'tasks', 'projects', ['project_id'], ['id'])
    
    # Drop the old column
    op.drop_column('tasks', 'todo_list_id')
    
    # Drop the old table
    op.drop_table('todo_lists')


def downgrade() -> None:
    # Create the old table
    op.create_table('todo_lists',
        sa.Column('id', sa.String(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_todo_lists_id'), 'todo_lists', ['id'], unique=False)
    
    # Copy data back from projects to todo_lists
    op.execute('INSERT INTO todo_lists SELECT * FROM projects')
    
    # Add todo_list_id column
    op.add_column('tasks', sa.Column('todo_list_id', sa.String(), nullable=True))
    
    # Copy project_id values to todo_list_id
    op.execute('UPDATE tasks SET todo_list_id = project_id')
    
    # Make todo_list_id not nullable
    op.alter_column('tasks', 'todo_list_id', nullable=False)
    
    # Add the old foreign key
    op.create_foreign_key('tasks_todo_list_id_fkey', 'tasks', 'todo_lists', ['todo_list_id'], ['id'])
    
    # Drop the project_id column
    op.drop_column('tasks', 'project_id')
    
    # Drop the projects table
    op.drop_table('projects')
