import React, { useState, useEffect } from 'react';
import './LeftPanel.css';
import CreateTodoListDialog from '../todo/CreateTodoListDialog';
import TodoListItem from '../todo/TodoListItem';
import { saveTodoLists, loadTodoLists } from '../../utils/storage';

interface TodoList {
    id: string;
    name: string;
}

const LeftPanel: React.FC = () => {
    // Initialize state with loaded data
    const [todoLists, setTodoLists] = useState<TodoList[]>(() => {
        const initialLists = loadTodoLists();
        console.log('Initializing state with:', initialLists);
        return initialLists;
    });

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedListId, setSelectedListId] = useState<string | null>(null);

    // Save todo lists to local storage whenever they change
    useEffect(() => {
        console.log('Todo lists changed, saving:', todoLists);
        saveTodoLists(todoLists);
    }, [todoLists]);

    const handleCreateList = (listName: string) => {
        const newList: TodoList = {
            id: Date.now().toString(),
            name: listName
        };
        setTodoLists(prevLists => [...prevLists, newList]);
    };

    const handleDeleteList = (listId: string) => {
        setTodoLists(prevLists => {
            const newLists = prevLists.filter(list => list.id !== listId);
            console.log('Deleting list, new state:', newLists);
            return newLists;
        });
        if (selectedListId === listId) {
            setSelectedListId(null);
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
                        onClick={() => setSelectedListId(list.id)}
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