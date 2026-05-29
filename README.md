# Sailing Race Results Application

A modern, cloud-native web application for managing sailing club races, boats, and results. Built with Next.js, Express, TypeScript, and PostgreSQL.

## 🚀 Features

- **User Authentication**: Secure JWT-based authentication with role-based access control
- **Race Management**: Create, view, and manage sailing races
- **Boat Registry**: Register and manage boats with owner information
- **Dashboard**: Real-time statistics and recent activity
- **Dark Theme**: Modern dark UI using IBM Carbon Design System
- **RESTful API**: Complete backend API with comprehensive endpoints

## 🛠️ Technology Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **IBM Carbon Design System** - Enterprise-grade UI components
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Express.js** - Node.js web framework
- **TypeScript** - Type-safe server development
- **Prisma ORM** - Modern database toolkit
- **PostgreSQL** - Relational database
- **JWT** - Secure authentication
- **bcrypt** - Password hashing

## 📋 Prerequisites

- Node.js 20 LTS or higher
- PostgreSQL 16 or higher
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/banaylor/sailing-race-results-app.git
cd sailing-race-results-app
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your PostgreSQL credentials
# DATABASE_URL="postgresql://username:password@localhost:5432/sailing_race_db"

# Run Prisma migrations
npx prisma migrate dev

# Load sample data
npm run seed

# Start the backend server
npm run dev
```

The backend API will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start the frontend development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 📚 Documentation

- [Project Overview](./00-project-overview.md)
- [Business Requirements](./01-business-requirements.md)
- [Technology Architecture](./02-technology-architecture.md)
- [Data Schema](./03-data-schema.md)
- [Getting Started Guide](./GETTING_STARTED.md)
- [Implementation Status](./IMPLEMENTATION_STATUS.md)
- [Backend Setup](./backend/SETUP.md)
- [API Testing Guide](./backend/API_TESTING.md)
- [Sample Data](./backend/SEED_DATA.md)

## 🔑 Test Credentials

```
Email: admin@sailing.com
Password: Password123!
```

## 📁 Project Structure

```
sailing-race-results-app/
├── backend/                 # Express.js API server
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── middleware/     # Authentication middleware
│   │   ├── lib/           # Utilities (Prisma, Auth)
│   │   └── index.ts       # Server entry point
│   ├── prisma/            # Database schema and migrations
│   └── package.json
├── frontend/              # Next.js application
│   ├── app/              # App Router pages
│   │   ├── page.tsx      # Home page
│   │   ├── login/        # Login page
│   │   ├── register/     # Registration page
│   │   ├── dashboard/    # Dashboard page
│   │   ├── races/        # Races list page
│   │   └── boats/        # Boats list page
│   └── package.json
└── README.md
```

## 🎨 Features Overview

### Dashboard
- Real-time statistics (total races, upcoming races, registered boats)
- Recent races list with status indicators
- Quick navigation to races and boats

### Race Management
- View all races with details
- Filter by club and status
- See entry counts for each race

### Boat Registry
- List all registered boats
- View boat details (class, sail number, owner)
- Track race participation

### Authentication
- Secure login and registration
- JWT token-based authentication
- Role-based access control (Member, Race Officer, Admin)

## 🔧 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

### Clubs
- `GET /api/v1/clubs` - List all clubs
- `GET /api/v1/clubs/:id` - Get club details
- `POST /api/v1/clubs` - Create club (auth required)

### Boats
- `GET /api/v1/boats` - List all boats
- `GET /api/v1/boats/:id` - Get boat details
- `POST /api/v1/boats` - Register boat (auth required)

### Races
- `GET /api/v1/races` - List all races
- `GET /api/v1/races/:id` - Get race details
- `POST /api/v1/races` - Create race (auth required)
- `POST /api/v1/races/:id/entries` - Register for race (auth required)

## 🗄️ Database Schema

### Tables
- **users** - User accounts with authentication
- **clubs** - Sailing clubs
- **boats** - Registered boats
- **races** - Race events
- **race_entries** - Race registrations and results

## 🚀 Deployment

### Backend
The backend can be deployed to any Node.js hosting platform:
- Heroku
- Railway
- Render
- AWS Elastic Beanstalk

### Frontend
The Next.js frontend can be deployed to:
- Vercel (recommended)
- Netlify
- AWS Amplify

### Database
PostgreSQL can be hosted on:
- Supabase
- Railway
- AWS RDS
- Heroku Postgres

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Brian Naylor**
- GitHub: [@banaylor](https://github.com/banaylor)

## 🙏 Acknowledgments

- IBM Carbon Design System for the UI components
- Prisma for the excellent ORM
- Next.js team for the amazing framework

---

**Made with Bob** 🤖