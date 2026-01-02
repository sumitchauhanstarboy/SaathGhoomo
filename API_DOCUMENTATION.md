# SaathGhumo API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication
All protected endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <accessToken>
```

---

## Endpoints

### 1. Register User
**Endpoint**: `POST /auth/register`

**Description**: Create a new user account with email and password

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "65abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": null,
      "bio": "",
      "location": "",
      "isVerified": false,
      "role": "user",
      "authProvider": "email",
      "createdAt": "2025-12-26T10:00:00.000Z",
      "updatedAt": "2025-12-26T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (400):
```json
{
  "success": false,
  "message": "User already exists with this email"
}
```

---

### 2. Login User
**Endpoint**: `POST /auth/login`

**Description**: Authenticate user with email and password

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "65abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": null,
      "bio": "",
      "location": "",
      "isVerified": false,
      "role": "user",
      "authProvider": "email",
      "createdAt": "2025-12-26T10:00:00.000Z",
      "updatedAt": "2025-12-26T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Refresh Access Token
**Endpoint**: `POST /auth/refresh-token`

**Description**: Generate a new access token using refresh token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Invalid or expired refresh token"
}
```

---

### 4. Logout User
**Endpoint**: `POST /auth/logout`

**Protected**: ✅ Requires Authorization header

**Description**: Logout user and invalidate refresh token

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 5. Get Current User
**Endpoint**: `GET /auth/me`

**Protected**: ✅ Requires Authorization header

**Description**: Get authenticated user information

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "65abc123def456",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": null,
      "bio": "",
      "location": "",
      "phoneNumber": "",
      "isVerified": false,
      "role": "user",
      "authProvider": "email",
      "createdAt": "2025-12-26T10:00:00.000Z",
      "updatedAt": "2025-12-26T10:00:00.000Z"
    }
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

---

### 6. Google OAuth Initiate
**Endpoint**: `GET /auth/google`

**Description**: Redirect to Google OAuth consent screen

**Browser Redirect**:
Redirects to Google login page

**After User Approves**:
Redirects to `/api/auth/google/callback`

---

### 7. Google OAuth Callback
**Endpoint**: `GET /auth/google/callback`

**Description**: Handles Google OAuth callback

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Google authentication successful",
  "data": {
    "user": {
      "_id": "65abc123def456",
      "googleId": "google_user_id_123",
      "name": "John Doe",
      "email": "john@example.com",
      "profileImage": "https://lh3.googleusercontent.com/...",
      "bio": "",
      "location": "",
      "isVerified": true,
      "role": "user",
      "authProvider": "google",
      "createdAt": "2025-12-26T10:00:00.000Z",
      "updatedAt": "2025-12-26T10:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response** (401):
```json
{
  "success": false,
  "message": "Authentication failed"
}
```

---

## Error Codes

| Code | Message | Description |
|------|---------|-------------|
| 400 | Bad Request | Missing or invalid request body |
| 401 | Unauthorized | Invalid credentials or expired token |
| 404 | Not Found | User or endpoint not found |
| 500 | Internal Server Error | Server error |

---

## Example Usage

### JavaScript/Fetch

**Register**:
```javascript
const response = await fetch('http://localhost:8080/api/auth/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
console.log(data);
```

**Login**:
```javascript
const response = await fetch('http://localhost:8080/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
});

const data = await response.json();
localStorage.setItem('accessToken', data.data.accessToken);
localStorage.setItem('refreshToken', data.data.refreshToken);
```

**Protected Request**:
```javascript
const token = localStorage.getItem('accessToken');
const response = await fetch('http://localhost:8080/api/auth/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

---

### Using authService (Frontend)

```typescript
import {
  registerWithEmail,
  loginWithEmail,
  signInWithGoogle,
  logout,
  getCurrentUser,
  refreshAccessToken
} from '@/api/authService';

// Register
const registerResult = await registerWithEmail({
  name: 'John',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});

// Login
const loginResult = await loginWithEmail({
  email: 'john@example.com',
  password: 'password123'
});

// Google Sign-In
const googleResult = await signInWithGoogle();

// Get Current User
const userResult = await getCurrentUser();

// Logout
const logoutResult = await logout();

// Refresh Token
const refreshResult = await refreshAccessToken();
```

---

## Rate Limiting
Not implemented yet. Consider adding for production:
- 5 login attempts per 15 minutes per IP
- 10 register attempts per hour per IP

---

## CORS Configuration
**Allowed Origins**: `http://localhost:5173` (development)

**Allowed Methods**: GET, POST, PUT, DELETE, OPTIONS

**Allowed Headers**: Content-Type, Authorization

---

## Response Format

All responses follow this format:

**Success**:
```json
{
  "success": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

**Error**:
```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details (in development)"
}
```

---

## Token Structure

**Access Token** (JWT):
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "user_id", iat: 1234567890, exp: 1234568790 }
Expiry: 15 minutes
```

**Refresh Token** (JWT):
```
Header: { alg: "HS256", typ: "JWT" }
Payload: { userId: "user_id", iat: 1234567890, exp: 1234567890 }
Expiry: 30 days
```

---

## User Schema

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed),
  name: String (required),
  googleId: String (unique, sparse),
  profileImage: String,
  bio: String,
  location: String,
  phoneNumber: String,
  isVerified: Boolean,
  role: String (enum: ['user', 'companion', 'admin']),
  authProvider: String (enum: ['email', 'google']),
  refreshTokens: [
    {
      token: String,
      createdAt: Date
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

Created: December 26, 2025
