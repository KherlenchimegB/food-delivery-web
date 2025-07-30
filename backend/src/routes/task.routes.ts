import express from 'express';
import { prisma } from '../lib/prisma.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all tasks for the authenticated user
router.get('/', async (req: any, res) => {
  try {
    const { projectId, filter } = req.query;

    let whereClause: any = {
      project: {
        userId: req.userId
      }
    };

    if (projectId) {
      whereClause.projectId = parseInt(projectId);
    }

    if (filter === 'active') {
      whereClause.completed = false;
    } else if (filter === 'completed') {
      whereClause.completed = true;
    }

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific task
router.get('/:id', async (req: any, res) => {
  try {
    const taskId = parseInt(req.params.id);
    
    const task = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.userId
        }
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new task
router.post('/', async (req: any, res) => {
  try {
    const { title, projectId } = req.body;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and project ID are required' });
    }

    // Verify project belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: parseInt(projectId),
        userId: req.userId
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const task = await prisma.task.create({
      data: {
        title,
        projectId: parseInt(projectId)
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a task
router.put('/:id', async (req: any, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { title, completed } = req.body;

    // Check if task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.userId
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (completed !== undefined) updateData.completed = completed;

    const task = await prisma.task.update({
      where: {
        id: taskId
      },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(task);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Toggle task completion
router.patch('/:id/toggle', async (req: any, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // Check if task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.userId
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = await prisma.task.update({
      where: {
        id: taskId
      },
      data: {
        completed: !existingTask.completed
      },
      include: {
        project: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    res.json(task);
  } catch (error) {
    console.error('Toggle task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a task
router.delete('/:id', async (req: any, res) => {
  try {
    const taskId = parseInt(req.params.id);

    // Check if task belongs to user
    const existingTask = await prisma.task.findFirst({
      where: {
        id: taskId,
        project: {
          userId: req.userId
        }
      }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: {
        id: taskId
      }
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get task statistics for dashboard
router.get('/stats/dashboard', async (req: any, res) => {
  try {
    const [totalTasks, completedTasks, activeTasks, projectsWithTasks] = await Promise.all([
      prisma.task.count({
        where: {
          project: {
            userId: req.userId
          }
        }
      }),
      prisma.task.count({
        where: {
          project: {
            userId: req.userId
          },
          completed: true
        }
      }),
      prisma.task.count({
        where: {
          project: {
            userId: req.userId
          },
          completed: false
        }
      }),
      prisma.project.count({
        where: {
          userId: req.userId,
          tasks: {
            some: {}
          }
        }
      })
    ]);

    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    res.json({
      totalTasks,
      completedTasks,
      activeTasks,
      projectsWithTasks,
      completionRate
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;