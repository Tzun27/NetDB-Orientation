import React, { useState } from 'react';
import './LeftPanel.css';
import TodoList from '../todo/TodoList';
import CreateTodoListDialog from '../todo/CreateTodoListDialog';
import { TodoList as TodoListType } from '../../utils/storage';

interface LeftPanelProps {
    lists: TodoListType[];
    selectedListId: string | null;
    onSelectList: (listId: string) => void;
    onUpdateList: (updatedList: TodoListType) => void;
    onDeleteList: (listId: string) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    lists,
    selectedListId,
    onSelectList,
    onUpdateList,
    onDeleteList
}) => {
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [editingList, setEditingList] = useState<TodoListType | null>(null);

    const handleCreateList = (name: string) => {
        const newList: TodoListType = {
            id: Date.now().toString(),
            name,
            tasks: []
        };
        onUpdateList(newList);
    };

    const handleEditList = (name: string) => {
        if (editingList) {
            const updatedList = {
                ...editingList,
                name
            };
            onUpdateList(updatedList);
            setEditingList(null);
        }
    };

    return (
        <div className="left-panel">
            <div className="panel-header">
                <h2>Todo Lists</h2>
                <button
                    className="create-list-button"
                    onClick={() => setIsCreateDialogOpen(true)}
                >
                    Create List
                </button>
            </div>

            <div className="lists-container">
                {lists.map(list => (
                    <TodoList
                        key={list.id}
                        list={list}
                        isSelected={list.id === selectedListId}
                        onSelect={() => onSelectList(list.id)}
                        onDelete={() => onDeleteList(list.id)}
                        onEdit={() => setEditingList(list)}
                    />
                ))}
            </div>

            <CreateTodoListDialog
                isOpen={isCreateDialogOpen}
                onClose={() => setIsCreateDialogOpen(false)}
                onSubmit={handleCreateList}
            />

            {editingList && (
                <CreateTodoListDialog
                    isOpen={true}
                    onClose={() => setEditingList(null)}
                    onSubmit={handleEditList}
                    initialName={editingList.name}
                />
            )}
        </div>
    );
};

export default LeftPanel; 