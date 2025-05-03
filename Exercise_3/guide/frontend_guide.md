# 🚀 Getting Started: Creating a Vite + React + TypeScript Project

Welcome! In this section, we'll walk through how to set up a modern React project using [Vite](https://vitejs.dev/) and TypeScript. Vite is a super-fast build tool that makes developing React apps a breeze.

---

## 1. What is Vite?

> **Vite** is a next-generation frontend build tool that provides instant server start and lightning-fast hot module replacement (HMR). It's a great alternative to Create React App!

---

## 2. Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v14.18+, but latest LTS is recommended)
- **npm** (comes with Node.js) or **yarn**

You can check if you have them by running:

```bash
node -v
npm -v
```

If you see version numbers, you're good to go!

---

## 3. Create Your Project

Open your terminal and run the following command to create a new Vite project with React and TypeScript:

```bash
npm create vite@latest my-react-app -- --template react-ts
```

- `my-react-app` is your project folder name. You can change it to whatever you like!
- `--template react-ts` tells Vite to use the React + TypeScript template.

**If you're using yarn:**

```bash
yarn create vite my-react-app --template react-ts
```

---

## 4. Install Dependencies

Navigate into your new project folder and install the required packages:

```bash
cd my-react-app
npm install
```

Or with yarn:

```bash
yarn
```

---

## 5. Start the Development Server

Now, let's see your app in action! Run:

```bash
npm run dev
```

Or with yarn:

```bash
yarn dev
```

This will start the Vite development server. Open your browser and go to [http://localhost:5173](http://localhost:5173) to see your new React + TypeScript app! 🎉

---

## 6. Project Structure Overview

Your new project will look something like this:

```
my-react-app/
├─ node_modules/
├─ public/
├─ src/
│  ├─ App.tsx
│  ├─ main.tsx
│  └─ ...
├─ index.html
├─ package.json
├─ tsconfig.json
├─ vite.config.ts
└─ ...
```

- `src/` is where your React components and code live.
- `vite.config.ts` is the Vite configuration file.
- `tsconfig.json` configures TypeScript.

---

## 🧩 Understanding `main.tsx` and `App.tsx`

Now that your project is set up, let's dive into the two most important files in any React app: `main.tsx` and `App.tsx`. These files are the entry point and the heart of your application!

---

## 1. `main.tsx` — The Entry Point

This file is the starting point of your React app. Its main job is to render your root component (usually `App`) into the HTML page.

**Here's what a typical `main.tsx` looks like:**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### What does this do?
- **Imports:**
  - `StrictMode`: A tool for highlighting potential problems in your app during development.
  - `createRoot`: The new way (React 18+) to start your app and attach it to the DOM.
  - `App`: Your main React component (see below!).
- **Rendering:**
  - `createRoot(document.getElementById('root')!)` finds the `<div id="root"></div>` in your `index.html`.
  - `.render(...)` tells React to display your app inside that div.
  - `<StrictMode>` wraps your app to help catch bugs early (only affects development).

> **In short:** `main.tsx` is the bridge between your HTML and your React code!

---

## 2. `App.tsx` — The Heart of Your App

This file is where your main application logic lives. Think of it as the central hub that brings together all your components and features.

**Here's a simplified breakdown of what happens in `App.tsx`:**

```tsx
function App() {
  // State for todo lists, selected list, and loading
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load todo lists from API when the app starts
  useEffect(() => {
    // ...fetch data and update state...
  }, []);

  // Find the currently selected list
  const selectedList = todoLists.find(list => list.id === selectedListId) || null;

  // Functions to update, delete, and manage lists and tasks
  // ...handleUpdateList, handleDeleteList...

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Banner />
      <div className="content-container">
        <LeftPanel ... />
        <RightPanel ... />
      </div>
    </div>
  );
}
```

### Key Concepts in `App.tsx`:
- **State Management:**
  - Uses `useState` to keep track of todo lists, which list is selected, and whether data is loading.
- **Data Fetching:**
  - Uses `useEffect` to load data from an API when the app starts.
- **Component Structure:**
  - Renders a `Banner` at the top.
  - Uses a two-panel layout: `LeftPanel` (for list selection and management) and `RightPanel` (for viewing/editing tasks in the selected list).
- **Event Handlers:**
  - Functions like `handleUpdateList` and `handleDeleteList` manage changes to your todo lists and tasks, syncing with the backend API.
- **Conditional Rendering:**
  - Shows a loading message until data is ready.

### How `main.tsx` and `App.tsx` Work Together
- `main.tsx` renders the `App` component into the page.
- `App.tsx` manages the main logic, state, and layout of your application.
- All other components (like `Banner`, `LeftPanel`, `RightPanel`) are organized and controlled by `App`.

---

## 📝 Summary
- **`main.tsx`**: Boots up your app and connects React to the web page.
- **`App.tsx`**: The main component where your app's logic, state, and layout live.

Understanding these two files is the first step to mastering any React project!

---

## ✅ That's it! 

You now have a blazing-fast React + TypeScript project ready for development. In the next sections, we'll dive deeper into how to build features, organize your code, and more.

---

# 🖼️ Exploring the Layout Components

In this section, we'll explore the components that make up the layout of your React app: `LeftPanel.tsx`, `RightPanel.tsx`, and `Banner.tsx`. These components are crucial for structuring your app's user interface.

---

## 1. `Banner.tsx` — The Header Component

This component is responsible for displaying the header or banner of your app. It's a simple component that usually contains branding or navigation links.

**Code Explanation:**

```tsx
import React from 'react';
import './Banner.css';

const Banner: React.FC = () => {
    return (
        <header className="banner">
            <h1>Todo List</h1>
        </header>
    );
};

export default Banner;
```

### Key Points:
- **Styling:** Uses `Banner.css` to style the header.
- **Purpose:** Provides a consistent header across your app.

---

## 2. `LeftPanel.tsx` — The Navigation Panel

This component acts as the navigation panel where users can select different todo lists. It interacts with the app's state to display and manage lists.

**Code Explanation:**

```tsx
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
```

### Key Points:
- **Props:** Receives lists, selectedListId, and functions to handle list selection, updates, and deletions.
- **State Management:** Uses `useState` to manage dialog visibility and editing state.
- **Interactivity:** Allows users to select, edit, and delete todo lists.
- **Styling:** Uses `LeftPanel.css` for layout and design.

---

## 3. `RightPanel.tsx` — The Content Display

This component displays the tasks of the selected todo list. It provides functionality to add, edit, and delete tasks.

**Code Explanation:**

```tsx
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
```

### Key Points:
- **Props:** Receives the selected list and a function to update the list.
- **State Management:** Uses `useState` to manage dialog visibility and editing state.
- **Functionality:** Displays tasks and provides options to edit or delete them.
- **Styling:** Uses `RightPanel.css` for layout and design.

---

## 📝 Summary
- **`Banner.tsx`**: Displays the app's header.
- **`LeftPanel.tsx`**: Manages and displays the list of todo lists.
- **`RightPanel.tsx`**: Shows tasks for the selected list and allows task management.

These components work together to create a cohesive and interactive user interface for your app!

---

# 📝 Understanding the Todo Components

In this section, we'll explore the components that handle the todo lists and tasks in your React app: `CreateTodoListDialog.tsx`, `TodoList.tsx`, `CreateTaskDialog.tsx`, `TaskItem.tsx`, and `TodoListItem.tsx`. These components are essential for managing and displaying your todo data.

---

## 🔍 Deep Dive into React Components and Hooks

In this section, we'll explore the components that handle the todo lists and tasks in your React app: `CreateTodoListDialog.tsx`, `TodoList.tsx`, `CreateTaskDialog.tsx`, `TaskItem.tsx`, and `TodoListItem.tsx`. We'll also explain the `useEffect` hook, which is crucial for managing side effects in React components.

---

## Understanding `useEffect`

`useEffect` is a hook in React that lets you perform side effects in function components. Side effects can include data fetching, subscriptions, or manually changing the DOM.

### How `useEffect` Works:
- **Basic Syntax:**
  ```jsx
  useEffect(() => {
    // Your side effect code here
    return () => {
      // Cleanup code here (optional)
    };
  }, [dependencies]);
  ```
- **Dependencies Array:**
  - The second argument to `useEffect` is an array of dependencies. The effect runs after every render if the dependencies have changed.
  - If you pass an empty array `[]`, the effect runs only once after the initial render.
- **Cleanup Function:**
  - If your effect returns a function, React will run it when the component unmounts or before the effect runs again.

### Example:
```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('This will run every second!');
  }, 1000);

  return () => clearInterval(timer); // Cleanup on unmount
}, []); // Empty array means this runs once
```

---

## 1. `CreateTodoListDialog.tsx` — Dialog for Creating/Editing Todo Lists

This component provides a dialog interface for creating or editing todo lists.

**Detailed Code Explanation:**

```tsx
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
```

### Key Points:
- **Props:**
  - `isOpen`: Controls the visibility of the dialog.
  - `onClose`: Function to close the dialog.
  - `onSubmit`: Function to handle the submission of the list name.
  - `initialName`: Optional initial name for editing an existing list.
- **State Management:**
  - `useState` is used to manage the input field for the list name.
- **Effect Hook:**
  - `useEffect` updates the input field whenever `initialName` changes.
- **Styling:**
  - Uses `CreateTodoListDialog.css` for layout and design.

---

## 2. `TodoList.tsx` — Displaying Todo Lists

This component displays a single todo list with options to select, edit, or delete it.

**Detailed Code Explanation:**

```tsx
import React from 'react';
import './TodoList.css';

interface TodoListProps {
    list: {
        id: string;
        name: string;
        tasks: Array<{
            id: string;
            name: string;
            description: string;
            deadline: Date;
            priority: 'high' | 'medium' | 'low';
            completed: boolean;
        }>;
    };
    isSelected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

const TodoList: React.FC<TodoListProps> = ({ list, isSelected, onSelect, onDelete, onEdit }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        onDelete();
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    return (
        <div
            className={`todo-list ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="list-header">
                <span className="list-name">{list.name}</span>
                <div className="list-actions">
                    <button className="edit-list-button" onClick={handleEdit}>
                        ✎
                    </button>
                    <button className="delete-list-button" onClick={handleDelete}>
                        ×
                    </button>
                </div>
            </div>
            <div className="task-count">
                {list.tasks.length} {list.tasks.length === 1 ? 'task' : 'tasks'}
            </div>
        </div>
    );
};

export default TodoList;
```

### Key Points:
- **Props:**
  - `list`: Contains the list's details and tasks.
  - `isSelected`: Indicates if the list is currently selected.
  - `onSelect`, `onDelete`, `onEdit`: Functions to handle user interactions.
- **Interactivity:**
  - Clicking the list triggers `onSelect`.
  - Buttons for editing and deleting have their own handlers to prevent event propagation.
- **Styling:**
  - Uses `TodoList.css` for layout and design.

---

## 3. `CreateTaskDialog.tsx` — Dialog for Creating/Editing Tasks

This component provides a dialog interface for creating or editing tasks within a todo list.

**Detailed Code Explanation:**

```tsx
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
```

### Key Points:
- **Props:**
  - `isOpen`: Controls the visibility of the dialog.
  - `onClose`: Function to close the dialog.
  - `onSubmit`: Function to handle the submission of task data.
  - `initialData`: Optional initial data for editing an existing task.
- **State Management:**
  - `useState` is used to manage input fields for task details.
- **Effect Hook:**
  - `useEffect` initializes form fields when `initialData` changes.
- **Styling:**
  - Uses `CreateTaskDialog.css` for layout and design.

---

## 4. `TaskItem.tsx` — Displaying Individual Tasks

This component displays a single task with options to toggle completion, edit, or delete it.

**Detailed Code Explanation:**

```tsx
import React from 'react';
import { format } from 'date-fns';
import './TaskItem.css';
import { Task } from '../../utils/storage';

interface TaskItemProps {
    task: Task;
    onToggleComplete: () => void;
    onDelete: () => void;
    onEdit: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleComplete, onDelete, onEdit }) => {
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

    const handleEdit = (e: React.MouseEvent) => {
        e.stopPropagation();
        onEdit();
    };

    return (
        <div className={`task-item ${task.completed ? 'completed' : ''}`} onClick={onToggleComplete}>
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
                <div className="task-actions">
                    <button className="edit-task-button" onClick={handleEdit}>
                        ✎
                    </button>
                    <button
                        className="delete-task-button"
                        onClick={handleDelete}
                        title="Delete task"
                    >
                        ×
                    </button>
                </div>
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
```

### Key Points:
- **Props:**
  - `task`: Contains the task's details.
  - `onToggleComplete`, `onDelete`, `onEdit`: Functions to handle user interactions.
- **Interactivity:**
  - Clicking the task toggles its completion status.
  - Buttons for editing and deleting have their own handlers to prevent event propagation.
- **Styling:**
  - Uses `TaskItem.css` for layout and design.

---

## 5. `TodoListItem.tsx` — Displaying Todo List Items

This component displays a single todo list item with options to select or delete it.

**Detailed Code Explanation:**

```tsx
import React from 'react';
import './TodoListItem.css';

interface TodoListItemProps {
    name: string;
    isSelected: boolean;
    onClick: () => void;
    onDelete: () => void;
}

const TodoListItem: React.FC<TodoListItemProps> = ({ name, isSelected, onClick, onDelete }) => {
    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the parent's onClick
        onDelete();
    };

    return (
        <div
            className={`todo-list-item ${isSelected ? 'selected' : ''}`}
            onClick={onClick}
        >
            <span className="todo-list-name">{name}</span>
            <button
                className="delete-button"
                onClick={handleDelete}
                title="Delete list"
            >
                ×
            </button>
        </div>
    );
};

export default TodoListItem;
```

### Key Points:
- **Props:**
  - `name`: The name of the list item.
  - `isSelected`: Indicates if the item is currently selected.
  - `onClick`, `onDelete`: Functions to handle user interactions.
- **Interactivity:**
  - Clicking the item triggers `onClick`.
  - The delete button has its own handler to prevent event propagation.
- **Styling:**
  - Uses `TodoListItem.css` for layout and design.

---

## 📝 Summary
- **`CreateTodoListDialog.tsx`**: Manages the creation and editing of todo lists.
- **`TodoList.tsx`**: Displays a todo list with options to select, edit, or delete.
- **`CreateTaskDialog.tsx`**: Manages the creation and editing of tasks.
- **`TaskItem.tsx`**: Displays individual tasks with options to toggle, edit, or delete.
- **`TodoListItem.tsx`**: Displays todo list items with options to select or delete.

These components work together to provide a comprehensive interface for managing todo lists and tasks in your app!

---

# 📊 Data Structure and API Integration

In this section, we'll explore how the todo list and tasks data are structured and stored, and how the frontend connects to the backend using the `api.ts` file. This will help you understand how data flows between the client and server in a React application.

---

## Data Structure for Todo Lists and Tasks

The data for todo lists and tasks is structured using TypeScript interfaces, which define the shape of the data objects.

### Todo List Structure
- **Interface:** `TodoList`
  ```typescript
  export interface TodoList {
      id: string;
      name: string;
      tasks: Task[];
  }
  ```
  - **id:** A unique identifier for the todo list.
  - **name:** The name of the todo list.
  - **tasks:** An array of tasks associated with the list.

### Task Structure
- **Interface:** `Task`
  ```typescript
  export interface Task {
      id: string;
      name: string;
      description: string;
      deadline: Date;
      priority: 'high' | 'medium' | 'low';
      completed: boolean;
  }
  ```
  - **id:** A unique identifier for the task.
  - **name:** The name of the task.
  - **description:** A brief description of the task.
  - **deadline:** The due date for the task.
  - **priority:** The priority level of the task (high, medium, or low).
  - **completed:** A boolean indicating if the task is completed.

### Local Storage
- **Purpose:**
  - The `saveTodoLists` and `loadTodoLists` functions handle saving and loading todo lists to and from the browser's local storage.
  - This allows the app to persist data locally, even if the page is refreshed.

---

## Connecting Frontend to Backend with `api.ts`

The `api.ts` file is responsible for handling all interactions with the backend server. It uses the Fetch API to make HTTP requests to a RESTful API.

### API Base URL
- **Constant:** `API_BASE_URL`
  ```typescript
  const API_BASE_URL = 'http://localhost:8000';
  ```
  - **Explanation:**
    - **const:** Declares a constant variable that cannot be reassigned.
    - **API_BASE_URL:** A string that holds the base URL for all API requests.
    - **'http://localhost:8000':** The URL where the backend server is running.

### Project (TodoList) Operations
- **Load Projects:**
  ```typescript
  async loadProjects(): Promise<TodoList[]> {
      const response = await fetch(`${API_BASE_URL}/projects/`);
      const data = await response.json();
      return data.map((project: any) => ({
          ...project,
          tasks: project.tasks.map((task: any) => ({
              ...task,
              deadline: new Date(task.deadline)
          }))
      }));
  }
  ```
  - **Explanation:**
    - **async:** Declares an asynchronous function that returns a promise.
    - **loadProjects():** The function name, which indicates it loads projects.
    - **Promise<TodoList[]>:** Specifies that the function returns a promise that resolves to an array of `TodoList` objects.
    - **await fetch(...):** Waits for the fetch request to complete and returns the response.
    - **`${API_BASE_URL}/projects/`:** Template literal that constructs the URL for the request.
    - **response.json():** Parses the response body as JSON.
    - **data.map(...):** Transforms the array of projects, converting task deadlines to `Date` objects.

- **Create Project:**
  ```typescript
  async createProject(name: string): Promise<TodoList> {
      const response = await fetch(`${API_BASE_URL}/projects/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name })
      });
      const data = await response.json();
      return {
          ...data,
          tasks: []
      };
  }
  ```
  - **Explanation:**
    - **method: 'POST':** Specifies the HTTP method for the request.
    - **headers:** An object containing request headers.
    - **'Content-Type': 'application/json':** Indicates the request body format is JSON.
    - **body: JSON.stringify({ name }):** Converts the JavaScript object to a JSON string for the request body.
    - **return {...data, tasks: []}:** Returns the new project data with an empty tasks array.

- **Update Project:**
  ```typescript
  async updateProject(projectId: string, updates: Partial<TodoList>): Promise<TodoList> {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(updates)
      });
      const data = await response.json();
      return {
          ...data,
          tasks: data.tasks.map((task: any) => ({
              ...task,
              deadline: new Date(task.deadline)
          }))
      };
  }
  ```
  - **Explanation:**
    - **method: 'PATCH':** Specifies the HTTP method for updating resources.
    - **body: JSON.stringify(updates):** Converts the updates object to a JSON string.
    - **tasks.map(...):** Transforms tasks to ensure deadlines are `Date` objects.

- **Delete Project:**
  ```typescript
  async deleteProject(projectId: string): Promise<void> {
      await fetch(`${API_BASE_URL}/projects/${projectId}`, {
          method: 'DELETE'
      });
  }
  ```
  - **Explanation:**
    - **method: 'DELETE':** Specifies the HTTP method for deleting resources.
    - **Promise<void>:** Indicates the function returns a promise that resolves with no value.

### Task Operations
- **Create Task:**
  ```typescript
  async createTask(projectId: string, task: Omit<Task, 'id' | 'project_id'>): Promise<Task> {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...task,
              deadline: task.deadline.toISOString()
          })
      });
      const data = await response.json();
      return {
          ...data,
          deadline: new Date(data.deadline)
      };
  }
  ```
  - **Explanation:**
    - **Omit<Task, 'id' | 'project_id'>:** TypeScript utility type that excludes `id` and `project_id` from `Task`.
    - **deadline: task.deadline.toISOString():** Converts the deadline to a string format suitable for JSON.

- **Update Task:**
  ```typescript
  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              ...updates,
              deadline: updates.deadline?.toISOString()
          })
      });
      const data = await response.json();
      return {
          ...data,
          deadline: new Date(data.deadline)
      };
  }
  ```
  - **Explanation:**
    - **updates.deadline?.toISOString():** Optional chaining to safely convert the deadline if it exists.

- **Delete Task:**
  ```typescript
  async deleteTask(taskId: string): Promise<void> {
      await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
          method: 'DELETE'
      });
  }
  ```
  - **Explanation:**
    - **No Response Handling:**
      - Since the server doesn't return data, there's no need to parse the response.

### Key Concepts for Beginners
- **Fetch API:**
  - Used to make HTTP requests to the backend.
  - Supports various HTTP methods like GET, POST, PATCH, and DELETE.
- **Promises:**
  - Asynchronous operations return promises, which resolve with the response data.
- **JSON:**
  - Data is sent and received in JSON format, which is a lightweight data-interchange format.

By understanding these components and how they interact with the backend, you can effectively manage data in your React application and ensure smooth communication between the client and server.
