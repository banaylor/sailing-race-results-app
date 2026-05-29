import { Router, Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Get all races
router.get('/', async (req: Request, res: Response) => {
  try {
    const { clubId, status } = req.query;

    const races = await prisma.race.findMany({
      where: {
        ...(clubId && { clubId: clubId as string }),
        ...(status && { status: status as string }),
      },
      include: {
        club: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            raceEntries: true,
          },
        },
      },
      orderBy: {
        startTime: 'desc',
      },
    });

    res.json({
      success: true,
      data: races,
    });
  } catch (error) {
    console.error('Error fetching races:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch races',
    });
  }
});

// Get race by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const race = await prisma.race.findUnique({
      where: { id },
      include: {
        club: true,
        raceEntries: {
          include: {
            boat: {
              include: {
                owner: {
                  select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                  },
                },
              },
            },
          },
          orderBy: [
            { position: 'asc' },
            { createdAt: 'asc' },
          ],
        },
      },
    });

    if (!race) {
      return res.status(404).json({
        success: false,
        message: 'Race not found',
      });
    }

    res.json({
      success: true,
      data: race,
    });
  } catch (error) {
    console.error('Error fetching race:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch race',
    });
  }
});

// Create new race (requires authentication)
router.post('/', authenticate, async (req: Request, res: Response) => {
  try {
    const { name, raceDate, startTime, clubId, status } = req.body;

    // Validate required fields
    if (!name || !raceDate || !startTime || !clubId) {
      return res.status(400).json({
        success: false,
        message: 'Name, race date, start time, and club ID are required',
      });
    }

    // Get createdBy from authenticated user
    const createdBy = req.user?.userId;
    if (!createdBy) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
      });
    }

    const race = await prisma.race.create({
      data: {
        name,
        raceDate: new Date(raceDate),
        startTime: new Date(startTime),
        clubId,
        createdBy,
        status: status || 'scheduled',
      },
      include: {
        club: true,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Race created successfully',
      data: race,
    });
  } catch (error) {
    console.error('Error creating race:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create race',
    });
  }
});

// Update race (requires authentication)
router.put('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, raceDate, startTime, status } = req.body;

    const race = await prisma.race.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(raceDate && { raceDate: new Date(raceDate) }),
        ...(startTime && { startTime: new Date(startTime) }),
        ...(status && { status }),
      },
      include: {
        club: true,
        _count: {
          select: {
            raceEntries: true,
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Race updated successfully',
      data: race,
    });
  } catch (error) {
    console.error('Error updating race:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update race',
    });
  }
});

// Delete race (requires authentication)
router.delete('/:id', authenticate, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.race.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Race deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting race:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete race',
    });
  }
});

// Register boat for race (requires authentication)
router.post('/:id/entries', authenticate, async (req: Request, res: Response) => {
  try {
    const { id: raceId } = req.params;
    const { boatId, userId } = req.body;

    if (!boatId || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Boat ID and User ID are required',
      });
    }

    // Check if entry already exists
    const existingEntry = await prisma.raceEntry.findFirst({
      where: {
        raceId,
        boatId,
        userId,
      },
    });

    if (existingEntry) {
      return res.status(400).json({
        success: false,
        message: 'This entry already exists for this race',
      });
    }

    const entry = await prisma.raceEntry.create({
      data: {
        raceId,
        boatId,
        userId,
      },
      include: {
        boat: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
        race: {
          select: {
            id: true,
            name: true,
            startTime: true,
          },
        },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Boat registered for race successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Error registering boat for race:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register boat for race',
    });
  }
});

// Update race entry results (requires authentication)
router.put('/:raceId/entries/:entryId', authenticate, async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;
    const { position, finishTime, correctedTime, status } = req.body;

    const entry = await prisma.raceEntry.update({
      where: { id: entryId },
      data: {
        ...(position !== undefined && { position }),
        ...(finishTime && { finishTime }),
        ...(correctedTime && { correctedTime }),
        ...(status && { status }),
      },
      include: {
        boat: {
          include: {
            owner: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    res.json({
      success: true,
      message: 'Race entry updated successfully',
      data: entry,
    });
  } catch (error) {
    console.error('Error updating race entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update race entry',
    });
  }
});

// Delete race entry (requires authentication)
router.delete('/:raceId/entries/:entryId', authenticate, async (req: Request, res: Response) => {
  try {
    const { entryId } = req.params;

    await prisma.raceEntry.delete({
      where: { id: entryId },
    });

    res.json({
      success: true,
      message: 'Race entry deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting race entry:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete race entry',
    });
  }
});

export default router;

// Made with Bob
