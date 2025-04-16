import React from 'react';
import { format } from 'date-fns';
import './TaskItem.css';
import { Task } from '../../utils/storage';

interface TaskItemProps {
    task: Task;
    onToggleComplete: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return '#dc3545';
            case 'medium': return '#ffc107';
            case 'low': return '#28a745';
            default: return '#6c757d';
        }
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`} onClick={onToggleComplete}>
            <div className="task-header">
                <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={onToggleComplete}
                />
                <div
                    className="priority-dot"
                    style={{ backgroundColor: getPriorityColor(task.priority) }}
                />
                <span className="task-name">{task.name}</span>
                <div className="task-actions">
                    <button className="edit-task-button" onClick={handleEdit}>
                        ✎
                    </button>
                    <button
                        className="delete-task-button"
                        onClick={handleDelete}
                        title="Delete task"
                    >
                        ×
                    </button>
                </div>
            </div>
            <div className="task-details">
                <div className="deadline">
                    Due: {format(task.deadline, 'MMM dd, yyyy')}
                </div>
                <div className="description">
                    {task.description}
                </div>
            </div>
        </div>
    );
};

export default TaskItem; 