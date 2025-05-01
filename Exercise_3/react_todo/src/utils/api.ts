import { Task, TodoList } from './storage';

const API_BASE_URL = 'http://localhost:8000';

export const api = {
    // Project (TodoList) operations
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
    },

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
    },

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
    },

    async deleteProject(projectId: string): Promise<void> {
        await fetch(`${API_BASE_URL}/projects/${projectId}`, {
            method: 'DELETE'
        });
    },

    // Task operations
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
    },

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
    },

    async deleteTask(taskId: string): Promise<void> {
        await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
            method: 'DELETE'
        });
    }
}; 