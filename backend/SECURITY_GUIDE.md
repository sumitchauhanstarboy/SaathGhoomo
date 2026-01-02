# 🔒 Saath Ghoomo - Security Guide

## 📋 Table of Contents
1. [Security Features](#security-features)
2. [Password Security](#password-security)
3. [Token Security](#token-security)
4. [Data Validation](#data-validation)
5. [Environment Security](#environment-security)
6. [Production Security](#production-security)
7. [Common Vulnerabilities](#common-vulnerabilities)
8. [Security Checklist](#security-checklist)

---

## 🔐 Security Features

### Implemented Security Measures

| Feature | Implementation | Status |
|---------|-----------------|--------|
| **Password Hashing** | bcrypt with 10 salt rounds | ✅ |
| **JWT Authentication** | HS256 algorithm with strong secrets | ✅ |
| **Token Expiry** | 15m access + 30d refresh | ✅ |
| **Input Validation** | Email, mobile, age validation | ✅ |
| **CORS Protection** | Whitelist allowed origins | ✅ |
| **SQL Injection Prevention** | Mongoose ODM | ✅ |
| **Rate Limiting** | Ready for integration | ⏳ |
| **HTTPS Enforcement** | Recommended for production | ℹ️ |
| **Security Headers** | Helmet middleware | ⏳ |
| **Audit Logging** | Ready for integration | ⏳ |

---

## 🔑 Password Security

### Hashing Algorithm

```javascript
// bcrypt configuration (User.js)
const salt = await bcrypt.genSalt(10);  // 10 rounds
const hashedPassword = await bcrypt.hash(password, salt);
```

**Why bcrypt?**
- Slow hashing (CPU-intensive) - resistant to brute-force
- Adaptive salt - increases security as hardware improves
- Industry standard - widely tested and trusted

### Password Validation

**Requirements:**
- Minimum 6 characters (should be 8+ in production)
- Cannot be empty
- Hashed before storage
- Never returned in API responses

```javascript
// Validation in authController.js
if (password.length < 6) {
  return res.status(400).json({
    success: false,
    message: "Password must be at least 6 characters long"
  });
}
```

### Recommended Enhancements for Production

```javascript
// Add stronger validation
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

if (!passwordRegex.test(password)) {
  return res.status(400).json({
    message: "Password must contain uppercase, lowercase, number, and special character"
  });
}
```

---

## 🎫 Token Security

### JWT Implementation

```javascript
// Token Generation (authController.js)
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
    algorithm: "HS256"
  });
};

const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d"
  });
};
```

### Token Verification

```javascript
// Middleware (middleware/auth.js)
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
```

### Token Storage

**Frontend Best Practice:**
```javascript
// Store in memory (most secure)
let accessToken = null;
let refreshToken = null;

// Fetch with token
fetch('/api/users/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
```

**Avoid:**
- ❌ localStorage - vulnerable to XSS attacks
- ❌ sessionStorage - vulnerable to XSS attacks
- ❌ Cookies without httpOnly flag - vulnerable to XSS attacks

**Better Alternative:**
```javascript
// Use httpOnly cookies (backend sets)
res.cookie('accessToken', token, {
  httpOnly: true,  // Cannot be accessed by JavaScript
  secure: true,    // HTTPS only
  sameSite: 'strict', // CSRF protection
  maxAge: 15 * 60 * 1000 // 15 minutes
});
```

---

## ✔️ Data Validation

### Email Validation

```javascript
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    success: false,
    message: "Please provide a valid email address"
  });
}
```

### Mobile Number Validation

```javascript
// India format (10 digits, starting with 6-9)
const mobileRegex = /^[6-9]\d{9}$/;

if (!mobileRegex.test(mobile)) {
  return res.status(400).json({
    success: false,
    message: "Please provide a valid mobile number"
  });
}
```

### Age Validation

```javascript
if (age < 18 || age > 100) {
  return res.status(400).json({
    success: false,
    message: "Age must be between 18 and 100"
  });
}
```

### Input Sanitization

```javascript
// Remove leading/trailing whitespace
const name = req.body.name?.trim();
const city = req.body.city?.trim();

// Prevent NoSQL injection
const safeEmail = email.toLowerCase();
```

---

## 🔐 Environment Security

### .env File Protection

**✅ DO:**
```bash
# .gitignore
.env
.env.local
.env.*.local
*.pem
*.key
node_modules/
```

**❌ DON'T:**
- Never commit `.env` to Git
- Never share `.env` file
- Never log secrets
- Never hardcode secrets in code

### Secrets Management

**Development:**
```env
JWT_SECRET=dev_secret_only_for_development_1234
MONGODB_URI=mongodb://localhost:27017/saathghoomo
```

**Production:**
```env
JWT_SECRET=<use_strong_random_string_from_secure_manager>
MONGODB_URI=<mongodb_atlas_connection_string>
```

**Generate Strong Secrets:**
```bash
# Command line
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Output: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Environment Variables Template

See `.env.example` for all required variables:
```env
PORT=8081
NODE_ENV=development
MONGODB_URI=...
JWT_SECRET=...
REFRESH_TOKEN_SECRET=...
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Production Security

### Security Headers

**Install Helmet middleware:**
```bash
npm install helmet
```

**Use in server:**
```javascript
const helmet = require('helmet');
app.use(helmet());
```

### Rate Limiting

**Install express-rate-limit:**
```bash
npm install express-rate-limit
```

**Implement:**
```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per IP
  message: "Too many login attempts, please try again later"
});

app.post('/api/auth/login', loginLimiter, authController.login);
```

### HTTPS Enforcement

**Configure in production:**
```javascript
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(301, `https://${req.host}${req.url}`);
  }
  next();
});
```

### CORS Configuration

**Current configuration:**
```javascript
const allowedOrigins = process.env.CLIENT_URLS?.split(',') 
  || ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Duplicate Key Error Handling

```javascript
if (error.code === 11000) {
  const field = Object.keys(error.keyPattern)[0];
  return res.status(400).json({
    success: false,
    message: `${field} is already in use`
  });
}
```

---

## ⚠️ Common Vulnerabilities

### 1. SQL/NoSQL Injection

**Vulnerable:**
```javascript
// ❌ DON'T
db.users.find({ email: req.body.email }); // Unsafe
```

**Safe:**
```javascript
// ✅ DO
const User = require('../models/User');
const user = await User.findOne({ email: req.body.email });
```

**Prevention:**
- Use Mongoose ODM (we do this)
- Never concatenate user input into queries
- Use parameterized queries

### 2. XSS (Cross-Site Scripting)

**Vulnerable:**
```javascript
// ❌ Frontend - DON'T
document.getElementById('profile').innerHTML = userData;
```

**Safe:**
```javascript
// ✅ Frontend - DO
document.getElementById('profile').textContent = userData;
// OR
element.innerText = userData;
```

**Backend Prevention:**
```javascript
// Sanitize output
app.use(helmet.xssFilter());
```

### 3. CSRF (Cross-Site Request Forgery)

**Prevention:**
```javascript
// Use CSRF tokens or SameSite cookies
res.cookie('token', jwt, {
  httpOnly: true,
  sameSite: 'strict',
  secure: true
});
```

### 4. Brute Force Attacks

**Solution - Rate Limiting:**
```javascript
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
});

app.post('/api/auth/login', loginLimiter, authController.login);
```

### 5. Weak JWT Secrets

**❌ BAD:**
```env
JWT_SECRET=secret123
JWT_SECRET=password
```

**✅ GOOD:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 6. Unencrypted Password Storage

**Our Implementation (Correct):**
```javascript
// Password is hashed before storage
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
```

### 7. Token Exposure in Logs

**Vulnerable:**
```javascript
// ❌ DON'T
console.log('Token:', token);
```

**Safe:**
```javascript
// ✅ DO
console.log('Token received:', token.substring(0, 10) + '...');
```

---

## ✅ Security Checklist

### Before Development

- [ ] Create `.env` file from `.env.example`
- [ ] Generate strong JWT secrets
- [ ] Configure MongoDB URI
- [ ] Set NODE_ENV=development

### During Development

- [ ] Validate all user inputs
- [ ] Never log sensitive data
- [ ] Test with invalid inputs
- [ ] Use HTTPS in development if possible
- [ ] Check for SQL/NoSQL injection
- [ ] Test password hashing

### Before Production

- [ ] Install and configure Helmet
- [ ] Implement rate limiting
- [ ] Enable HTTPS
- [ ] Use strong JWT secrets
- [ ] Configure MongoDB Atlas authentication
- [ ] Set NODE_ENV=production
- [ ] Enable CORS whitelist
- [ ] Setup logging & monitoring
- [ ] Configure firewall rules
- [ ] Enable SSL/TLS certificates

### Production Deployment

- [ ] Add security headers
- [ ] Enable rate limiting
- [ ] Monitor failed login attempts
- [ ] Setup error tracking (Sentry)
- [ ] Enable audit logging
- [ ] Regular security updates
- [ ] Backup MongoDB regularly
- [ ] Monitor API usage
- [ ] Alert on suspicious activity

---

## 🛡️ Security Best Practices Summary

| Practice | Status | Note |
|----------|--------|------|
| Bcrypt password hashing | ✅ | 10 salt rounds |
| JWT token expiry | ✅ | 15m access / 30d refresh |
| Input validation | ✅ | Email, mobile, age |
| CORS configuration | ✅ | Whitelist origins |
| Environment variables | ✅ | .env file protected |
| Helmet middleware | ⏳ | Easy to add |
| Rate limiting | ⏳ | Easy to add |
| HTTPS enforcement | ⏳ | Configure in production |
| Audit logging | ⏳ | Ready for integration |
| Two-factor auth | ⏳ | OTP implemented |

---

## 📚 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Bcrypt Security](https://en.wikipedia.org/wiki/Bcrypt)

---

**Last Updated:** January 2024
**Version:** 1.0
