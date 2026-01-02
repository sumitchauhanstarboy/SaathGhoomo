# 🚀 Saath Ghoomo - Backend API Documentation

## 📋 Table of Contents
1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Installation & Setup](#installation--setup)
5. [Authentication APIs](#authentication-apis)
6. [User Profile APIs](#user-profile-apis)
7. [OTP/Mobile Login APIs](#otpmobile-login-apis)
8. [Error Handling](#error-handling)
9. [Security Best Practices](#security-best-practices)
10. [Deployment Guide](#deployment-guide)

---

## 📖 Overview

Saath Ghoomo is a companion booking and social connection platform backend. This API provides:

- ✅ **User Registration & Login** with email/password authentication
- ✅ **JWT-based Authentication** with token refresh mechanism
- ✅ **User Profile Management** with comprehensive profile fields
- ✅ **Mobile OTP Login** for seamless mobile authentication
- ✅ **Google OAuth Integration** with Firebase support
- ✅ **Secure Password Hashing** using bcrypt
- ✅ **Role-based Access Control** (user, companion, admin)
- ✅ **Verified Profiles** and user ratings system
- ✅ **Coin-based System** for future payment integration

---

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|-----------|---------|---------|
| Node.js | 14+ | Runtime environment |
| Express.js | 4.18+ | Web framework |
| MongoDB | 4.0+ | Database |
| Mongoose | 8.0+ | MongoDB ODM |
| JWT | 9.0+ | Token-based authentication |
| bcryptjs | 2.4+ | Password hashing |
| Passport | 0.7+ | Authentication middleware |
| Dotenv | 16.0+ | Environment variables |
| CORS | 2.8+ | Cross-origin resource sharing |

---

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # MongoDB configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User profile management
│   └── otpController.js      # OTP verification logic
├── middleware/
│   └── auth.js               # JWT and Passport strategies
├── models/
│   └── User.js               # User schema and methods
├── routes/
│   ├── authRoutes.js         # Authentication routes
│   ├── userRoutes.js         # User profile routes
├── .env.example              # Environment variables template
├── package.json              # Dependencies
└── index.js                  # Main server file
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v14+
- MongoDB (local or MongoDB Atlas)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/yourusername/SaathGhoomo.git
cd SaathGhoomo/backend
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
```bash
cp .env.example .env
```

### Step 4: Configure Environment Variables
Edit `.env` with your configuration:

```env
PORT=8081
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/saathghoomo
# OR for MongoDB Atlas
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/saathghoomo?retryWrites=true&w=majority

# JWT Secrets (generate strong random strings)
JWT_SECRET=your_super_secret_jwt_key_1234567890
REFRESH_TOKEN_SECRET=your_super_secret_refresh_key_0987654321

# Client URL
CLIENT_URL=http://localhost:5173
```

### Step 5: Start MongoDB
```bash
# If using local MongoDB
mongod

# OR if using MongoDB Atlas, skip this step (cloud-hosted)
```

### Step 6: Run Server
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

Server will start on: `http://localhost:8081`

---

## 🔐 Authentication APIs

### 1. User Registration

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "mobile": "9876543210",
  "gender": "Male",
  "age": 28,
  "city": "Mumbai",
  "interests": ["travel", "photography", "hiking"]
}
```

**Required Fields:**
- `email` - Valid email address (unique)
- `password` - Minimum 6 characters
- `name` - Full name

**Optional Fields:**
- `mobile` - Phone number (unique)
- `gender` - "Male", "Female", "Other", "Prefer not to say"
- `age` - Between 18-100
- `city` - City name
- `interests` - Array of interests

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "mobile": "9876543210",
      "gender": "Male",
      "age": 28,
      "city": "Mumbai",
      "interests": ["travel", "photography"],
      "isVerified": false,
      "coins": 0,
      "rating": 0,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Email is already registered"
}
```

---

### 2. User Login

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User logged in successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      ...
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid email or password"
}
```

---

### 3. Refresh Access Token

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 4. Get Current User

**Endpoint:** `GET /api/auth/me`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      ...
    }
  }
}
```

---

### 5. Logout

**Endpoint:** `POST /api/auth/logout`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User logged out successfully"
}
```

---

## 👤 User Profile APIs

### 1. Get User Profile

**Endpoint:** `GET /api/users/profile`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "name": "John Doe",
      "mobile": "9876543210",
      "gender": "Male",
      "age": 28,
      "city": "Mumbai",
      "interests": ["travel", "photography"],
      "profileImage": "https://example.com/image.jpg",
      "bio": "Travel enthusiast",
      "isVerified": false,
      "coins": 100,
      "rating": 4.5,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

---

### 2. Get User Profile by ID (Public)

**Endpoint:** `GET /api/users/:userId`

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile retrieved successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### 3. Update User Profile

**Endpoint:** `PUT /api/users/profile/update`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "gender": "Male",
  "age": 29,
  "city": "Mumbai",
  "bio": "Travel enthusiast and photographer",
  "interests": ["travel", "photography", "hiking"],
  "profileImage": "https://example.com/new-image.jpg",
  "mobile": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User profile updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### 4. Update User Interests

**Endpoint:** `PUT /api/users/interests`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "interests": ["travel", "photography", "cooking", "music"]
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Interests updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### 5. Update Profile Image

**Endpoint:** `PUT /api/users/profile-image`

**Headers:**
```
Authorization: Bearer <accessToken>
```

**Request Body:**
```json
{
  "profileImage": "https://example.com/profile.jpg"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Profile image updated successfully",
  "data": {
    "user": { ... }
  }
}
```

---

### 6. Search Users

**Endpoint:** `GET /api/users/search?q=John&city=Mumbai&limit=10`

**Query Parameters:**
- `q` - Search by name (optional)
- `city` - Filter by city (optional)
- `limit` - Maximum results (default: 10)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": {
    "users": [
      { ... },
      { ... }
    ]
  }
}
```

---

## 📱 OTP/Mobile Login APIs

### 1. Send OTP

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your mobile number",
  "devOTP": "123456"  // Only in development mode
}
```

---

### 2. Verify OTP & Login

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "mobile": "9876543210",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully. User logged in",
  "data": {
    "user": { ... },
    "accessToken": "...",
    "refreshToken": "..."
  }
}
```

---

### 3. Resend OTP

**Endpoint:** `POST /api/auth/resend-otp`

**Request Body:**
```json
{
  "mobile": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP resent successfully"
}
```

---

## ⚠️ Error Handling

### Common Error Responses

#### 400 - Bad Request
```json
{
  "success": false,
  "message": "Please provide email, password, and name"
}
```

#### 401 - Unauthorized
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### 404 - Not Found
```json
{
  "success": false,
  "message": "User not found"
}
```

#### 500 - Internal Server Error
```json
{
  "success": false,
  "message": "Internal server error",
  "error": "error message"
}
```

---

## 🔒 Security Best Practices

### 1. **Password Security**
- All passwords are hashed using bcrypt with salt rounds = 10
- Passwords are never returned in API responses
- Minimum 6 characters enforced (should be 8+ in production)

### 2. **Token Security**
- Access tokens expire in 15 minutes (configurable)
- Refresh tokens expire in 30 days and are stored in database
- Tokens stored in Authorization header with Bearer scheme
- JWT uses HS256 algorithm with strong secret

### 3. **Input Validation**
- Email format validation using regex
- Mobile number format validation
- Type checking for all inputs
- SQL injection prevention via Mongoose ODM

### 4. **Environment Variables**
- All sensitive data stored in `.env` file
- Never commit `.env` to version control
- Use `.env.example` as template

### 5. **CORS Configuration**
- Only allowed origins can access API
- Credentials enabled for secure cookies
- Proper preflight handling for complex requests

### 6. **Rate Limiting** (Recommended for production)
```bash
npm install express-rate-limit
```

---

## 🌐 Google OAuth Setup

### Prerequisites
1. Google Cloud Console Project
2. OAuth 2.0 Client ID for Web
3. Redirect URIs configured

### Configuration

1. **Get Credentials:**
   - Visit [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials (Web application type)
   - Set Authorized redirect URIs:
     - `http://localhost:8081/api/auth/google/callback` (development)
     - `https://yourdomain.com/api/auth/google/callback` (production)

2. **Add to .env:**
```env
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
```

3. **Frontend Integration:**
```javascript
// Frontend OAuth login
const response = await fetch('http://localhost:8081/api/auth/google', {
  headers: {
    'Authorization': `Bearer ${firebaseIdToken}`
  }
});
```

---

## 📊 Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  
  // Authentication
  email: String (unique, required),
  password: String (hashed, not returned),
  googleId: String (unique, sparse),
  authProvider: String (enum: "email", "google"),
  
  // Profile
  name: String (required),
  mobile: String (unique, sparse),
  gender: String (enum: "Male", "Female", "Other", "Prefer not to say"),
  age: Number (18-100),
  city: String,
  bio: String (max 500 chars),
  interests: [String],
  
  // Media
  profileImage: String (URL),
  
  // Platform
  isVerified: Boolean (default: false),
  coins: Number (default: 0),
  rating: Number (0-5, default: 0),
  role: String (enum: "user", "companion", "admin"),
  
  // Tokens
  refreshTokens: [{
    token: String,
    createdAt: Date (expires in 30 days)
  }],
  
  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🚢 Deployment Guide

### Heroku Deployment

```bash
# Install Heroku CLI and login
heroku login

# Create new app
heroku create saath-ghoomo-api

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set GOOGLE_CLIENT_ID=your_client_id
heroku config:set GOOGLE_CLIENT_SECRET=your_client_secret

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Docker Deployment

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t saath-ghoomo-api .
docker run -p 8081:8081 --env-file .env saath-ghoomo-api
```

---

## 🧪 Testing API with cURL

### Register User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe",
    "mobile": "9876543210"
  }'
```

### Login User
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### Get User Profile (Protected)
```bash
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📞 Support & Contact

For issues, questions, or feature requests:
- GitHub Issues: [Project Issues](https://github.com/yourusername/SaathGhoomo/issues)
- Email: support@saathghoomo.com

---

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

---

**Happy Coding! 🚀**
