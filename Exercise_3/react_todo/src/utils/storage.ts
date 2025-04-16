export interface Task {
    id: string;
    name: string;
    description: string;
    deadline: Date;
    priority: 'high' | 'medium' | 'low';
    completed: boolean;
}

export interface TodoList {
    id: string;
    name: string;
    tasks: Task[];
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
        if (storedLists) {
            const parsedLists = JSON.parse(storedLists);
            // Convert string dates back to Date objects
            return parsedLists.map((list: TodoList) => ({
                ...list,
                tasks: list.tasks.map((task: Task) => ({
                    ...task,
                    deadline: new Date(task.deadline)
                }))
            }));
        }
        return [];
    } catch (error) {
        console.error('Error loading from localStorage:', error);
        return [];
    }
}; 