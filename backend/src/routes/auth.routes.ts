import { Router, Request, Response } from 'express';
import prisma from '../lib/prisma';
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from '../lib/auth';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, firstName, lastName, phone, clubId } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required'
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        clubId,
        role: 'sailor' // Default role
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        clubId: true,
        createdAt: true
      }
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clubId: user.clubId || undefined
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clubId: user.clubId || undefined
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user,
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user'
    });
  }
});

/**
 * POST /api/v1/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clubId: user.clubId || undefined
    });

    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      clubId: user.clubId || undefined
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { updatedAt: new Date() }
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          clubId: user.clubId
        },
        accessToken,
        refreshToken
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to login'
    });
  }
});

export default router;

// Made with Bob
