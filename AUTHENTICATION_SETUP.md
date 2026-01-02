# SaathGhumo Authentication System - Setup Guide

## 🎯 Overview

This guide covers the complete authentication system implementation with JWT, OAuth Google, and Firebase integration for the SaathGhumo application.

---

## 📋 What Has Been Implemented

### Backend (Node.js + Express)
✅ User Model with MongoDB
✅ JWT Authentication (Access & Refresh Tokens)
✅ Email/Password Registration & Login
✅ Google OAuth 2.0 Integration
✅ Protected Routes with Middleware
✅ Password Hashing with bcryptjs
✅ Passport.js Configuration

### Frontend (React + TypeScript)
✅ Firebase Configuration
✅ Login Page with Hero Design Matching
✅ Register Page with Hero Design Matching
✅ Auth Service for API Integration
✅ Google OAuth Popup Sign-in/Sign-up
✅ Token Management (localStorage)
✅ Protected Routes Ready

---

## 🚀 Quick Start

### Backend Setup

1. **Install Dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Configure Environment Variables** (backend/.env)
   - Already created with placeholders
   - Update with your actual values:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=8080
   JWT_SECRET=your_long_random_string_min_32_chars
   REFRESH_TOKEN_SECRET=another_long_random_string_min_32_chars
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=http://localhost:5173
   ACCESS_TOKEN_EXPIRY=900
   REFRESH_TOKEN_EXPIRY=2592000
   ```

3. **Generate Secure Tokens**
   Run this in Node.js console to generate secure random strings:
   ```javascript
   require('crypto').randomBytes(32).toString('hex')
   ```

4. **Start Backend Server**
   ```bash
   npm run dev    # Development mode with nodemon
   npm start      # Production mode
   ```
   Server runs on: `http://localhost:8080`

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Configure Environment Variables** (frontend/.env.local)
   - Already created
   - Firebase config is embedded in lib/firebase.ts
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   ```

3. **Start Frontend Dev Server**
   ```bash
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

---

## 🔧 Configuration Details

### 1. Generate JWT Secrets

Generate secure random strings for JWT_SECRET and REFRESH_TOKEN_SECRET:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Run this command twice and update your .env file with the generated values.

### 2. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to Credentials → Create OAuth 2.0 credentials
5. Configure consent screen
6. Create Web Application credentials
7. Add Authorized redirect URIs:
   - `http://localhost:8080/api/auth/google/callback` (Development)
   - `http://localhost:5173` (Frontend)
   - Your production URLs

8. Copy Client ID and Client Secret
9. Update in backend/.env:
   ```env
   GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

### 3. Firebase Setup

Firebase configuration is already integrated in [src/lib/firebase.ts](../frontend/src/lib/firebase.ts):

- **Project ID**: studio-1765981197-c0a8c
- **Auth Domain**: studio-1765981197-c0a8c.firebaseapp.com
- **Storage Bucket**: studio-1765981197-c0a8c.firebasestorage.app

The Firebase config is used for:
- Google Sign-In popup
- Email authentication (optional)
- User profile management

---

## 📁 File Structure

### Backend
```
backend/
├── index.js                 # Main server file
├── package.json            # Dependencies
├── .env                    # Environment variables
├── controllers/
│   └── authController.js   # Auth logic (register, login, logout)
├── middleware/
│   └── auth.js            # JWT verification & Passport config
├── models/
│   └── User.js            # MongoDB User schema
└── routes/
    └── authRoutes.js      # Auth endpoints
```

### Frontend
```
frontend/
├── src/
│   ├── pages/
│   │   ├── Login.tsx      # Login page UI
│   │   ├── Register.tsx   # Register page UI
│   │   └── Index.tsx      # Home page
│   ├── api/
│   │   └── authService.ts # Auth API calls
│   ├── lib/
│   │   └── firebase.ts    # Firebase config
│   ├── App.tsx            # Route configuration
│   └── main.tsx
├── .env.local             # Environment variables
└── package.json           # Dependencies
```

---

## 🔗 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Body | Protected |
|--------|----------|------|-----------|
| POST | `/api/auth/register` | `{email, password, name}` | ❌ |
| POST | `/api/auth/login` | `{email, password}` | ❌ |
| POST | `/api/auth/refresh-token` | `{refreshToken}` | ❌ |
| POST | `/api/auth/logout` | `{refreshToken}` | ✅ |
| GET | `/api/auth/me` | - | ✅ |
| GET | `/api/auth/google` | - | ❌ |
| GET | `/api/auth/google/callback` | - | ❌ |

---

## 🔐 Authentication Flow

### Email/Password Registration
```
1. User fills form (name, email, password)
2. Frontend validates input
3. Calls POST /api/auth/register
4. Backend hashes password with bcryptjs
5. Creates user in MongoDB
6. Generates JWT tokens
7. Returns tokens to frontend
8. Frontend stores in localStorage
9. User redirected to home page
```

### Email/Password Login
```
1. User enters email & password
2. Frontend calls POST /api/auth/login
3. Backend validates credentials
4. Compares passwords using bcryptjs
5. Generates new tokens
6. Returns tokens
7. Frontend stores and navigates
```

### Google OAuth Sign-In/Sign-Up
```
1. User clicks Google button
2. Firebase popup opens
3. User authenticates with Google
4. Firebase returns user data
5. Frontend sends to backend (/api/auth/google)
6. Backend creates/updates user in MongoDB
7. Generates JWT tokens
8. Returns tokens
9. Frontend stores and navigates
```

### Token Refresh
```
1. Access token expires (15 minutes)
2. Frontend detects 401 response
3. Calls POST /api/auth/refresh-token with refreshToken
4. Backend verifies refresh token
5. Issues new access token
6. Frontend updates localStorage
7. Retries original request
```

---

## 💾 Token Storage

Tokens are stored in browser's localStorage:
- **accessToken**: Short-lived (15 minutes) for API requests
- **refreshToken**: Long-lived (30 days) for generating new access tokens

### How to Use Tokens in Requests
```typescript
// GET request with token
const accessToken = localStorage.getItem('accessToken');
fetch('/api/auth/me', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

---

## 🛠️ Usage Examples

### Frontend - Login
```typescript
import { loginWithEmail } from '@/api/authService';

const result = await loginWithEmail({
  email: 'user@example.com',
  password: 'password123'
});

if (result.success) {
  // Tokens automatically stored in localStorage
  navigate('/');
}
```

### Frontend - Register
```typescript
import { registerWithEmail } from '@/api/authService';

const result = await registerWithEmail({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'password123',
  confirmPassword: 'password123'
});
```

### Frontend - Google Sign-In
```typescript
import { signInWithGoogle } from '@/api/authService';

const result = await signInWithGoogle();
// Opens Google popup automatically
```

### Frontend - Get Current User
```typescript
import { getCurrentUser } from '@/api/authService';

const result = await getCurrentUser();
if (result.success) {
  const user = result.data.user;
}
```

### Backend - Protected Route Example
```javascript
const { verifyToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

router.get('/me', verifyToken, authController.getCurrentUser);
```

---

## 🧪 Testing

### Test Registration
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"password123"}'
```

### Test Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"password123"}'
```

### Test Protected Route
```bash
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📱 UI Features

### Login Page
- ✅ Email/Password login form
- ✅ Google Sign-In button
- ✅ Link to Register page
- ✅ "Forgot Password" link
- ✅ Matches hero section design
- ✅ Responsive layout
- ✅ Form validation
- ✅ Toast notifications

### Register Page
- ✅ Name, Email, Password, Confirm Password fields
- ✅ Form validation with password confirmation
- ✅ Google Sign-Up button
- ✅ Link to Login page
- ✅ Matches hero section design
- ✅ Responsive layout
- ✅ Password strength indicator
- ✅ Toast notifications

---

## 🔒 Security Best Practices

✅ Passwords hashed with bcryptjs (salt rounds: 10)
✅ JWT tokens use secure algorithms
✅ CORS configured for development
✅ Refresh tokens stored in database
✅ Access tokens expire after 15 minutes
✅ Refresh tokens expire after 30 days
✅ Password validation (minimum 6 characters)
✅ Email format validation
✅ Protected routes with JWT middleware

### Production Security Recommendations
- [ ] Use HTTPS/SSL certificates
- [ ] Implement rate limiting
- [ ] Add CSRF protection
- [ ] Use HttpOnly cookies for tokens (instead of localStorage)
- [ ] Implement email verification
- [ ] Add 2FA support
- [ ] Use environment-specific secrets
- [ ] Implement request validation with schemas
- [ ] Add request logging
- [ ] Use Web Application Firewall (WAF)

---

## 🚨 Troubleshooting

### MongoDB Connection Error
- Check MONGODB_URI in .env
- Ensure MongoDB Atlas whitelist includes your IP
- Verify credentials are correct

### JWT Token Expired
- Frontend automatically refreshes tokens
- Check ACCESS_TOKEN_EXPIRY in .env

### Google OAuth Not Working
- Verify Google Client ID and Secret
- Check redirect URI matches in Google Console
- Clear browser cache and cookies

### CORS Errors
- Check CLIENT_URL in backend .env
- Ensure backend CORS configuration matches frontend URL

### Tokens Not Persisting
- Check browser localStorage is enabled
- Clear localStorage and re-login
- Check for localStorage quota limits

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API endpoints documentation
3. Check server logs for error messages
4. Verify all environment variables are set correctly

---

## 🎓 Next Steps

1. **Email Verification**
   - Add email confirmation flow
   - Send verification emails

2. **Password Reset**
   - Implement forgot password flow
   - Send reset links

3. **User Profile**
   - Create profile update endpoints
   - Add profile picture upload

4. **Role-Based Access**
   - Implement admin, user, companion roles
   - Create role-based middleware

5. **Session Management**
   - Implement logout all devices
   - Track login sessions

6. **Two-Factor Authentication**
   - Add SMS/Email OTP
   - TOTP support

---

## 📝 Notes

- All passwords are hashed before storage
- Tokens are automatically managed in localStorage
- Firebase is used for OAuth popup authentication
- Backend validates all inputs
- CORS is configured for development
- Response format is consistent across all endpoints

**Created**: December 26, 2025
**Last Updated**: December 26, 2025

