# Backend Setup Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 16+ installed and running
- npm or yarn package manager

## Initial Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and update with your settings:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/sailing_results?schema=public"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### 3. Set Up PostgreSQL Database

Create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sailing_results;

# Exit psql
\q
```

### 4. Run Prisma Migrations

Generate Prisma Client and create database tables:

```bash
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio to view database
npx prisma studio
```

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Users (Coming Soon)
- `GET /api/v1/users/me` - Get current user profile
- `PUT /api/v1/users/me` - Update current user profile

### Clubs (Coming Soon)
- `GET /api/v1/clubs` - List all clubs
- `GET /api/v1/clubs/:id` - Get club details

### Races (Coming Soon)
- `GET /api/v1/races` - List races
- `POST /api/v1/races` - Create race
- `GET /api/v1/races/:id` - Get race details

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sailor@example.com",
    "password": "SecurePassword123!",
    "firstName": "John",
    "lastName": "Sailor",
    "phone": "+1234567890"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "sailor@example.com",
    "password": "SecurePassword123!"
  }'
```

## Troubleshooting

### Database Connection Issues

If you get database connection errors:

1. Ensure PostgreSQL is running:
   ```bash
   # macOS with Homebrew
   brew services start postgresql@16
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Verify database exists:
   ```bash
   psql -U postgres -l
   ```

3. Check DATABASE_URL in `.env` file

### Prisma Client Not Found

If you get "Cannot find module '@prisma/client'":

```bash
npm install @prisma/client
npx prisma generate
```

### Port Already in Use

If port 3001 is already in use, change PORT in `.env` file.

## Next Steps

1. Set up the frontend application
2. Implement additional API endpoints
3. Add data validation
4. Implement WebSocket for real-time tracking
5. Add comprehensive error handling
6. Write unit and integration tests