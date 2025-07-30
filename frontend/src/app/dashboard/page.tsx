'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ProjectSidebar } from '@/components/dashboard/ProjectSidebar';
import { TaskList } from '@/components/dashboard/TaskList';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { TaskFilter } from '@/types';
import { Project, Task, TaskStats } from '@/types';
import { projectsApi, tasksApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { LogOut, Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [taskFilter, setTaskFilter] = useState<TaskFilter>('all');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    try {
      setIsLoadingData(true);
      const [projectsData, tasksData, statsData] = await Promise.all([
        projectsApi.getAll(),
        tasksApi.getAll(),
        tasksApi.getStats(),
      ]);
      
      setProjects(projectsData);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleProjectSelect = async (project: Project | null) => {
    setSelectedProject(project);
    try {
      const projectTasks = await tasksApi.getAll(project?.id, taskFilter);
      setTasks(projectTasks);
    } catch (error) {
      console.error('Error loading project tasks:', error);
      toast.error('Failed to load tasks');
    }
  };

  const handleFilterChange = async (filter: TaskFilter) => {
    setTaskFilter(filter);
    try {
      const filteredTasks = await tasksApi.getAll(selectedProject?.id, filter);
      setTasks(filteredTasks);
    } catch (error) {
      console.error('Error filtering tasks:', error);
      toast.error('Failed to filter tasks');
    }
  };

  const handleTaskUpdate = async () => {
    // Reload tasks and stats after task operations
    try {
      const [tasksData, statsData] = await Promise.all([
        tasksApi.getAll(selectedProject?.id, taskFilter),
        tasksApi.getStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (error) {
      console.error('Error updating tasks:', error);
    }
  };

  const handleProjectUpdate = async () => {
    // Reload projects after project operations
    try {
      const projectsData = await projectsApi.getAll();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error updating projects:', error);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900">Task Manager</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="p-6 border-b border-gray-200">
            <DashboardStats stats={stats} />
          </div>
        )}

        {/* Projects */}
        <div className="flex-1 overflow-hidden">
          <ProjectSidebar
            projects={projects}
            selectedProject={selectedProject}
            onProjectSelect={handleProjectSelect}
            onProjectUpdate={handleProjectUpdate}
            isLoading={isLoadingData}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProject ? selectedProject.name : 'All Tasks'}
              </h2>
              <p className="text-sm text-gray-600">
                {selectedProject 
                  ? `${selectedProject.tasks?.length || 0} tasks in this project`
                  : `${tasks.length} tasks total`
                }
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {/* Task Filter */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                {(['all', 'active', 'completed'] as TaskFilter[]).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      taskFilter === filter
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Task List */}
        <div className="flex-1 overflow-hidden">
          <TaskList
            tasks={tasks}
            projects={projects}
            selectedProject={selectedProject}
            onTaskUpdate={handleTaskUpdate}
            isLoading={isLoadingData}
          />
        </div>
      </div>
    </div>
  );
}