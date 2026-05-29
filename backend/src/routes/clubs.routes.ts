import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all clubs
router.get('/', async (req: Request, res: Response) => {
  try {
    const clubs = await prisma.club.findMany({
      include: {
        _count: {
          select: {
            users: true,
            races: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: clubs,
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch clubs',
    });
  }
});

// Get club by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const club = await prisma.club.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
        races: {
          orderBy: {
            startTime: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            users: true,
            races: true,
          },
        },
      },
    });

    if (!club) {
      return res.status(404).json({
        success: false,
        message: 'Club not found',
      });
    }

    res.json({
      success: true,
      data: club,
    });
  } catch (error) {
    console.error('Error fetching club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch club',
    });
  }
});

// Create new club (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, location, timezone } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required',
      });
    }

    const club = await prisma.club.create({
      data: {
        name,
        location,
        timezone: timezone || 'UTC',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Club created successfully',
      data: club,
    });
  } catch (error) {
    console.error('Error creating club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create club',
    });
  }
});

// Update club (requires authentication)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, location, timezone } = req.body;

    const club = await prisma.club.update({
      where: { id },
      data: {
        name,
        location,
        timezone,
      },
    });

    res.json({
      success: true,
      message: 'Club updated successfully',
      data: club,
    });
  } catch (error) {
    console.error('Error updating club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update club',
    });
  }
});

// Delete club (requires authentication)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.club.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Club deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting club:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete club',
    });
  }
});

export default router;

// Made with Bob
