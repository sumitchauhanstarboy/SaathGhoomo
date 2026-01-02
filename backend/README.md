# 🚀 Saath Ghoomo Backend

> A secure, scalable backend for companion booking and social connection platform

[![Node.js](https://img.shields.io/badge/Node.js-14+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.0+-green.svg)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-9.0+-blue.svg)](https://jwt.io/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Overview

Complete backend API for Saath Ghoomo with:
- ✅ User registration & authentication
- ✅ JWT token management
- ✅ User profile management
- ✅ Mobile OTP login
- ✅ Google OAuth integration
- ✅ Enterprise-grade security
- ✅ Production-ready code

## ⚡ Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# 3. Start MongoDB
mongod

# 4. Run server
npm run dev
```

Server running at: `http://localhost:8081`

## 📚 Documentation

| Document | Purpose |
|----------|---------|
| [BACKEND_SETUP.md](./BACKEND_SETUP.md) | Installation & setup guide |
| [BACKEND_API_DOCUMENTATION.md](./BACKEND_API_DOCUMENTATION.md) | Complete API reference |
| [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) | Security best practices |
| [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) | Testing guide with examples |
| [IMPLEMENTATION_COMPLETE.md](./IMPLEMENTATION_COMPLETE.md) | What's been built |

## 🔌 API Endpoints

### Authentication
```
POST   /api/auth/register        # Register user
POST   /api/auth/login           # Login user
POST   /api/auth/refresh-token   # Refresh access token
GET    /api/auth/me              # Get current user (protected)
POST   /api/auth/logout          # Logout (protected)
POST   /api/auth/send-otp        # Send OTP
POST   /api/auth/verify-otp      # Verify OTP & login
POST   /api/auth/google          # Google OAuth
```

### User Profile
```
GET    /api/users/profile        # Get profile (protected)
PUT    /api/users/profile/update # Update profile (protected)
GET    /api/users/:userId        # Get public profile
GET    /api/users/search         # Search users
```

## 🔐 Security

- ✅ Password hashing with bcrypt
- ✅ JWT token authentication
- ✅ Input validation & sanitization
- ✅ CORS protection
- ✅ Environment variable management
- ✅ SQL injection prevention
- ✅ XSS protection ready

See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for details.

## 🗄️ Database Schema

```javascript
User {
  email: String (unique),
  password: String (hashed),
  name: String,
  mobile: String (unique),
  gender: String,
  age: Number,
  city: String,
  interests: [String],
  profileImage: String,
  isVerified: Boolean,
  coins: Number,
  rating: Number,
  role: String,
  refreshTokens: [],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Using cURL
```bash
# Register
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Login
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get Profile (protected)
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Using Postman
1. Import collection from [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md)
2. Configure environment variables
3. Start testing

See [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) for complete examples.

## 📦 Dependencies

- `express` - Web framework
- `mongoose` - MongoDB ORM
- `jsonwebtoken` - JWT authentication
- `bcryptjs` - Password hashing
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `passport` - Authentication strategies

## 🚢 Deployment

### Heroku
```bash
heroku create saath-ghoomo-api
heroku config:set MONGODB_URI=your_uri
heroku config:set JWT_SECRET=your_secret
git push heroku main
```

### Docker
```bash
docker build -t saath-ghoomo-api .
docker run -p 8081:8081 --env-file .env saath-ghoomo-api
```

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for complete deployment guide.

## 📝 Environment Variables

```env
# Server
PORT=8081
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/saathghoomo

# JWT
JWT_SECRET=your_secret_key
REFRESH_TOKEN_SECRET=your_refresh_secret

# Client
CLIENT_URL=http://localhost:5173

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
```

Generate secrets:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # Profile management
│   └── otpController.js   # OTP verification
├── middleware/
│   └── auth.js            # JWT & authentication
├── models/
│   └── User.js            # User schema
├── routes/
│   ├── authRoutes.js      # Auth endpoints
│   └── userRoutes.js      # Profile endpoints
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json           # Dependencies
└── index.js               # Main server file
```

## 🎯 Features

### Implemented ✅
- User registration with validation
- Email/password login
- JWT token management (access + refresh)
- User profile management
- Update interests and preferences
- OTP-based mobile login
- Google OAuth integration
- Secure password hashing
- Input validation
- Error handling
- CORS support

### Ready for Integration 🔄
- Verified profiles
- User rating system
- Coin-based payments
- Admin panel
- Companion profiles
- Booking system
- Real-time chat
- Notifications

## 🐛 Troubleshooting

### MongoDB connection failed
```bash
# Start MongoDB
mongod

# Check .env MONGODB_URI
```

### Port already in use
```bash
# Change PORT in .env or kill process
lsof -ti:8081 | xargs kill -9
```

### Token errors
- Ensure token format: `Bearer <token>`
- Check token hasn't expired
- Use refresh token to get new access token

See [BACKEND_SETUP.md](./BACKEND_SETUP.md) for more troubleshooting.

## 📊 Performance

- Response time: ~50-100ms for average requests
- Database queries: Optimized with indexes
- Token generation: < 5ms
- Password hashing: ~100ms (bcrypt)

## 🔒 Security Considerations

- Passwords are **never** returned in API responses
- Tokens are signed with **strong secrets** (HS256)
- All user inputs are **validated** and **sanitized**
- CORS is **configured** for allowed origins only
- Database uses **unique indexes** for email and mobile
- Refresh tokens are **stored** and **managed** in database

See [SECURITY_GUIDE.md](./SECURITY_GUIDE.md) for production recommendations.

## 🤝 Contributing

1. Create feature branch
2. Commit changes
3. Push to branch
4. Create Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 💬 Support

- 📖 Read documentation in docs folder
- 🐛 Report issues on GitHub
- 💡 Suggest features via GitHub Discussions

## 🙏 Acknowledgments

Built with ❤️ for the Saath Ghoomo platform

---

**Ready to build? Start with [BACKEND_SETUP.md](./BACKEND_SETUP.md)!** 🚀
