# 🚀 Saath Ghoomo - Backend Setup Guide

## ⚡ Quick Start (5 Minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Create .env File
```bash
cp .env.example .env
```

### 3. Configure MongoDB
Edit `.env` and add your MongoDB URI:
```env
MONGODB_URI=mongodb://localhost:27017/saathghoomo
```

### 4. Generate JWT Secrets
Replace these in `.env` with strong random strings:
```env
JWT_SECRET=your_unique_secret_key_1234567890
REFRESH_TOKEN_SECRET=your_unique_refresh_key_0987654321
```

Generate secrets using Node:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 5. Start Server
```bash
npm run dev
```

✅ Server running at `http://localhost:8081`

---

## 📋 Complete Setup Steps

### Step 1: Prerequisites
- **Node.js** v14 or higher
  - [Download Node.js](https://nodejs.org/)
  - Verify: `node --version`

- **MongoDB**
  - Local: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
  - OR Cloud: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier available)

### Step 2: Clone Project
```bash
cd c:\Users\sumit\OneDrive\Desktop\SaathGhoomo\backend
```

### Step 3: Install Dependencies
```bash
npm install
```

**Dependencies installed:**
- `express` - Web framework
- `mongoose` - MongoDB ORM
- `jsonwebtoken` - JWT tokens
- `bcryptjs` - Password hashing
- `cors` - Cross-origin requests
- `dotenv` - Environment variables
- `passport` - Authentication strategies
- `nodemon` - Auto-reload (dev only)

### Step 4: Environment Configuration

#### Create .env file
```bash
cp .env.example .env
```

#### Configure MongoDB

**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/saathghoomo
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to `.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/saathghoomo?retryWrites=true&w=majority
```

#### Generate JWT Secrets
Run this command and copy the output:
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
node -e "console.log('REFRESH_TOKEN_SECRET=' + require('crypto').randomBytes(32).toString('hex'))"
```

Add to `.env`:
```env
JWT_SECRET=<generated-secret-1>
REFRESH_TOKEN_SECRET=<generated-secret-2>
```

### Step 5: Start MongoDB (if local)
```bash
# Windows
mongod

# macOS/Linux
brew services start mongodb-community
```

### Step 6: Run Server

**Development Mode** (with auto-reload):
```bash
npm run dev
```

**Production Mode**:
```bash
npm start
```

**Expected Output:**
```
✅ MongoDB connected successfully
📍 Database: saathghoomo
Server is running on port 8081
API URL: http://localhost:8081
```

---

## 🧪 Test API Endpoints

### Option 1: Using cURL

#### Register User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User",
    "mobile": "9876543210",
    "city": "Mumbai"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the `accessToken` from response for next request.

#### Get User Profile
```bash
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

### Option 2: Using Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Create new collection "Saath Ghoomo"
3. Add requests:

#### Register Request
- **Method:** POST
- **URL:** `http://localhost:8081/api/auth/register`
- **Headers:** Content-Type: application/json
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "mobile": "9876543210",
  "city": "Mumbai",
  "interests": ["travel", "photography"]
}
```

#### Login Request
- **Method:** POST
- **URL:** `http://localhost:8081/api/auth/login`
- **Headers:** Content-Type: application/json
- **Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Profile Request
- **Method:** GET
- **URL:** `http://localhost:8081/api/users/profile`
- **Headers:** Authorization: Bearer <accessToken_from_login>

### Option 3: Using VS Code Thunder Client Extension

1. Install [Thunder Client Extension](https://www.thunderclient.com/)
2. Follow same steps as Postman above

---

## 📝 Environment Variables Reference

```env
# Server
PORT=8081                                          # Port to run server
NODE_ENV=development                               # development/production

# Database
MONGODB_URI=mongodb://localhost:27017/saathghoomo  # MongoDB connection

# JWT
JWT_SECRET=your_super_secret_key                   # JWT signing secret
ACCESS_TOKEN_EXPIRY=15m                            # Access token expiry
REFRESH_TOKEN_EXPIRY=30d                           # Refresh token expiry
REFRESH_TOKEN_SECRET=your_refresh_secret           # Refresh token secret

# OAuth (Optional)
GOOGLE_CLIENT_ID=your_google_client_id             # Google OAuth client ID
GOOGLE_CLIENT_SECRET=your_google_client_secret     # Google OAuth secret

# Firebase (Optional)
FIREBASE_API_KEY=your_firebase_api_key             # Firebase API key

# CORS
CLIENT_URL=http://localhost:5173                   # Frontend URL
```

---

## 🔧 Troubleshooting

### Issue: "MongoDB connection error"

**Solution 1: Check MongoDB is running**
```bash
# Windows
mongod

# macOS
brew services start mongodb-community

# Linux
sudo service mongod start
```

**Solution 2: Check MONGODB_URI in .env**
```bash
# Test connection
node -e "const mongoose = require('mongoose'); mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/test').then(() => console.log('✅ Connected')).catch(e => console.log('❌', e.message))"
```

### Issue: "Port 8081 already in use"

**Solution:** Change PORT in .env
```env
PORT=8082
```

### Issue: "ENOENT: no such file or directory .env"

**Solution:** Create .env file
```bash
cp .env.example .env
```

### Issue: "JWT_SECRET not defined"

**Solution:** Add JWT_SECRET to .env
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# Copy output and add to .env
```

---

## 📚 API Documentation

See [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) for complete API endpoints and examples.

### Quick API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register` | POST | Register new user |
| `/api/auth/login` | POST | Login user |
| `/api/auth/me` | GET | Get current user (protected) |
| `/api/auth/logout` | POST | Logout user (protected) |
| `/api/auth/refresh-token` | POST | Refresh access token |
| `/api/auth/send-otp` | POST | Send OTP to mobile |
| `/api/auth/verify-otp` | POST | Verify OTP and login |
| `/api/users/profile` | GET | Get user profile (protected) |
| `/api/users/profile/update` | PUT | Update profile (protected) |
| `/api/users/:userId` | GET | Get public user profile |
| `/api/users/search` | GET | Search users |

---

## 🌐 Connect Frontend

### Frontend Setup (React/Vite)

1. Frontend running at `http://localhost:5173`

2. Update `.env` in backend:
```env
CLIENT_URL=http://localhost:5173
```

3. In frontend, API calls:
```javascript
const API_URL = 'http://localhost:8081/api';

// Register
const response = await fetch(`${API_URL}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password, name })
});

// Get Profile (with token)
const response = await fetch(`${API_URL}/users/profile`, {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

---

## 🚢 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login
heroku login

# Create app
heroku create saath-ghoomo-api

# Set environment variables
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret
heroku config:set CLIENT_URL=your_frontend_url

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

### Deploy to Render

1. Push code to GitHub
2. Go to [render.com](https://render.com)
3. Create new "Web Service"
4. Connect GitHub repository
5. Configure environment variables
6. Deploy

---

## 📊 Project Features

✅ **Implemented:**
- User registration with email/password
- User login with JWT tokens
- Token refresh mechanism
- User profile management
- Mobile OTP login
- Google OAuth integration
- Verified profiles
- Coin system (foundation)
- Rating system (foundation)
- CORS support

🔄 **Ready for Future Integration:**
- Admin panel
- Companion profile types
- Payment gateway integration
- Real-time chat
- Booking system
- Review & ratings
- SMS notifications
- Email notifications

---

## 📞 Support

If you encounter issues:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md)
3. Check MongoDB connection
4. Verify .env configuration
5. Check logs: `npm run dev`

---

## ✅ Verification Checklist

- [ ] Node.js installed (`node --version`)
- [ ] MongoDB running or MongoDB Atlas configured
- [ ] `.env` file created with all required variables
- [ ] Dependencies installed (`npm install` successful)
- [ ] Server starts (`npm run dev` runs without errors)
- [ ] Can register user (test at `/api/auth/register`)
- [ ] Can login user (test at `/api/auth/login`)
- [ ] Can get profile (test at `/api/users/profile` with token)

---

**You're all set! 🎉 Start building!**
