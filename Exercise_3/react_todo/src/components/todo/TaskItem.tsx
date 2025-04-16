import React from 'react';
import { format } from 'date-fns';
import './TaskItem.css';
import { Task } from '../../utils/storage';

interface TaskItemProps {
    task: Task;
    onToggleComplete: () => void;
    onDelete: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete }) => {
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

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`}>
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
                <button
                    className="delete-task-button"
                    onClick={handleDelete}
                    title="Delete task"
                >
                    ×
                </button>
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