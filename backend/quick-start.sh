#!/bin/bash

# Quick Start Script for Sailing Race Results Backend
# This script sets up the database and loads sample data

set -e  # Exit on error

echo "🚀 Sailing Race Results - Quick Start"
echo "======================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from .env.example..."
    cp .env.example .env
    echo "⚠️  Please edit .env with your PostgreSQL credentials"
    echo "   Then run this script again."
    exit 1
fi

# Check if PostgreSQL is running
echo "🔍 Checking PostgreSQL connection..."
if ! psql -U postgres -c '\q' 2>/dev/null; then
    echo "❌ Cannot connect to PostgreSQL"
    echo "   Please ensure PostgreSQL is running:"
    echo "   - macOS: brew services start postgresql@16"
    echo "   - Linux: sudo systemctl start postgresql"
    exit 1
fi

echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
DB_NAME="sailing_results"
if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "⚠️  Database '$DB_NAME' already exists"
    read -p "   Do you want to reset it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        dropdb -U postgres $DB_NAME
        echo "📦 Creating fresh database..."
        createdb -U postgres $DB_NAME
    fi
else
    echo "📦 Creating database '$DB_NAME'..."
    createdb -U postgres $DB_NAME
fi

echo "✅ Database ready"
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
    echo ""
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Run migrations
echo "🔄 Running database migrations..."
npx prisma migrate dev --name init

# Seed database
echo "🌱 Loading sample data..."
npm run prisma:seed

echo ""
echo "✨ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "   1. Start the server: npm run dev"
echo "   2. Test the API: curl http://localhost:3001/health"
echo "   3. View data: npm run prisma:studio"
echo ""
echo "🔐 Test credentials (all users):"
echo "   Password: Password123!"
echo ""
echo "👤 Sample users:"
echo "   - admin@sailing.com (Club Admin)"
echo "   - officer@sailing.com (Race Officer)"
echo "   - john.sailor@example.com (Sailor)"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: ./SETUP.md"
echo "   - Seed Data: ./SEED_DATA.md"
echo ""

# Made with Bob
