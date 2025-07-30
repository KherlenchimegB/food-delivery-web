'use client';

import { TaskStats } from '@/types';
import { CheckCircle, Clock, FolderOpen, TrendingUp } from 'lucide-react';

interface DashboardStatsProps {
  stats: TaskStats;
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  const statItems = [
    {
      label: 'Total Tasks',
      value: stats.totalTasks,
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Active',
      value: stats.activeTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Projects',
      value: stats.projectsWithTasks,
      icon: FolderOpen,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-900">Overview</h3>
        <div className="flex items-center space-x-1">
          <TrendingUp className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-600">
            {stats.completionRate}%
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-gray-600">
          <span>Completion Rate</span>
          <span>{stats.completionRate}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${stats.completionRate}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50"
            >
              <div className={`p-1.5 rounded-md ${item.bgColor}`}>
                <Icon className={`h-3 w-3 ${item.color}`} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 truncate">{item.label}</p>
                <p className="text-sm font-semibold text-gray-900">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}