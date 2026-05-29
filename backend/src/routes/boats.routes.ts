import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all boats
router.get('/', async (req: Request, res: Response) => {
  try {
    const { ownerId } = req.query;

    const boats = await prisma.boat.findMany({
      where: ownerId ? { ownerId: ownerId as string } : undefined,
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        _count: {
          select: {
            raceEntries: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    res.json({
      success: true,
      data: boats,
    });
  } catch (error) {
    console.error('Error fetching boats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch boats',
    });
  }
});

// Get boat by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const boat = await prisma.boat.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
          },
        },
        raceEntries: {
          include: {
            race: {
              select: {
                id: true,
                name: true,
                startTime: true,
                status: true,
              },
            },
          },
          orderBy: {
            race: {
              startTime: 'desc',
            },
          },
          take: 20,
        },
      },
    });

    if (!boat) {
      return res.status(404).json({
        success: false,
        message: 'Boat not found',
      });
    }

    res.json({
      success: true,
      data: boat,
    });
  } catch (error) {
    console.error('Error fetching boat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch boat',
    });
  }
});

// Create new boat (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, sailNumber, boatClass, ownerId, pyNumber } = req.body;

    // Validate required fields
    if (!name || !boatClass || !ownerId) {
      return res.status(400).json({
        success: false,
        message: 'Name, boat class, and owner ID are required',
      });
    }

    const boat = await prisma.boat.create({
      data: {
        name,
        sailNumber,
        boatClass,
        ownerId,
        pyNumber,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Boat created successfully',
      data: boat,
    });
  } catch (error) {
    console.error('Error creating boat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create boat',
    });
  }
});

// Update boat (requires authentication)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, sailNumber, boatClass, ownerId, pyNumber } = req.body;

    const boat = await prisma.boat.update({
      where: { id },
      data: {
        name,
        sailNumber,
        boatClass,
        ownerId,
        pyNumber,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Boat updated successfully',
      data: boat,
    });
  } catch (error) {
    console.error('Error updating boat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update boat',
    });
  }
});

// Delete boat (requires authentication)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.boat.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Boat deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting boat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete boat',
    });
  }
});

export default router;

// Made with Bob
