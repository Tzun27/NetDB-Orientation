import React from 'react';
import './TodoList.css';

interface TodoListProps {
    list: {
        id: string;
        name: string;
        tasks: Array<{
            id: string;
            name: string;
            description: string;
            deadline: Date;
            priority: 'high' | 'medium' | 'low';
            completed: boolean;
        }>;
    };
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ list, isSelected, onSelect, onDelete, onEdit }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    return (
        <div
            className={`todo-list ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="list-header">
                <span className="list-name">{list.name}</span>
                <div className="list-actions">
                    <button className="edit-list-button" onClick={handleEdit}>
                        ✎
                    </button>
                    <button className="delete-list-button" onClick={handleDelete}>
                        ×
                    </button>
                </div>
            </div>
            <div className="task-count">
                {list.tasks.length} {list.tasks.length === 1 ? 'task' : 'tasks'}
            </div>
        </div>
    );
};

export default TodoList; 