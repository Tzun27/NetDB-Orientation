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
    setTodoLists(prevLists =>
      prevLists.map(list => list.id === updatedList.id ? updatedList : list)
    );
  };

  return (
    <div className="app-container">
      <Banner />
      <div className="content-container">
        <LeftPanel
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          todoLists={todoLists}
          setTodoLists={setTodoLists}
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
