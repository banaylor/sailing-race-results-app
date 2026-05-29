#!/bin/bash

# Sailing Race Results Application Startup Script
# Starts both backend and frontend (if available)

set -e  # Exit on error

echo "🚀 Sailing Race Results Application"
echo "===================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to check if a port is in use
port_in_use() {
    lsof -i :"$1" >/dev/null 2>&1
}

# Check prerequisites
echo "🔍 Checking prerequisites..."

if ! command_exists node; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "   Please install Node.js 20+ from https://nodejs.org/"
    exit 1
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm is not installed${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) and npm $(npm --version) found${NC}"

# Check if PostgreSQL is running
if ! command_exists psql; then
    echo -e "${YELLOW}⚠️  PostgreSQL client not found${NC}"
    echo "   Backend may not work without PostgreSQL"
else
    if psql -U postgres -c '\q' 2>/dev/null; then
        echo -e "${GREEN}✅ PostgreSQL is running${NC}"
    else
        echo -e "${YELLOW}⚠️  Cannot connect to PostgreSQL${NC}"
        echo "   Start PostgreSQL: brew services start postgresql@16 (macOS)"
    fi
fi

echo ""

# Check backend
echo "🔧 Checking backend..."
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Backend directory not found${NC}"
    exit 1
fi

cd backend

if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  Backend .env file not found${NC}"
    echo "   Creating from .env.example..."
    cp .env.example .env
    echo -e "${YELLOW}   Please edit backend/.env with your database credentials${NC}"
    echo "   Then run this script again."
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

# Check if database is set up
if [ ! -d "node_modules/@prisma/client" ]; then
    echo "🔧 Setting up Prisma..."
    npx prisma generate
fi

echo -e "${GREEN}✅ Backend ready${NC}"
cd ..

# Check frontend
echo ""
echo "🎨 Checking frontend..."
if [ ! -d "frontend" ]; then
    echo -e "${YELLOW}⚠️  Frontend directory not found${NC}"
    echo "   Frontend will be created in future development"
    FRONTEND_AVAILABLE=false
else
    cd frontend
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing frontend dependencies..."
        npm install
    fi
    echo -e "${GREEN}✅ Frontend ready${NC}"
    cd ..
    FRONTEND_AVAILABLE=true
fi

echo ""
echo "======================================"
echo ""

# Check if ports are available
if port_in_use 3001; then
    echo -e "${YELLOW}⚠️  Port 3001 (backend) is already in use${NC}"
    echo "   Kill the process or change PORT in backend/.env"
    exit 1
fi

if [ "$FRONTEND_AVAILABLE" = true ] && port_in_use 3000; then
    echo -e "${YELLOW}⚠️  Port 3000 (frontend) is already in use${NC}"
    echo "   Kill the process or change the port"
    exit 1
fi

# Start services
echo "🚀 Starting services..."
echo ""

# Create log directory
mkdir -p logs

# Start backend
echo -e "${BLUE}Starting backend on http://localhost:3001${NC}"
cd backend
npm run dev > ../logs/backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo "   Backend PID: $BACKEND_PID"
echo "   Logs: logs/backend.log"

# Wait a moment for backend to start
sleep 2

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
    echo -e "${RED}❌ Backend failed to start${NC}"
    echo "   Check logs/backend.log for errors"
    exit 1
fi

# Start frontend if available
if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo ""
    echo -e "${BLUE}Starting frontend on http://localhost:3000${NC}"
    cd frontend
    npm run dev > ../logs/frontend.log 2>&1 &
    FRONTEND_PID=$!
    cd ..
    
    echo "   Frontend PID: $FRONTEND_PID"
    echo "   Logs: logs/frontend.log"
    
    # Wait a moment for frontend to start
    sleep 2
    
    # Check if frontend started successfully
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo -e "${RED}❌ Frontend failed to start${NC}"
        echo "   Check logs/frontend.log for errors"
        echo "   Stopping backend..."
        kill $BACKEND_PID 2>/dev/null
        exit 1
    fi
fi

echo ""
echo "======================================"
echo -e "${GREEN}✨ Application started successfully!${NC}"
echo "======================================"
echo ""
echo "📍 Services:"
echo "   Backend:  http://localhost:3001"
if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo "   Frontend: http://localhost:3000"
else
    echo "   Frontend: Not yet available"
fi
echo ""
echo "📊 Monitoring:"
echo "   Backend logs:  tail -f logs/backend.log"
if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo "   Frontend logs: tail -f logs/frontend.log"
fi
echo ""
echo "🛑 To stop the application:"
echo "   Press Ctrl+C or run: ./stop-app.sh"
echo ""
echo "🔧 Useful commands:"
echo "   View database: cd backend && npm run prisma:studio"
echo "   Test API:      curl http://localhost:3001/health"
echo ""

# Save PIDs to file for stop script
echo "$BACKEND_PID" > .backend.pid
if [ "$FRONTEND_AVAILABLE" = true ]; then
    echo "$FRONTEND_PID" > .frontend.pid
fi

# Wait for user interrupt
trap 'echo ""; echo "🛑 Stopping services..."; kill $BACKEND_PID 2>/dev/null; [ "$FRONTEND_AVAILABLE" = true ] && kill $FRONTEND_PID 2>/dev/null; rm -f .backend.pid .frontend.pid; echo "✅ Services stopped"; exit 0' INT

echo "Press Ctrl+C to stop all services..."
echo ""

# Keep script running
wait

# Made with Bob
