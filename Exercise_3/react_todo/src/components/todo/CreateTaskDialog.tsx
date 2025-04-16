import React, { useState } from 'react';
import { format } from 'date-fns';
import './CreateTaskDialog.css';

interface CreateTaskDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (task: {
        name: string;
        description: string;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    }) => void;
}

const CreateTaskDialog: React.FC<CreateTaskDialogProps> = ({ isOpen, onClose, onSubmit }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [deadline, setDeadline] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('medium');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit({
                name: name.trim(),
                description: description.trim(),
                deadline: new Date(deadline),
                priority
            });
            setName('');
            setDescription('');
            setDeadline(format(new Date(), 'yyyy-MM-dd'));
            setPriority('medium');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="create-task-dialog" open>
            <form onSubmit={handleSubmit} className="dialog-form">
                <h2>Create New Task</h2>

                <div className="form-group">
                    <label htmlFor="taskName">Task Name</label>
                    <input
                        id="taskName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter task name"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Enter task description"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="deadline">Deadline</label>
                    <input
                        id="deadline"
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="priority">Priority</label>
                    <select
                        id="priority"
                        value={priority}
                        onChange={(e) => setPriority(e.target.value as 'high' | 'medium' | 'low')}
                    >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="dialog-buttons">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Create</button>
                </div>
            </form>
        </dialog>
    );
};

export default CreateTaskDialog; 