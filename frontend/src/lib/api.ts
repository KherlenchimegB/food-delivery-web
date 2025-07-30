import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: async (email: string, password: string) => {
    const response = await api.post('/auth/signup', { email, password });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
};

// Projects API
export const projectsApi = {
  getAll: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },
  
  create: async (name: string) => {
    const response = await api.post('/projects', { name });
    return response.data;
  },
  
  update: async (id: number, name: string) => {
    const response = await api.put(`/projects/${id}`, { name });
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
};

// Tasks API
export const tasksApi = {
  getAll: async (projectId?: number, filter?: 'all' | 'active' | 'completed') => {
    const params = new URLSearchParams();
    if (projectId) params.append('projectId', projectId.toString());
    if (filter && filter !== 'all') params.append('filter', filter);
    
    const response = await api.get(`/tasks?${params.toString()}`);
    return response.data;
  },
  
  getById: async (id: number) => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  
  create: async (title: string, projectId: number) => {
    const response = await api.post('/tasks', { title, projectId });
    return response.data;
  },
  
  update: async (id: number, data: { title?: string; completed?: boolean }) => {
    const response = await api.put(`/tasks/${id}`, data);
    return response.data;
  },
  
  toggle: async (id: number) => {
    const response = await api.patch(`/tasks/${id}/toggle`);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },
  
  getStats: async () => {
    const response = await api.get('/tasks/stats/dashboard');
    return response.data;
  },
};

export default api;