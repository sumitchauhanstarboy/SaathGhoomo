const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/authController");
const otpController = require("../controllers/otpController");
const authMiddleware = require("../middleware/auth");

/**
 * Email/Password Authentication Routes
 */

// Public routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

/**
 * Mobile OTP Authentication Routes
 */
router.post("/send-otp", otpController.sendOTP);
router.post("/verify-otp", otpController.verifyOTP);
router.post("/resend-otp", otpController.resendOTP);

/**
 * Protected Routes (require JWT authentication)
 */
router.post("/logout", authMiddleware.verifyToken, authController.logout);
router.get("/me", authMiddleware.verifyToken, authController.getCurrentUser);

/**
 * Google OAuth Routes
 * Support two modes:
 * 1) Server-side redirect flow: GET /google -> passport redirect
 * 2) Client-side Firebase flow: POST /google -> backend verifies Firebase ID token and returns JWTs
 */
router.post("/google", authController.googleFirebase);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  authController.googleAuthSuccess
);

module.exports = router;
