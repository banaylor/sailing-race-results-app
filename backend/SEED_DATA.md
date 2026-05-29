# Seed Data Reference

This document describes the sample data that will be loaded into your database for testing.

## How to Load Seed Data

### Option 1: During Migration
```bash
# This will run migrations and automatically seed the database
npx prisma migrate dev --name init
```

### Option 2: Manual Seeding
```bash
# Run seed script manually
npm run prisma:seed
```

### Option 3: Reset and Seed
```bash
# Reset database and seed (WARNING: Deletes all data)
npx prisma migrate reset
```

---

## Sample Data Overview

### 🏛️ Clubs (3)

| Name | Location | Timezone |
|------|----------|----------|
| Riverside Sailing Club | Thames River, London | Europe/London |
| Coastal Yacht Club | Brighton Marina | Europe/London |
| Lake District Sailing Club | Windermere, Cumbria | Europe/London |

### 👥 Users (7)

All users have the same password: **Password123!**

| Email | Name | Role | Club |
|-------|------|------|------|
| admin@sailing.com | Admin User | club_admin | Riverside SC |
| officer@sailing.com | Race Officer | race_officer | Riverside SC |
| john.sailor@example.com | John Sailor | sailor | Riverside SC |
| sarah.wave@example.com | Sarah Wave | sailor | Riverside SC |
| mike.wind@example.com | Mike Wind | sailor | Coastal YC |
| emma.tide@example.com | Emma Tide | sailor | Coastal YC |
| david.helm@example.com | David Helm | sailor | Lake District SC |

### ⛵ Boats (6)

| Name | Sail Number | Class | PY Number | Owner |
|------|-------------|-------|-----------|-------|
| Sea Breeze | GBR-1234 | Laser | 1100 | John Sailor |
| Wind Dancer | GBR-5678 | RS Aero 7 | 1065 | Sarah Wave |
| Wave Rider | GBR-9012 | 420 | 1105 | Mike Wind |
| Storm Chaser | GBR-3456 | Laser | 1100 | Emma Tide |
| Blue Horizon | GBR-7890 | Topper | 1365 | David Helm |
| Lightning | GBR-2468 | RS Aero 9 | 1014 | John Sailor |

### 🏁 Races (5)

| Name | Club | Date | Time | Status |
|------|------|------|------|--------|
| Spring Series - Race 1 | Riverside SC | Last week | 14:00 | completed |
| Spring Series - Race 2 | Riverside SC | Yesterday | 14:00 | completed |
| Spring Series - Race 3 | Riverside SC | Today | 14:00 | scheduled |
| Coastal Challenge | Coastal YC | Next week | 10:00 | scheduled |
| Lake District Regatta | Lake District SC | Next week | 11:00 | scheduled |

### 📝 Race Results

#### Spring Series - Race 1 (Completed)
| Position | Sailor | Boat | Finish Time | Corrected Time |
|----------|--------|------|-------------|----------------|
| 1st | John Sailor | Sea Breeze | 01:23:45 | 01:16:12 |
| 2nd | Sarah Wave | Wind Dancer | 01:25:30 | 01:20:15 |
| 3rd | Emma Tide | Storm Chaser | 01:28:15 | 01:21:03 |

#### Spring Series - Race 2 (Completed)
| Position | Sailor | Boat | Finish Time | Corrected Time | Status |
|----------|--------|------|-------------|----------------|--------|
| 1st | Sarah Wave | Wind Dancer | 01:22:10 | 01:17:05 | Finished |
| 2nd | John Sailor | Sea Breeze | 01:24:30 | 01:17:18 | Finished |
| - | Emma Tide | Storm Chaser | - | - | DNF |

#### Spring Series - Race 3 (Scheduled)
**Registered Entries:**
- John Sailor (Sea Breeze)
- Sarah Wave (Wind Dancer)
- Emma Tide (Storm Chaser)
- John Sailor (Lightning)

---

## Testing with Seed Data

### 1. Login as Different Users

```bash
# Login as Admin
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sailing.com","password":"Password123!"}'

# Login as Race Officer
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"officer@sailing.com","password":"Password123!"}'

# Login as Sailor
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.sailor@example.com","password":"Password123!"}'
```

### 2. View Data in Prisma Studio

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555` - you can browse and edit all the seed data.

### 3. Test Scenarios

#### Scenario 1: View Completed Race Results
- Login as any user
- Query races with status "completed"
- View race entries with positions and times

#### Scenario 2: Register for Upcoming Race
- Login as a sailor
- View scheduled races
- Register for a race

#### Scenario 3: Manage Club as Admin
- Login as admin@sailing.com
- View club members
- View club races

#### Scenario 4: Enter Race Results
- Login as officer@sailing.com
- View scheduled races
- Enter finish times and positions

---

## Boat Classes & Handicaps

The seed data includes boats from various classes with their Portsmouth Yardstick (PY) numbers:

| Class | PY Number | Description |
|-------|-----------|-------------|
| RS Aero 9 | 1014 | Fast single-handed dinghy |
| RS Aero 7 | 1065 | Medium single-handed dinghy |
| Laser | 1100 | Popular single-handed dinghy |
| 420 | 1105 | Two-person racing dinghy |
| Topper | 1365 | Beginner single-handed dinghy |

**Lower PY number = Faster boat**

Corrected time is calculated using: `Corrected Time = (Elapsed Time / PY Number) × 1000`

---

## Resetting Data

To clear all data and reseed:

```bash
# Option 1: Reset everything
npx prisma migrate reset

# Option 2: Manual clear and seed
npx prisma db push --force-reset
npm run prisma:seed
```

---

## Adding More Data

You can modify `prisma/seed.ts` to add:
- More clubs
- More users
- More boats
- More races
- More race entries

Then run:
```bash
npm run prisma:seed
```

---

## Notes

- All timestamps are in UTC
- Race dates are relative (last week, today, next week)
- All users share the same password for easy testing
- Boat PY numbers are based on RYA Portsmouth Yardstick scheme
- Race entries demonstrate different statuses: finished, dnf, registered