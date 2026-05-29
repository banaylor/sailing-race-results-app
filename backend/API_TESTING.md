# API Testing Guide

This guide provides curl commands to test all available API endpoints with the seed data.

## Prerequisites

1. Backend server is running: `npm run dev`
2. Database is seeded: `npm run prisma:seed`
3. Server is accessible at: `http://localhost:3001`

---

## Authentication Endpoints

### 1. Register New User

```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "SecurePassword123!",
    "firstName": "New",
    "lastName": "User",
    "phone": "+44 20 9999 9999"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "uuid",
      "email": "newuser@example.com",
      "firstName": "New",
      "lastName": "User",
      "role": "sailor",
      "clubId": null
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

### 2. Login with Existing User

```bash
# Login as Admin
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sailing.com",
    "password": "Password123!"
  }'
```

```bash
# Login as Race Officer
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "officer@sailing.com",
    "password": "Password123!"
  }'
```

```bash
# Login as Sailor
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.sailor@example.com",
    "password": "Password123!"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "uuid",
      "email": "admin@sailing.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "club_admin",
      "clubId": "uuid"
    },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

**Save the accessToken for authenticated requests!**

### 3. Test Invalid Login

```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sailing.com",
    "password": "WrongPassword"
  }'
```

**Expected Response:**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

## Health Check

### Check API Status

```bash
curl http://localhost:3001/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sailing Race Results API is running",
  "timestamp": "2026-05-29T08:00:00.000Z"
}
```

### Get API Info

```bash
curl http://localhost:3001/api/v1
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Sailing Race Results API v1",
  "version": "1.0.0",
  "endpoints": {
    "health": "/health",
    "auth": "/api/v1/auth",
    "users": "/api/v1/users (coming soon)",
    "clubs": "/api/v1/clubs (coming soon)",
    "boats": "/api/v1/boats (coming soon)",
    "races": "/api/v1/races (coming soon)",
    "entries": "/api/v1/entries (coming soon)"
  }
}
```

---

## Testing with Postman

### Import Collection

1. Open Postman
2. Create new collection: "Sailing Race Results API"
3. Add requests for each endpoint above
4. Set up environment variables:
   - `base_url`: `http://localhost:3001`
   - `access_token`: (set after login)

### Using Access Token

After login, save the `accessToken` and use it in subsequent requests:

```
Authorization: Bearer YOUR_ACCESS_TOKEN_HERE
```

---

## Testing Workflow

### Complete Test Flow

```bash
# 1. Check API is running
curl http://localhost:3001/health

# 2. Login as sailor
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.sailor@example.com",
    "password": "Password123!"
  }')

# 3. Extract access token (requires jq)
ACCESS_TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.data.accessToken')

echo "Access Token: $ACCESS_TOKEN"

# 4. Use token for authenticated requests (when endpoints are available)
# curl http://localhost:3001/api/v1/users/me \
#   -H "Authorization: Bearer $ACCESS_TOKEN"
```

---

## Sample Data Quick Reference

### Test Users (All passwords: Password123!)

| Email | Role | Club |
|-------|------|------|
| admin@sailing.com | club_admin | Riverside SC |
| officer@sailing.com | race_officer | Riverside SC |
| john.sailor@example.com | sailor | Riverside SC |
| sarah.wave@example.com | sailor | Riverside SC |
| mike.wind@example.com | sailor | Coastal YC |
| emma.tide@example.com | sailor | Coastal YC |
| david.helm@example.com | sailor | Lake District SC |

### Test Scenarios

#### Scenario 1: New User Registration
```bash
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.sailor@example.com",
    "password": "TestPass123!",
    "firstName": "Test",
    "lastName": "Sailor",
    "phone": "+44 20 1111 1111"
  }'
```

#### Scenario 2: Login and Get Token
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test.sailor@example.com",
    "password": "TestPass123!"
  }'
```

#### Scenario 3: Test Different User Roles
```bash
# Admin
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sailing.com","password":"Password123!"}'

# Race Officer
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"officer@sailing.com","password":"Password123!"}'

# Sailor
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.sailor@example.com","password":"Password123!"}'
```

---

## Error Testing

### Test Validation Errors

```bash
# Missing required fields
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'

# Invalid email format
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'

# Duplicate email
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sailing.com",
    "password": "Password123!",
    "firstName": "Test",
    "lastName": "User"
  }'
```

### Test Authentication Errors

```bash
# No token provided (when endpoints require auth)
curl http://localhost:3001/api/v1/users/me

# Invalid token
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer invalid_token_here"

# Expired token (wait 15 minutes after login)
curl http://localhost:3001/api/v1/users/me \
  -H "Authorization: Bearer expired_token_here"
```

---

## Debugging Tips

### View Request/Response Details

```bash
# Use -v flag for verbose output
curl -v http://localhost:3001/health

# Use -i flag to include response headers
curl -i http://localhost:3001/health

# Pretty print JSON with jq
curl -s http://localhost:3001/health | jq '.'
```

### Check Server Logs

The development server logs all requests. Watch the terminal where you ran `npm run dev` to see:
- Request method and path
- Response status
- Any errors

### Use Prisma Studio

View and edit database records directly:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

---

## Next Steps

Once additional endpoints are implemented, you'll be able to test:

- **User Management**: GET/PUT `/api/v1/users/me`
- **Clubs**: GET `/api/v1/clubs`, GET `/api/v1/clubs/:id`
- **Boats**: GET/POST `/api/v1/boats`
- **Races**: GET/POST `/api/v1/races`
- **Race Entries**: GET/POST `/api/v1/entries`

Check back to this guide as new endpoints are added!