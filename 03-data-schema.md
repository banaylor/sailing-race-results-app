# Data and Schema Document
## Sailing Race Results Application

**Document Version:** 2.0 (Simplified)  
**Date:** 2026-05-29  
**Status:** Draft

---

## 1. Executive Summary

This document defines a simplified data model for the Sailing Race Results Application, focusing on core essentials needed for MVP functionality. The system uses PostgreSQL for core data, TimescaleDB for GPS tracking, Redis for caching, and MinIO for file storage.

---

## 2. PostgreSQL Schema Design

### 2.1 Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'sailor', -- sailor, race_officer, club_admin
    club_id UUID REFERENCES clubs(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_club_id ON users(club_id);
```

#### Clubs Table
```sql
CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    timezone VARCHAR(50) DEFAULT 'UTC',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Boats Table
```sql
CREATE TABLE boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sail_number VARCHAR(50),
    boat_class VARCHAR(100) NOT NULL,
    py_number DECIMAL(10, 4), -- Portsmouth Yardstick handicap
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_boats_owner_id ON boats(owner_id);
CREATE INDEX idx_boats_boat_class ON boats(boat_class);
```

#### Races Table
```sql
CREATE TABLE races (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    race_date DATE NOT NULL,
    start_time TIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled', -- scheduled, in_progress, completed, cancelled
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_races_club_id ON races(club_id);
CREATE INDEX idx_races_race_date ON races(race_date);
CREATE INDEX idx_races_status ON races(status);
```

#### Race Entries Table
```sql
CREATE TABLE race_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    race_id UUID NOT NULL REFERENCES races(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    boat_id UUID NOT NULL REFERENCES boats(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'registered', -- registered, dns, dnf, dsq, finished
    finish_time INTERVAL, -- Time from start
    corrected_time INTERVAL, -- Handicap-corrected time
    position INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(race_id, user_id, boat_id)
);

CREATE INDEX idx_race_entries_race_id ON race_entries(race_id);
CREATE INDEX idx_race_entries_user_id ON race_entries(user_id);
```

---

## 3. TimescaleDB Schema (GPS Tracking)

#### Position Tracking Table
```sql
CREATE TABLE position_tracking (
    time TIMESTAMPTZ NOT NULL,
    race_id UUID NOT NULL,
    user_id UUID NOT NULL,
    boat_id UUID NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    speed_knots DOUBLE PRECISION,
    heading DOUBLE PRECISION
);

-- Convert to hypertable for time-series optimization
SELECT create_hypertable('position_tracking', 'time');

CREATE INDEX idx_position_tracking_race_id ON position_tracking(race_id, time DESC);
```

---

## 4. Redis Data Structures

### Session Storage
```
Key: session:{session_id}
Type: Hash
TTL: 24 hours
```

### Live Leaderboard
```
Key: leaderboard:race:{race_id}
Type: Sorted Set
Score: corrected_time
```

### Live Positions
```
Key: position:race:{race_id}:boat:{boat_id}
Type: Hash
TTL: 1 hour
```

---

## 5. MinIO Object Storage

### Bucket Structure
```
user-uploads/
  profiles/{user_id}/{filename}
  boats/{boat_id}/{filename}

race-documents/
  {race_id}/results/{filename}
  {race_id}/tracks/{user_id}.gpx
```

---

## 6. API Endpoints

### Authentication
```
POST   /auth/register
POST   /auth/login
POST   /auth/logout
```

### Users
```
GET    /users/me
PUT    /users/me
GET    /users/:id/boats
POST   /users/:id/boats
```

### Clubs
```
GET    /clubs
GET    /clubs/:id
GET    /clubs/:id/races
```

### Races
```
GET    /races
GET    /races/:id
POST   /races
PUT    /races/:id
POST   /races/:id/enter
GET    /races/:id/entries
GET    /races/:id/results
```

### Tracking
```
POST   /tracking/position
GET    /tracking/race/:raceId/live (WebSocket)
```

---

## 7. Data Models (TypeScript)

### User Model
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: 'sailor' | 'race_officer' | 'club_admin';
  clubId?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Club Model
```typescript
interface Club {
  id: string;
  name: string;
  location?: string;
  timezone: string;
  createdAt: Date;
}
```

### Boat Model
```typescript
interface Boat {
  id: string;
  ownerId: string;
  name: string;
  sailNumber?: string;
  boatClass: string;
  pyNumber?: number;
  createdAt: Date;
}
```

### Race Model
```typescript
interface Race {
  id: string;
  clubId: string;
  name: string;
  raceDate: Date;
  startTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  createdBy: string;
  createdAt: Date;
}
```

### Race Entry Model
```typescript
interface RaceEntry {
  id: string;
  raceId: string;
  userId: string;
  boatId: string;
  status: 'registered' | 'dns' | 'dnf' | 'dsq' | 'finished';
  finishTime?: string;
  correctedTime?: string;
  position?: number;
  createdAt: Date;
}
```

### Position Update Model
```typescript
interface PositionUpdate {
  time: Date;
  raceId: string;
  userId: string;
  boatId: string;
  latitude: number;
  longitude: number;
  speedKnots?: number;
  heading?: number;
}
```

---

## 8. Standard API Response Format

```json
{
  "success": true,
  "data": {},
  "meta": {
    "timestamp": "2026-05-29T08:00:00Z"
  }
}
```

---

## 9. WebSocket Messages

### Client → Server
```json
{
  "type": "position",
  "data": {
    "latitude": 51.5074,
    "longitude": -0.1278,
    "speed": 5.2,
    "heading": 180
  }
}
```

### Server → Client
```json
{
  "type": "position_update",
  "data": {
    "user_id": "uuid",
    "boat_id": "uuid",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "speed": 5.2,
    "heading": 180,
    "timestamp": "2026-05-29T08:00:00Z"
  }
}
```

---

## 10. Future Enhancements

The following features can be added later without major schema changes:

- **Protest Management**: Add `protests` table
- **Series Scoring**: Add `race_series` and `series_standings` tables
- **Weather Data**: Add weather fields to `races` table
- **Notifications**: Add `notifications` table
- **Audit Logging**: Add `audit_logs` table
- **Federation**: Add `federations` table and link to `clubs`

---

## 11. Approval and Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Data Architect | | | |
| Backend Lead | | | |
| Product Owner | | | |

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-05-29 | System | Initial draft |
| 2.0 | 2026-05-29 | System | Simplified to core essentials |
