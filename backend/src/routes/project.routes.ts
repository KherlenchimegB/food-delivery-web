import express from 'express';
import { prisma } from '../lib/prisma.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all projects for the authenticated user
router.get('/', async (req: any, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.userId
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific project
router.get('/:id', async (req: any, res) => {
  try {
    const projectId = parseInt(req.params.id);
    
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId
      },
      include: {
        tasks: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new project
router.post('/', async (req: any, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const project = await prisma.project.create({
      data: {
        name,
        userId: req.userId
      },
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    res.status(201).json(project);
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update a project
router.put('/:id', async (req: any, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    // Check if project belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId
      }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const project = await prisma.project.update({
      where: {
        id: projectId
      },
      data: {
        name
      },
      include: {
        tasks: true,
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    res.json(project);
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a project
router.delete('/:id', async (req: any, res) => {
  try {
    const projectId = parseInt(req.params.id);

    // Check if project belongs to user
    const existingProject = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: req.userId
      }
    });

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await prisma.project.delete({
      where: {
        id: projectId
      }
    });

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;