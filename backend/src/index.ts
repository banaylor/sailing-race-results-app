import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import clubsRoutes from './routes/clubs.routes';
import boatsRoutes from './routes/boats.routes';
import racesRoutes from './routes/races.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Sailing Race Results API is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/clubs', clubsRoutes);
app.use('/api/v1/boats', boatsRoutes);
app.use('/api/v1/races', racesRoutes);

// API info endpoint
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Sailing Race Results API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      clubs: '/api/v1/clubs',
      boats: '/api/v1/boats',
      races: '/api/v1/races',
      users: '/api/v1/users (coming soon)'
    }
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
});

export default app;

// Made with Bob
