#!/bin/bash

# Sailing Race Results Application Stop Script
# Stops both backend and frontend services

echo "🛑 Stopping Sailing Race Results Application..."
echo ""

# Check for PID files
if [ -f ".backend.pid" ]; then
    BACKEND_PID=$(cat .backend.pid)
    if kill -0 $BACKEND_PID 2>/dev/null; then
        echo "   Stopping backend (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
        rm .backend.pid
        echo "   ✅ Backend stopped"
    else
        echo "   ⚠️  Backend process not running"
        rm .backend.pid
    fi
else
    echo "   ℹ️  No backend PID file found"
fi

if [ -f ".frontend.pid" ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "   Stopping frontend (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
        rm .frontend.pid
        echo "   ✅ Frontend stopped"
    else
        echo "   ⚠️  Frontend process not running"
        rm .frontend.pid
    fi
else
    echo "   ℹ️  No frontend PID file found"
fi

# Also try to kill any node processes on the ports
echo ""
echo "🔍 Checking for processes on ports 3000 and 3001..."

if lsof -i :3001 >/dev/null 2>&1; then
    echo "   Found process on port 3001, attempting to kill..."
    lsof -ti :3001 | xargs kill -9 2>/dev/null || true
fi

if lsof -i :3000 >/dev/null 2>&1; then
    echo "   Found process on port 3000, attempting to kill..."
    lsof -ti :3000 | xargs kill -9 2>/dev/null || true
fi

echo ""
echo "✅ All services stopped"

# Made with Bob
