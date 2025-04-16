interface TodoList {
    id: string;
    name: string;
}

const STORAGE_KEY = 'todoLists';

export const saveTodoLists = (lists: TodoList[]): void => {
    try {
        console.log('Saving to localStorage:', lists);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(lists));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};

export const loadTodoLists = (): TodoList[] => {
    try {
        const storedLists = localStorage.getItem(STORAGE_KEY);
        console.log('Loading from localStorage:', storedLists);
        return storedLists ? JSON.parse(storedLists) : [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}; 