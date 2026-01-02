# 🧪 Saath Ghoomo - API Testing Guide

## 📋 Table of Contents
1. [Testing Tools](#testing-tools)
2. [API Testing Workflow](#api-testing-workflow)
3. [cURL Commands](#curl-commands)
4. [Postman Collection](#postman-collection)
5. [Sample Test Data](#sample-test-data)
6. [Test Scenarios](#test-scenarios)
7. [Common Issues](#common-issues)

---

## 🛠️ Testing Tools

### 1. **cURL** (Command Line)
- Built-in on most systems
- Quick testing
- No GUI needed
- Perfect for scripting

### 2. **Postman** (GUI)
- [Download Postman](https://www.postman.com/downloads/)
- Visual interface
- Save collections
- Environment management
- Mock servers

### 3. **Thunder Client** (VS Code)
- VS Code extension
- Lightweight
- Similar to Postman
- Built-in VS Code

### 4. **Insomnia** (Alternative)
- [Download Insomnia](https://insomnia.rest/)
- Open source
- Similar to Postman
- Good alternative

---

## 🔄 API Testing Workflow

### Step 1: Start Server
```bash
cd backend
npm run dev
```
Expected: Server running on `http://localhost:8081`

### Step 2: Register User
Use `/api/auth/register` endpoint

### Step 3: Login User
Use `/api/auth/login` endpoint and save `accessToken`

### Step 4: Test Protected Routes
Use `/api/users/profile` with `accessToken`

### Step 5: Update Profile
Use `/api/users/profile/update` endpoint

---

## 📝 cURL Commands

### 1. Register User
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "mobile": "9876543210",
    "gender": "Male",
    "age": 28,
    "city": "Mumbai",
    "interests": ["travel", "photography"]
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ... },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

---

### 2. Login User
```bash
curl -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Save Response:**
```bash
# Save token to variable (Linux/Mac)
TOKEN=$(curl -s -X POST http://localhost:8081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}' \
  | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)

echo "Token: $TOKEN"
```

---

### 3. Get Current User Profile
```bash
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
```

---

### 4. Update User Profile
```bash
curl -X PUT http://localhost:8081/api/users/profile/update \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "age": 29,
    "city": "Bangalore",
    "interests": ["travel", "photography", "hiking"],
    "bio": "Travel enthusiast and photographer"
  }'
```

---

### 5. Get User by ID (Public)
```bash
curl -X GET http://localhost:8081/api/users/507f1f77bcf86cd799439011
```

---

### 6. Search Users
```bash
curl -X GET "http://localhost:8081/api/users/search?q=John&city=Mumbai&limit=5"
```

---

### 7. Send OTP
```bash
curl -X POST http://localhost:8081/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210"
  }'
```

---

### 8. Verify OTP
```bash
curl -X POST http://localhost:8081/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "mobile": "9876543210",
    "otp": "123456"
  }'
```

---

### 9. Refresh Token
```bash
curl -X POST http://localhost:8081/api/auth/refresh-token \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

### 10. Logout
```bash
curl -X POST http://localhost:8081/api/auth/logout \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN_HERE"
  }'
```

---

## 📮 Postman Collection

### Import Collection

1. Open Postman
2. Click **Import**
3. Select **Paste Raw Text**
4. Paste JSON below
5. Click **Import**

### Postman Collection JSON

```json
{
  "info": {
    "name": "Saath Ghoomo API",
    "version": "1.0.0"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\",\n  \"name\": \"John Doe\",\n  \"mobile\": \"9876543210\",\n  \"gender\": \"Male\",\n  \"age\": 28,\n  \"city\": \"Mumbai\",\n  \"interests\": [\"travel\", \"photography\"]\n}"
            },
            "url": {
              "raw": "http://localhost:8081/api/auth/register",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"user@example.com\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "http://localhost:8081/api/auth/login",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "auth", "login"]
            }
          }
        },
        {
          "name": "Get Current User",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "http://localhost:8081/api/auth/me",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "auth", "me"]
            }
          }
        }
      ]
    },
    {
      "name": "User Profile",
      "item": [
        {
          "name": "Get Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "http://localhost:8081/api/users/profile",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "users", "profile"]
            }
          }
        },
        {
          "name": "Update Profile",
          "request": {
            "method": "PUT",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"John Updated\",\n  \"age\": 29,\n  \"city\": \"Bangalore\",\n  \"interests\": [\"travel\", \"photography\", \"hiking\"],\n  \"bio\": \"Travel enthusiast\"\n}"
            },
            "url": {
              "raw": "http://localhost:8081/api/users/profile/update",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "users", "profile", "update"]
            }
          }
        },
        {
          "name": "Search Users",
          "request": {
            "method": "GET",
            "url": {
              "raw": "http://localhost:8081/api/users/search?q=John&city=Mumbai&limit=5",
              "protocol": "http",
              "host": ["localhost"],
              "port": "8081",
              "path": ["api", "users", "search"],
              "query": [
                {
                  "key": "q",
                  "value": "John"
                },
                {
                  "key": "city",
                  "value": "Mumbai"
                },
                {
                  "key": "limit",
                  "value": "5"
                }
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    },
    {
      "key": "baseUrl",
      "value": "http://localhost:8081",
      "type": "string"
    }
  ]
}
```

### Use Collection Variables

1. After login, copy `accessToken`
2. In Postman, click **Environment** in top-right
3. Select **Manage Environments**
4. Add variable `accessToken` with token value
5. Use `{{accessToken}}` in headers

---

## 📊 Sample Test Data

### User 1 - John Doe
```json
{
  "email": "john.doe@example.com",
  "password": "password123",
  "name": "John Doe",
  "mobile": "9876543210",
  "gender": "Male",
  "age": 28,
  "city": "Mumbai",
  "interests": ["travel", "photography", "hiking"]
}
```

### User 2 - Jane Smith
```json
{
  "email": "jane.smith@example.com",
  "password": "securepass456",
  "name": "Jane Smith",
  "mobile": "9123456789",
  "gender": "Female",
  "age": 26,
  "city": "Bangalore",
  "interests": ["cooking", "yoga", "music"]
}
```

### User 3 - Alex Kumar
```json
{
  "email": "alex.kumar@example.com",
  "password": "mypassword789",
  "name": "Alex Kumar",
  "mobile": "9988776655",
  "gender": "Other",
  "age": 32,
  "city": "Delhi",
  "interests": ["gaming", "tech", "movies"]
}
```

---

## ✔️ Test Scenarios

### Scenario 1: Complete User Flow

1. **Register User**
   - Endpoint: `POST /api/auth/register`
   - Status: 201
   - Check: User created, tokens returned

2. **Login User**
   - Endpoint: `POST /api/auth/login`
   - Status: 200
   - Check: Tokens match registration

3. **Get Profile**
   - Endpoint: `GET /api/users/profile`
   - Status: 200
   - Header: `Authorization: Bearer <token>`
   - Check: All user data present

4. **Update Profile**
   - Endpoint: `PUT /api/users/profile/update`
   - Status: 200
   - Check: Fields updated correctly

5. **Logout**
   - Endpoint: `POST /api/auth/logout`
   - Status: 200
   - Check: Token invalidated

---

### Scenario 2: Validation Tests

**Test:** Register with invalid email
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email",
    "password": "password123",
    "name": "Test User"
  }'
```
Expected: 400 - Invalid email

**Test:** Register with short password
```bash
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "123",
    "name": "Test User"
  }'
```
Expected: 400 - Password too short

**Test:** Register with duplicate email
```bash
# First registration
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test"}'

# Second registration with same email
curl -X POST http://localhost:8081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password456","name":"Test2"}'
```
Expected: 400 - Email already registered

---

### Scenario 3: Authentication Tests

**Test:** Access protected route without token
```bash
curl -X GET http://localhost:8081/api/users/profile
```
Expected: 401 - No token provided

**Test:** Access protected route with invalid token
```bash
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer invalid_token_xyz"
```
Expected: 401 - Invalid token

**Test:** Access protected route with expired token
```bash
# Wait for token to expire or use old refresh token
curl -X GET http://localhost:8081/api/users/profile \
  -H "Authorization: Bearer expired_token"
```
Expected: 401 - Token expired

---

### Scenario 4: Data Validation Tests

**Test:** Update profile with invalid age
```bash
curl -X PUT http://localhost:8081/api/users/profile/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"age": 15}'
```
Expected: 400 - Age must be 18+

**Test:** Update profile with invalid gender
```bash
curl -X PUT http://localhost:8081/api/users/profile/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"gender": "Unknown"}'
```
Expected: 400 - Invalid gender

**Test:** Update profile with non-array interests
```bash
curl -X PUT http://localhost:8081/api/users/profile/update \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"interests": "travel"}'
```
Expected: 400 - Interests must be array

---

## 🐛 Common Issues

### Issue 1: CORS Error

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
1. Check `CLIENT_URL` in `.env`
2. Ensure frontend URL is in CORS whitelist
3. Restart server after .env changes

```env
CLIENT_URL=http://localhost:5173
```

---

### Issue 2: MongoDB Connection Failed

**Error:** `MongoDB connection error`

**Solution:**
1. Check MongoDB is running
   ```bash
   mongod
   ```
2. Verify `MONGODB_URI` in `.env`
   ```env
   MONGODB_URI=mongodb://localhost:27017/saathghoomo
   ```
3. Check database name is correct

---

### Issue 3: Token Invalid

**Error:** `Invalid or expired token`

**Solutions:**
1. Ensure token format is correct: `Bearer <token>`
2. Check token hasn't expired (15 minutes)
3. Use refresh token to get new access token
4. Re-login to get new tokens

---

### Issue 4: Duplicate Key Error

**Error:** `Email/Mobile already in use`

**Solution:**
1. Use unique email/mobile for each test
2. Add timestamp: `user+${Date.now()}@example.com`
3. Delete users from MongoDB:
   ```bash
   use saathghoomo
   db.users.deleteMany({})
   ```

---

### Issue 5: Port Already in Use

**Error:** `Port 8081 already in use`

**Solutions:**
1. Kill existing process:
   ```bash
   lsof -ti:8081 | xargs kill -9  # Mac/Linux
   netstat -ano | findstr :8081   # Windows
   ```
2. Use different port in `.env`:
   ```env
   PORT=8082
   ```

---

## 📈 Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
# Mac: brew install httpd
# Linux: sudo apt-get install apache2-utils

# Test 100 requests with 10 concurrent
ab -n 100 -c 10 http://localhost:8081/health
```

### Rate Limiting Test
```bash
# Send 20 login requests rapidly
for i in {1..20}; do
  curl -X POST http://localhost:8081/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' &
done
```

---

## 📋 Test Checklist

- [ ] Server starts without errors
- [ ] Can register user with valid data
- [ ] Cannot register with invalid email
- [ ] Cannot register with duplicate email
- [ ] Can login with correct credentials
- [ ] Cannot login with wrong password
- [ ] Can get profile with valid token
- [ ] Cannot get profile without token
- [ ] Can update profile fields
- [ ] Cannot update with invalid data
- [ ] Can search users
- [ ] Can send OTP
- [ ] Can verify OTP and login
- [ ] Can logout successfully
- [ ] Can refresh token
- [ ] CORS allows frontend domain

---

**Happy Testing! 🎉**
