import React, { useState } from 'react';
import './RightPanel.css';
import CreateTaskDialog from '../todo/CreateTaskDialog';
import TaskItem from '../todo/TaskItem';
import { TodoList, Task } from '../../utils/storage';

interface RightPanelProps {
    selectedList: TodoList | null;
    onUpdateList: (updatedList: TodoList) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ selectedList, onUpdateList }) => {
    const [isCreateTaskDialogOpen, setIsCreateTaskDialogOpen] = useState(false);

    const handleCreateTask = (taskData: {
        name: string;
        description: string;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    }) => {
        if (selectedList) {
            const newTask: Task = {
                id: Date.now().toString(),
                ...taskData,
                completed: false
            };

            const updatedList = {
                ...selectedList,
                tasks: [...selectedList.tasks, newTask]
            };

            onUpdateList(updatedList);
        }
    };

    const handleToggleTaskComplete = (taskId: string) => {
        if (selectedList) {
            const updatedList = {
                ...selectedList,
                tasks: selectedList.tasks.map(task =>
                    task.id === taskId
                        ? { ...task, completed: !task.completed }
                        : task
                )
            };

            onUpdateList(updatedList);
        }
    };

    const handleDeleteTask = (taskId: string) => {
        if (selectedList) {
            const updatedList = {
                ...selectedList,
                tasks: selectedList.tasks.filter(task => task.id !== taskId)
            };

            onUpdateList(updatedList);
        }
    };

    return (
        <div className="right-panel">
            {selectedList ? (
                <>
                    <div className="panel-header">
                        <h2>{selectedList.name}</h2>
                        <button
                            className="create-task-button"
                            onClick={() => setIsCreateTaskDialogOpen(true)}
                        >
                            Create Task
                        </button>
                    </div>

                    <div className="tasks-container">
                        {selectedList.tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={() => handleToggleTaskComplete(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                            />
                        ))}
                    </div>

                    <CreateTaskDialog
                        isOpen={isCreateTaskDialogOpen}
                        onClose={() => setIsCreateTaskDialogOpen(false)}
                        onSubmit={handleCreateTask}
                    />
                </>
            ) : (
                <div className="no-list-selected">
                    Select a list to view or create tasks
                </div>
            )}
        </div>
    );
};

export default RightPanel; 