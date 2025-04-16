import React, { useState, useEffect } from 'react';
import './CreateTaskDialog.css';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (taskData: {
        name: string;
        description: string;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    }) => void;
    initialData?: {
        name: string;
        description: string;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    };
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialData
}) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(new Date());
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setDeadline(initialData.deadline);
            setPriority(initialData.priority);
        } else {
            resetForm();
        }
    }, [initialData]);

    const resetForm = () => {
        setName('');
        setDescription('');
        setDeadline(new Date());
        setPriority('medium');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            name,
            description,
            deadline,
            priority
        });
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>{initialData ? 'Edit Task' : 'Create New Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Task Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="deadline">Deadline</label>
                        <input
                            type="date"
                            id="deadline"
                            value={deadline.toISOString().split('T')[0]}
                            onChange={(e) => setDeadline(new Date(e.target.value))}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Priority</label>
                        <div className="priority-buttons">
                            <button
                                type="button"
                                className={`priority-button ${priority === 'high' ? 'active' : ''}`}
                                onClick={() => setPriority('high')}
                            >
                                High
                            </button>
                            <button
                                type="button"
                                className={`priority-button ${priority === 'medium' ? 'active' : ''}`}
                                onClick={() => setPriority('medium')}
                            >
                                Medium
                            </button>
                            <button
                                type="button"
                                className={`priority-button ${priority === 'low' ? 'active' : ''}`}
                                onClick={() => setPriority('low')}
                            >
                                Low
                            </button>
                        </div>
                    </div>

                    <div className="dialog-actions">
                        <button type="button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            {initialData ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTaskDialog; 