# Getting Started with Sailing Race Results Application

This guide will help you set up and run the Sailing Race Results Application locally.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **PostgreSQL** 16+ ([Download](https://www.postgresql.org/download/))
- **npm** (comes with Node.js) or **yarn**
- **Git** (for version control)

## Quick Start

### 1. Navigate to Project Directory

```bash
cd sailing-race-results-app
```

### 2. Set Up Backend

#### Install Dependencies

```bash
cd backend
npm install
```

#### Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env with your settings
# Update DATABASE_URL with your PostgreSQL credentials
```

Example `.env` configuration:
```env
PORT=3001
NODE_ENV=development
DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/sailing_results?schema=public"
JWT_SECRET=change-this-to-a-secure-random-string
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

#### Set Up Database

```bash
# Create PostgreSQL database
createdb sailing_results

# Or using psql:
psql -U postgres
CREATE DATABASE sailing_results;
\q

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

#### Start Backend Server

```bash
npm run dev
```

The backend API will be running at `http://localhost:3001`

### 3. Verify Backend is Running

Open your browser or use curl:

```bash
# Health check
curl http://localhost:3001/health

# API info
curl http://localhost:3001/api/v1
```

You should see JSON responses indicating the API is running.

### 4. Test Authentication

#### Register a User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

#### Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePassword123!"
  }'
```

Save the `accessToken` from the response for authenticated requests.

## Project Structure

```
sailing-race-results-app/
├── backend/                    # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── index.ts           # Main server file
│   │   ├── lib/               # Utilities (auth, prisma)
│   │   ├── middleware/        # Express middleware
│   │   └── routes/            # API routes
│   ├── prisma/
│   │   └── schema.prisma      # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── SETUP.md              # Detailed backend setup
├── frontend/                  # Frontend (Next.js + Carbon) - Coming Soon
├── docs/                      # Requirements documentation
│   ├── 01-business-requirements.md
│   ├── 02-technology-architecture.md
│   └── 03-data-schema.md
└── README.md
```

## Available Scripts

### Backend

```bash
# Development
npm run dev              # Start dev server with hot reload

# Production
npm run build           # Build TypeScript to JavaScript
npm start               # Start production server

# Database
npm run prisma:generate # Generate Prisma Client
npm run prisma:migrate  # Run database migrations
npm run prisma:studio   # Open Prisma Studio (database GUI)
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Coming Soon
- User management
- Club management
- Boat management
- Race management
- Real-time tracking

## Development Workflow

### 1. Making Database Changes

```bash
# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_migration_name

# 3. Generate Prisma Client
npx prisma generate
```

### 2. Adding New API Endpoints

1. Create route file in `src/routes/`
2. Import and use in `src/index.ts`
3. Test with curl or Postman

### 3. Using Prisma Studio

```bash
npx prisma studio
```

Opens a web interface at `http://localhost:5555` to view and edit database records.

## Troubleshooting

### Database Connection Failed

**Problem:** Cannot connect to PostgreSQL

**Solutions:**
1. Ensure PostgreSQL is running:
   ```bash
   # macOS
   brew services start postgresql@16
   
   # Linux
   sudo systemctl start postgresql
   ```

2. Verify DATABASE_URL in `.env`
3. Check PostgreSQL is accepting connections:
   ```bash
   psql -U postgres -l
   ```

### Port Already in Use

**Problem:** Port 3001 is already in use

**Solution:** Change PORT in `.env` file or stop the process using port 3001:
```bash
# Find process
lsof -i :3001

# Kill process
kill -9 <PID>
```

### Prisma Client Not Found

**Problem:** `Cannot find module '@prisma/client'`

**Solution:**
```bash
npm install @prisma/client
npx prisma generate
```

### TypeScript Errors

**Problem:** TypeScript compilation errors

**Solution:**
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install

# Regenerate Prisma Client
npx prisma generate
```

## Next Steps

1. ✅ Backend API is running
2. 📋 Set up frontend with Next.js and Carbon Design System
3. 📋 Implement additional API endpoints
4. 📋 Build user interface
5. 📋 Add real-time tracking features

## Documentation

- [Backend Setup Guide](./backend/SETUP.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Business Requirements](./01-business-requirements.md)
- [Technology Architecture](./02-technology-architecture.md)
- [Data Schema](./03-data-schema.md)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the detailed setup guides
3. Check the requirements documentation

## License

ISC