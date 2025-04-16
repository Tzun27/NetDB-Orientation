import React, { useState } from 'react';
import './LeftPanel.css';
import CreateTodoListDialog from '../todo/CreateTodoListDialog';
import TodoListItem from '../todo/TodoListItem';
import { TodoList } from '../../utils/storage';

interface LeftPanelProps {
    selectedListId: string | null;
    onSelectList: (id: string | null) => void;
    todoLists: TodoList[];
    setTodoLists: (lists: TodoList[]) => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    selectedListId,
    onSelectList,
    todoLists,
    setTodoLists
}) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleCreateList = (listName: string) => {
        const newList: TodoList = {
            id: Date.now().toString(),
            name: listName,
            tasks: []
        };
        setTodoLists([...todoLists, newList]);
    };

    const handleDeleteList = (listId: string) => {
        setTodoLists(todoLists.filter(list => list.id !== listId));
        if (selectedListId === listId) {
            onSelectList(null);
        }
    };

    return (
        <div className="left-panel">
            <div className="todo-lists">
                {todoLists.map(list => (
                    <TodoListItem
                        key={list.id}
                        name={list.name}
                        isSelected={list.id === selectedListId}
                        onClick={() => onSelectList(list.id)}
                        onDelete={() => handleDeleteList(list.id)}
                    />
                ))}
            </div>

            <button
                className="create-list-button"
                onClick={() => setIsDialogOpen(true)}
            >
                Create New Todo List
            </button>

            <CreateTodoListDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleCreateList}
            />
        </div>
    );
};

export default LeftPanel; 