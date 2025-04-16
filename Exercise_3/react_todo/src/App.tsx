import './App.css'
import Banner from './components/layout/Banner'
import LeftPanel from './components/layout/LeftPanel'
import RightPanel from './components/layout/RightPanel'
import { useState, useEffect } from 'react'
import { TodoList, loadTodoLists, saveTodoLists } from './utils/storage'

function App() {
  // Initialize state with loaded data
  const [todoLists, setTodoLists] = useState<TodoList[]>(() => {
    const initialLists = loadTodoLists();
    console.log('Initializing state with:', initialLists);
    return initialLists;
  });

  const [selectedListId, setSelectedListId] = useState<string | null>(null);

  // Save todo lists to local storage whenever they change
  useEffect(() => {
    console.log('Todo lists changed, saving:', todoLists);
    saveTodoLists(todoLists);
  }, [todoLists]);

  const selectedList = todoLists.find(list => list.id === selectedListId) || null;

  const handleUpdateList = (updatedList: TodoList) => {
    setTodoLists(prevLists => {
      const exists = prevLists.some(list => list.id === updatedList.id);
      if (exists) {
        return prevLists.map(list => list.id === updatedList.id ? updatedList : list);
      } else {
        return [...prevLists, updatedList];
      }
    });
  };

  const handleDeleteList = (listId: string) => {
    setTodoLists(prevLists => prevLists.filter(list => list.id !== listId));
    if (selectedListId === listId) {
      setSelectedListId(null);
    }
  };

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
