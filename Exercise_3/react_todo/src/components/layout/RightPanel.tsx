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
    const [editingTask, setEditingTask] = useState<Task | null>(null);

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

    const handleEditTask = (taskData: {
        name: string;
        description: string;
        deadline: Date;
        priority: 'high' | 'medium' | 'low';
    }) => {
        if (selectedList && editingTask) {
            const updatedTask: Task = {
                ...editingTask,
                ...taskData
            };

            const updatedList = {
                ...selectedList,
                tasks: selectedList.tasks.map(task =>
                    task.id === editingTask.id ? updatedTask : task
                )
            };

            onUpdateList(updatedList);
            setEditingTask(null);
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

    const handleBoredClick = async () => {
        try {
            const response = await fetch('https://bored.api.lewagon.com/api/activity');
            const data = await response.json();

            if (selectedList && data.activity) {
                const newTask: Task = {
                    id: Date.now().toString(),
                    name: data.activity,
                    description: 'Generated from Bored API',
                    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
                    priority: 'medium',
                    completed: false
                };

                const updatedList = {
                    ...selectedList,
                    tasks: [...selectedList.tasks, newTask]
                };

                onUpdateList(updatedList);
            }
        } catch (error) {
            console.error('Error fetching activity:', error);
        }
    };

    return (
        <div className="right-panel">
            {selectedList ? (
                <>
                    <div className="panel-header">
                        <h2>{selectedList.name}</h2>
                        <div className="button-group">
                            <button
                                className="bored-button"
                                onClick={handleBoredClick}
                            >
                                Bored
                            </button>
                            <button
                                className="create-task-button"
                                onClick={() => setIsCreateTaskDialogOpen(true)}
                            >
                                Create Task
                            </button>
                        </div>
                    </div>

                    <div className="tasks-container">
                        {selectedList.tasks.map(task => (
                            <TaskItem
                                key={task.id}
                                task={task}
                                onToggleComplete={() => handleToggleTaskComplete(task.id)}
                                onDelete={() => handleDeleteTask(task.id)}
                                onEdit={() => setEditingTask(task)}
                            />
                        ))}
                    </div>

                    <CreateTaskDialog
                        isOpen={isCreateTaskDialogOpen}
                        onClose={() => setIsCreateTaskDialogOpen(false)}
                        onSubmit={handleCreateTask}
                    />

                    {editingTask && (
                        <CreateTaskDialog
                            isOpen={true}
                            onClose={() => setEditingTask(null)}
                            onSubmit={handleEditTask}
                            initialData={{
                                name: editingTask.name,
                                description: editingTask.description,
                                deadline: editingTask.deadline,
                                priority: editingTask.priority
                            }}
                        />
                    )}
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