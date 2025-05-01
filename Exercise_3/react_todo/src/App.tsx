import './App.css'
import Banner from './components/layout/Banner'
import LeftPanel from './components/layout/LeftPanel'
import RightPanel from './components/layout/RightPanel'
import { useState, useEffect } from 'react'
import { TodoList } from './utils/storage'
import { api } from './utils/api'

function App() {
  // Initialize state
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load todo lists from API when component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const lists = await api.loadProjects();
        setTodoLists(lists);
        setLoading(false);
      } catch (error) {
        console.error('Error loading projects:', error);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const selectedList = todoLists.find(list => list.id === selectedListId) || null;

  const handleUpdateList = async (updatedList: TodoList) => {
    try {
      const exists = todoLists.some(list => list.id === updatedList.id);
      if (exists) {
        const currentList = todoLists.find(list => list.id === updatedList.id);
        if (currentList) {
          // Check if only the name changed
          if (currentList.name !== updatedList.name &&
            JSON.stringify(currentList.tasks) === JSON.stringify(updatedList.tasks)) {
            // If only the name changed, use updateProject
            const updated = await api.updateProject(updatedList.id, { name: updatedList.name });
            setTodoLists(prevLists =>
              prevLists.map(list => list.id === updated.id ? updated : list)
            );
            return;
          }

          // Handle task updates and creations
          const taskPromises = updatedList.tasks.map(async task => {
            const existingTask = currentList.tasks.find(t => t.id === task.id);
            if (existingTask) {
              // Update existing task if it changed
              if (JSON.stringify(existingTask) !== JSON.stringify(task)) {
                return api.updateTask(task.id, task);
              }
              return task;
            } else {
              // Create new task
              return api.createTask(updatedList.id, task);
            }
          });

          // Handle task deletions
          const deletedTasks = currentList.tasks.filter(
            task => !updatedList.tasks.some(t => t.id === task.id)
          );
          const deletePromises = deletedTasks.map(task => api.deleteTask(task.id));

          // Wait for all task operations to complete
          await Promise.all([...taskPromises, ...deletePromises]);
        }
      } else {
        // Create new project
        const newProject = await api.createProject(updatedList.name);
        // Create all tasks for the new project
        const taskPromises = updatedList.tasks.map(task =>
          api.createTask(newProject.id, task)
        );
        const createdTasks = await Promise.all(taskPromises);
        updatedList.id = newProject.id;
        updatedList.tasks = createdTasks;
      }

      // Update local state
      setTodoLists(prevLists => {
        if (exists) {
          return prevLists.map(list => list.id === updatedList.id ? updatedList : list);
        } else {
          return [...prevLists, updatedList];
        }
      });
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteList = async (listId: string) => {
    try {
      await api.deleteProject(listId);
      setTodoLists(prevLists => prevLists.filter(list => list.id !== listId));
      if (selectedListId === listId) {
        setSelectedListId(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app-container">
      <Banner />
      <div className="content-container">
        <LeftPanel
          lists={todoLists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onUpdateList={handleUpdateList}
          onDeleteList={handleDeleteList}
        />
        <RightPanel
          selectedList={selectedList}
          onUpdateList={handleUpdateList}
        />
      </div>
    </div>
  );
}

export default App;
