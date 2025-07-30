// User types
export interface User {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

// Project types
export interface Project {
  id: number;
  name: string;
  userId: number;
  tasks: Task[];
  _count?: {
    tasks: number;
  };
  createdAt: string;
  updatedAt: string;
}

// Task types
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  projectId: number;
  project?: {
    id: number;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

// Dashboard stats
export interface TaskStats {
  totalTasks: number;
  completedTasks: number;
  activeTasks: number;
  projectsWithTasks: number;
  completionRate: number;
}

// Filter types
export type TaskFilter = 'all' | 'active' | 'completed';

// API Error type
export interface ApiError {
  error: string;
  message?: string;
}