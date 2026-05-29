# Sailing Race Results API Reference

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication

Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Authentication Endpoints

### Register User
Create a new user account.

**Endpoint:** `POST /auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+44 7700 900000",
  "role": "sailor",
  "clubId": "club-uuid-here"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "sailor",
      "clubId": "club-uuid"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

### Login
Authenticate and receive JWT tokens.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "admin@sailing.com",
  "password": "Password123!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "user-uuid",
      "email": "admin@sailing.com",
      "firstName": "Admin",
      "lastName": "User",
      "role": "club_admin",
      "clubId": "club-uuid"
    },
    "accessToken": "jwt-token",
    "refreshToken": "refresh-token"
  }
}
```

---

## Clubs Endpoints

### Get All Clubs
Retrieve a list of all sailing clubs.

**Endpoint:** `GET /clubs`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "club-uuid",
      "name": "Riverside Sailing Club",
      "location": "Thames River, London",
      "timezone": "Europe/London",
      "createdAt": "2026-05-29T09:02:23.385Z",
      "_count": {
        "users": 4,
        "races": 3
      }
    }
  ]
}
```

### Get Club by ID
Retrieve detailed information about a specific club.

**Endpoint:** `GET /clubs/:id`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "club-uuid",
    "name": "Riverside Sailing Club",
    "location": "Thames River, London",
    "timezone": "Europe/London",
    "createdAt": "2026-05-29T09:02:23.385Z",
    "users": [
      {
        "id": "user-uuid",
        "email": "admin@sailing.com",
        "firstName": "Admin",
        "lastName": "User",
        "role": "club_admin"
      }
    ],
    "races": [
      {
        "id": "race-uuid",
        "name": "Spring Championship - Race 1",
        "raceDate": "2026-06-15",
        "startTime": "10:00:00",
        "status": "scheduled"
      }
    ],
    "_count": {
      "users": 4,
      "races": 3
    }
  }
}
```

### Create Club
Create a new sailing club.

**Endpoint:** `POST /clubs`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "New Sailing Club",
  "location": "Portsmouth Harbor",
  "timezone": "Europe/London"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Club created successfully",
  "data": {
    "id": "new-club-uuid",
    "name": "New Sailing Club",
    "location": "Portsmouth Harbor",
    "timezone": "Europe/London",
    "createdAt": "2026-05-29T10:00:00.000Z"
  }
}
```

### Update Club
Update club information.

**Endpoint:** `PUT /clubs/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Updated Club Name",
  "location": "New Location",
  "timezone": "Europe/London"
}
```

### Delete Club
Delete a club.

**Endpoint:** `DELETE /clubs/:id`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Club deleted successfully"
}
```

---

## Boats Endpoints

### Get All Boats
Retrieve a list of all boats.

**Endpoint:** `GET /boats`

**Query Parameters:**
- `ownerId` (optional): Filter boats by owner ID

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "boat-uuid",
      "name": "Sea Breeze",
      "sailNumber": "GBR 1234",
      "boatClass": "Laser",
      "pyNumber": "1100.0000",
      "createdAt": "2026-05-29T09:02:23.400Z",
      "owner": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Sailor",
        "email": "john.sailor@example.com"
      },
      "_count": {
        "raceEntries": 5
      }
    }
  ]
}
```

### Get Boat by ID
Retrieve detailed information about a specific boat.

**Endpoint:** `GET /boats/:id`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "boat-uuid",
    "name": "Sea Breeze",
    "sailNumber": "GBR 1234",
    "boatClass": "Laser",
    "pyNumber": "1100.0000",
    "createdAt": "2026-05-29T09:02:23.400Z",
    "owner": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Sailor",
      "email": "john.sailor@example.com",
      "phone": "+44 7700 900001"
    },
    "raceEntries": [
      {
        "id": "entry-uuid",
        "status": "finished",
        "position": 1,
        "race": {
          "id": "race-uuid",
          "name": "Spring Championship - Race 1",
          "startTime": "2026-06-15T10:00:00.000Z",
          "status": "completed"
        }
      }
    ]
  }
}
```

### Create Boat
Register a new boat.

**Endpoint:** `POST /boats`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Wave Rider",
  "sailNumber": "GBR 5678",
  "boatClass": "420",
  "ownerId": "user-uuid",
  "pyNumber": 1105.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Boat created successfully",
  "data": {
    "id": "new-boat-uuid",
    "name": "Wave Rider",
    "sailNumber": "GBR 5678",
    "boatClass": "420",
    "pyNumber": "1105.5000",
    "ownerId": "user-uuid",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "owner": {
      "id": "user-uuid",
      "firstName": "John",
      "lastName": "Sailor",
      "email": "john.sailor@example.com"
    }
  }
}
```

### Update Boat
Update boat information.

**Endpoint:** `PUT /boats/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Updated Boat Name",
  "sailNumber": "GBR 9999",
  "boatClass": "Laser",
  "pyNumber": 1100
}
```

### Delete Boat
Delete a boat.

**Endpoint:** `DELETE /boats/:id`

**Authentication:** Required

---

## Races Endpoints

### Get All Races
Retrieve a list of all races.

**Endpoint:** `GET /races`

**Query Parameters:**
- `clubId` (optional): Filter races by club ID
- `status` (optional): Filter by status (scheduled, in_progress, completed, cancelled)

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "race-uuid",
      "name": "Spring Championship - Race 1",
      "raceDate": "2026-06-15",
      "startTime": "10:00:00",
      "status": "scheduled",
      "clubId": "club-uuid",
      "createdBy": "user-uuid",
      "createdAt": "2026-05-29T09:02:23.450Z",
      "club": {
        "id": "club-uuid",
        "name": "Riverside Sailing Club"
      },
      "_count": {
        "raceEntries": 5
      }
    }
  ]
}
```

### Get Race by ID
Retrieve detailed information about a specific race including all entries.

**Endpoint:** `GET /races/:id`

**Authentication:** Not required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "race-uuid",
    "name": "Spring Championship - Race 1",
    "raceDate": "2026-06-15",
    "startTime": "10:00:00",
    "status": "completed",
    "clubId": "club-uuid",
    "createdBy": "user-uuid",
    "createdAt": "2026-05-29T09:02:23.450Z",
    "club": {
      "id": "club-uuid",
      "name": "Riverside Sailing Club",
      "location": "Thames River, London"
    },
    "raceEntries": [
      {
        "id": "entry-uuid",
        "status": "finished",
        "position": 1,
        "finishTime": "01:15:30",
        "correctedTime": "01:10:45",
        "boat": {
          "id": "boat-uuid",
          "name": "Sea Breeze",
          "sailNumber": "GBR 1234",
          "boatClass": "Laser",
          "owner": {
            "id": "user-uuid",
            "firstName": "John",
            "lastName": "Sailor"
          }
        }
      }
    ]
  }
}
```

### Create Race
Create a new race.

**Endpoint:** `POST /races`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Summer Series - Race 1",
  "raceDate": "2026-07-20",
  "startTime": "14:00:00",
  "clubId": "club-uuid",
  "status": "scheduled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Race created successfully",
  "data": {
    "id": "new-race-uuid",
    "name": "Summer Series - Race 1",
    "raceDate": "2026-07-20",
    "startTime": "14:00:00",
    "status": "scheduled",
    "clubId": "club-uuid",
    "createdBy": "user-uuid",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "club": {
      "id": "club-uuid",
      "name": "Riverside Sailing Club"
    }
  }
}
```

### Update Race
Update race information.

**Endpoint:** `PUT /races/:id`

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Updated Race Name",
  "raceDate": "2026-07-21",
  "startTime": "15:00:00",
  "status": "in_progress"
}
```

### Delete Race
Delete a race.

**Endpoint:** `DELETE /races/:id`

**Authentication:** Required

---

## Race Entries Endpoints

### Register Boat for Race
Register a boat and user for a race.

**Endpoint:** `POST /races/:id/entries`

**Authentication:** Required

**Request Body:**
```json
{
  "boatId": "boat-uuid",
  "userId": "user-uuid"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Boat registered for race successfully",
  "data": {
    "id": "entry-uuid",
    "raceId": "race-uuid",
    "boatId": "boat-uuid",
    "userId": "user-uuid",
    "status": "registered",
    "createdAt": "2026-05-29T10:00:00.000Z",
    "boat": {
      "id": "boat-uuid",
      "name": "Sea Breeze",
      "sailNumber": "GBR 1234",
      "owner": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Sailor"
      }
    },
    "race": {
      "id": "race-uuid",
      "name": "Spring Championship - Race 1",
      "startTime": "2026-06-15T10:00:00.000Z"
    }
  }
}
```

### Update Race Entry Results
Update the results for a race entry.

**Endpoint:** `PUT /races/:raceId/entries/:entryId`

**Authentication:** Required

**Request Body:**
```json
{
  "position": 1,
  "finishTime": "01:15:30",
  "correctedTime": "01:10:45",
  "status": "finished"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Race entry updated successfully",
  "data": {
    "id": "entry-uuid",
    "position": 1,
    "finishTime": "01:15:30",
    "correctedTime": "01:10:45",
    "status": "finished",
    "boat": {
      "id": "boat-uuid",
      "name": "Sea Breeze",
      "owner": {
        "id": "user-uuid",
        "firstName": "John",
        "lastName": "Sailor"
      }
    }
  }
}
```

### Delete Race Entry
Remove a boat from a race.

**Endpoint:** `DELETE /races/:raceId/entries/:entryId`

**Authentication:** Required

**Response:**
```json
{
  "success": true,
  "message": "Race entry deleted successfully"
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "success": false,
  "message": "Error description"
}
```

### Common HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

---

## Data Models

### User Roles
- `sailor` - Regular sailor/participant
- `race_officer` - Can manage races and results
- `club_admin` - Full club administration access

### Race Status
- `scheduled` - Race is planned but not started
- `in_progress` - Race is currently running
- `completed` - Race has finished
- `cancelled` - Race was cancelled

### Race Entry Status
- `registered` - Boat is registered for the race
- `dns` - Did Not Start
- `dnf` - Did Not Finish
- `dsq` - Disqualified
- `finished` - Completed the race

---

## Testing with cURL

### Login Example
```bash
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sailing.com",
    "password": "Password123!"
  }'
```

### Get Clubs Example
```bash
curl http://localhost:3001/api/v1/clubs
```

### Create Race Example (with authentication)
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:3001/api/v1/races \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Race",
    "raceDate": "2026-08-01",
    "startTime": "10:00:00",
    "clubId": "club-uuid-here"
  }'
```

---

## Rate Limiting

Currently, there are no rate limits implemented. This will be added in future versions.

## Versioning

The API is currently at version 1 (`/api/v1`). Breaking changes will result in a new version.

---

**Last Updated:** 2026-05-29