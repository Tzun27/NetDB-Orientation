import React from 'react';
import './TodoListItem.css';

interface TodoListItemProps {
    name: string;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ name, isSelected, onClick, onDelete }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent's onClick
        onDelete();
    };

    return (
        <div
            className={`todo-list-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <span className="todo-list-name">{name}</span>
            <button
                className="delete-button"
                onClick={handleDelete}
                title="Delete list"
            >
                ×
            </button>
        </div>
    );
};

export default TodoListItem; 