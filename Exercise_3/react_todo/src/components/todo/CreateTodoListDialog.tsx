import React, { useState, useEffect } from 'react';
import './CreateTodoListDialog.css';

interface CreateTodoListDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (name: string) => void;
    initialName?: string;
}

const CreateTodoListDialog: React.FC<CreateTodoListDialogProps> = ({
    isOpen,
    onClose,
    onSubmit,
    initialName = ''
}) => {
    const [name, setName] = useState(initialName);

    useEffect(() => {
        setName(initialName);
    }, [initialName]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
            setName('');
            onClose();
        }
    };

    const handleClose = () => {
        setName('');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="dialog-overlay">
            <div className="dialog-content">
                <h2>{initialName ? 'Edit List' : 'Create New List'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">List Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="dialog-actions">
                        <button type="button" onClick={handleClose}>
                            Cancel
                        </button>
                        <button type="submit">
                            {initialName ? 'Save Changes' : 'Create List'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateTodoListDialog; 