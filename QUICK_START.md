# Quick Start Guide - SaathGhumo Authentication

## ⚡ 5-Minute Setup

### Step 1: Backend Dependencies
```bash
cd backend
npm install
```

### Step 2: Update Backend .env
Edit `backend/.env`:
```env
# Generate these using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=your_32_char_secret_here
REFRESH_TOKEN_SECRET=another_32_char_secret_here
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Step 3: Frontend Dependencies
```bash
cd frontend
npm install
```

### Step 4: Start Services

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```
✅ Server runs on `http://localhost:8080`

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```
✅ App runs on `http://localhost:5173`

## 🧪 Quick Test

### Visit Login Page
Go to: `http://localhost:5173/login`

### Test Email Login
1. Click "Sign In"
2. Use test credentials:
   - Email: test@example.com (any email)
   - Password: password123
3. Or click "Create Account" to register first

### Test Google Sign-In
1. Click Google button
2. Select your Google account
3. Firebase will handle authentication

## 📱 Pages Available

| URL | Purpose |
|-----|---------|
| `http://localhost:5173/` | Home Page |
| `http://localhost:5173/login` | Login Page |
| `http://localhost:5173/register` | Register Page |

## 🔑 Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Google+ API
4. Create OAuth credentials (Web Application)
5. Add these URIs to Authorized Redirect URIs:
   - `http://localhost:8080/api/auth/google/callback`
   - `http://localhost:5173`
6. Copy Client ID and Secret to `.env`

## 🚀 After Setup

### Database Structure
User collection in MongoDB with these fields:
- email (unique)
- name
- password (hashed)
- googleId (for OAuth)
- profileImage
- bio, location, phoneNumber
- isVerified, role
- authProvider (email or google)
- refreshTokens (for managing sessions)

### How Authentication Works

1. **User registers/logs in**
2. **Backend validates and creates tokens**
3. **Frontend stores tokens in localStorage**
4. **All API requests include token in header**
5. **Backend verifies token before responding**
6. **When token expires, frontend refreshes it**

### Frontend Features Ready

✅ Email/Password authentication
✅ Google OAuth Sign-In/Sign-Up
✅ Automatic token refresh
✅ Protected API routes
✅ Beautiful UI matching home page
✅ Form validation
✅ Error notifications
✅ Responsive design

## 📚 Documentation

- **Full Setup Guide**: See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md)
- **API Documentation**: See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🐛 Common Issues

**MongoDB Connection Failed**
- Check your MongoDB URI in `.env`
- Ensure your IP is whitelisted in MongoDB Atlas

**Google OAuth Not Working**
- Verify credentials are in `.env`
- Check redirect URIs match exactly
- Clear browser cookies

**Tokens Not Persisting**
- Check if localStorage is enabled
- Try in incognito/private mode

## 📞 Need Help?

1. Check logs in terminal
2. Review API_DOCUMENTATION.md
3. Check AUTHENTICATION_SETUP.md troubleshooting section

## ✨ Next Steps

After verifying the system works:

1. Deploy backend to production (Heroku, Railway, Render)
2. Update `VITE_API_BASE_URL` in `.env.local`
3. Deploy frontend to production (Vercel, Netlify)
4. Update Google OAuth redirect URIs to production URLs
5. Add email verification flow
6. Implement password reset
7. Add user profile editing

---

**Version**: 1.0.0  
**Date**: December 26, 2025
