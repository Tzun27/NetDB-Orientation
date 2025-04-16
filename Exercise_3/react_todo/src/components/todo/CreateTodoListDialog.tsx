import React, { useState, useEffect } from 'react';
import './CreateTodoListDialog.css';

interface CreateTodoListDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (listName: string) => void;
}

const CreateTodoListDialog: React.FC<CreateTodoListDialogProps> = ({ isOpen, onClose, onSubmit }) => {
    const [listName, setListName] = useState('');

    // Clear the input field when the dialog is closed
    useEffect(() => {
        if (!isOpen) {
            setListName('');
        }
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (listName.trim()) {
            onSubmit(listName.trim());
            setListName('');
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <dialog className="create-todo-dialog" open>
            <form onSubmit={handleSubmit} className="dialog-form">
                <h2>Create New Todo List</h2>
                <input
                    type="text"
                    value={listName}
                    onChange={(e) => setListName(e.target.value)}
                    placeholder="Enter list name"
                    required
                />
                <div className="dialog-buttons">
                    <button type="button" onClick={onClose}>Cancel</button>
                    <button type="submit">Create</button>
                </div>
            </form>
        </dialog>
    );
};

export default CreateTodoListDialog; 