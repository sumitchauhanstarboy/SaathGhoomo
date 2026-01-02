/**
 * OTP Controller
 * Handles OTP generation and verification for mobile login
 * 
 * NOTE: This is a simplified implementation
 * In production, integrate with Twilio, AWS SNS, or similar SMS service
 */

const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Store OTPs in memory (use Redis in production)
const otpStore = {};

/**
 * Generate a random 6-digit OTP
 */
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP to mobile number
 * @route POST /api/auth/send-otp
 * @access Public
 */
exports.sendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    // Validation
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Validate mobile format (basic 10-digit validation)
    const mobileRegex = /^[6-9]\d{9}$/; // India format
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid mobile number",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store OTP
    otpStore[mobile] = {
      otp,
      expiryTime,
      attempts: 0,
    };

    // TODO: Send OTP via SMS (integrate with Twilio/SMS service)
    // For now, log it to console (development only)
    console.log(`📱 OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your mobile number",
      // Remove in production - only for development
      devOTP: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending OTP",
      error: error.message,
    });
  }
};

/**
 * Verify OTP and auto-login user
 * @route POST /api/auth/verify-otp
 * @access Public
 */
exports.verifyOTP = async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    // Validation
    if (!mobile || !otp) {
      return res.status(400).json({
        success: false,
        message: "Mobile number and OTP are required",
      });
    }

    // Check if OTP exists
    if (!otpStore[mobile]) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or not sent",
      });
    }

    const storedOTP = otpStore[mobile];

    // Check OTP expiry
    if (Date.now() > storedOTP.expiryTime) {
      delete otpStore[mobile];
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP",
      });
    }

    // Check max attempts
    if (storedOTP.attempts >= 3) {
      delete otpStore[mobile];
      return res.status(400).json({
        success: false,
        message: "Maximum OTP verification attempts exceeded",
      });
    }

    // Verify OTP
    if (storedOTP.otp !== otp) {
      storedOTP.attempts++;
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // OTP verified successfully - Find or create user
    let user = await User.findOne({ mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with this mobile number. Please register first.",
      });
    }

    // Clear OTP from store
    delete otpStore[mobile];

    // Generate tokens
    const generateAccessToken = (userId) => {
      return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
      });
    };

    const generateRefreshToken = (userId) => {
      return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
      });
    };

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "OTP verified successfully. User logged in",
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};

/**
 * Resend OTP
 * @route POST /api/auth/resend-otp
 * @access Public
 */
exports.resendOTP = async (req, res) => {
  try {
    const { mobile } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Mobile number is required",
      });
    }

    // Check if OTP already exists and if cooldown period is active
    if (otpStore[mobile]) {
      const timeSinceSend = Date.now() - (otpStore[mobile].expiryTime - 5 * 60 * 1000);
      if (timeSinceSend < 30000) { // 30 seconds cooldown
        return res.status(400).json({
          success: false,
          message: "Please wait before requesting a new OTP",
        });
      }
    }

    // Generate new OTP
    const otp = generateOTP();
    const expiryTime = Date.now() + 5 * 60 * 1000; // 5 minutes

    otpStore[mobile] = {
      otp,
      expiryTime,
      attempts: 0,
    };

    // TODO: Send OTP via SMS
    console.log(`📱 Resent OTP for ${mobile}: ${otp}`);

    res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      devOTP: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error resending OTP",
      error: error.message,
    });
  }
};
