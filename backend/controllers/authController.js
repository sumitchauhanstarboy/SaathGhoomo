const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

// Generate Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
  });
};

// Generate Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d",
  });
};

// Register Controller
exports.register = async (req, res) => {
  try {
    const { email, password, name, mobile, gender, age, city, interests, referralCode } = req.body;

    // Validation - Required fields
    if (!email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "Please provide email, password, and name",
      });
    }

    // Email validation
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    // Password validation - minimum 6 characters
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists with email
    const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
    if (existingEmailUser) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered",
      });
    }

    // Check if user already exists with mobile (if provided)
    if (mobile) {
      const existingMobileUser = await User.findOne({ mobile });
      if (existingMobileUser) {
        return res.status(400).json({
          success: false,
          message: "Mobile number is already registered",
        });
      }
    }

    // Generate unique referral code for new user
    const newReferralCode = crypto.randomBytes(4).toString("hex").toUpperCase();

    // Create new user
    const user = new User({
      email: email.toLowerCase(),
      password,
      name,
      mobile: mobile || "",
      gender: gender || "Prefer not to say",
      age: age || null,
      city: city || "",
      interests: interests || [],
      authProvider: "email",
      isVerified: false,
      coins: 0,
      rating: 0,
      referralCode: newReferralCode,
    });

    // Handle Referral Logic if referralCode provided
    let referrer = null;
    let referralBonus = 0;
    
    if (referralCode) {
      referrer = await User.findOne({ referralCode });
      if (referrer) {
        referralBonus = 50; // Example bonus amount
        user.coins = referralBonus; // New user gets coins
      }
    }

    // Save user (password will be hashed by pre-save middleware)
    await user.save();

    // Create Wallet for the user
    const wallet = new Wallet({
      user: user._id,
      balance: user.coins,
    });
    await wallet.save();

    // If referral happened, credit referrer and log transactions
    if (referrer) {
      // Credit referrer
      const referrerBonus = 50;
      referrer.coins += referrerBonus;
      await referrer.save();

      // Update referrer's wallet
      const referrerWallet = await Wallet.findOne({ user: referrer._id });
      if (referrerWallet) {
        referrerWallet.balance += referrerBonus;
        await referrerWallet.save();

        // Log transaction for referrer
        await Transaction.create({
          wallet: referrerWallet._id,
          user: referrer._id,
          amount: referrerBonus,
          type: "credit",
          description: `Referral bonus for referring ${user.name}`,
        });
      }

      // Log transaction for new user
      await Transaction.create({
        wallet: wallet._id,
        user: user._id,
        amount: referralBonus,
        type: "credit",
        description: `Referral bonus for using code ${referralCode}`,
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({
        success: false,
        message: `${field.charAt(0).toUpperCase() + field.slice(1)} is already in use`,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error during registration",
      error: error.message,
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    // Check user with password field
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare password
    const isPasswordMatch = await user.matchPassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: user.toJSON(),
        accessToken,
        refreshToken,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: error.message,
    });
  }
};

// Refresh Token Controller
exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token is required",
      });
    }

    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Find user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if refresh token exists in user's token list
    const tokenExists = user.refreshTokens.some((t) => t.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    // Generate new access token
    const newAccessToken = generateAccessToken(user._id);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: newAccessToken,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: error.message,
    });
  }
};

// Logout Controller
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const userId = req.userId; // from JWT middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (refreshToken) {
      await user.removeRefreshToken(refreshToken);
    } else {
      // Clear all refresh tokens
      user.refreshTokens = [];
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message,
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId; // from JWT middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

// Google OAuth Success Callback
exports.googleAuthSuccess = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Add refresh token to user
    await user.addRefreshToken(refreshToken);

    // Redirect back to client with tokens (use fragment to avoid exposing in referer)
    const clientUrl = process.env.CLIENT_URL || "http://localhost:8081";
    // Use fragment so tokens are not sent to server in Referer when navigating
    const redirectUrl = `${clientUrl}/#accessToken=${encodeURIComponent(accessToken)}&refreshToken=${encodeURIComponent(refreshToken)}`;

    return res.redirect(302, redirectUrl);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during Google authentication",
      error: error.message,
    });
  }
};

// Google Firebase ID token flow (client sends Firebase ID token in Authorization header)
exports.googleFirebase = async (req, res) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(400).json({ success: false, message: "No Firebase ID token provided" });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Server missing FIREBASE_API_KEY environment variable" });
    }

    // Verify the Firebase ID token by calling the Identity Toolkit accounts:lookup endpoint
    const lookupUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(apiKey)}`;
    const lookupRes = await fetch(lookupUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken: token }),
    });

    if (!lookupRes.ok) {
      const json = await lookupRes.json().catch(() => ({}));
      return res.status(401).json({ success: false, message: "Invalid Firebase ID token", error: json });
    }

    const lookupData = await lookupRes.json();
    const firebaseUser = lookupData.users && lookupData.users[0];
    if (!firebaseUser) {
      return res.status(401).json({ success: false, message: "Firebase user not found" });
    }

    // firebaseUser contains fields like localId (uid), email, displayName, photoUrl
    const firebaseUid = firebaseUser.localId;
    const email = firebaseUser.email;
    const name = firebaseUser.displayName || "";
    const profileImage = firebaseUser.photoUrl || null;

    // Find or create user in our DB
    let user = await User.findOne({ googleId: firebaseUid });
    if (!user) {
      user = await User.findOne({ email });
      if (!user) {
        user = new User({
          googleId: firebaseUid,
          email,
          name,
          profileImage,
          authProvider: "google",
          isVerified: true,
        });
        await user.save();
      } else {
        user.googleId = firebaseUid;
        user.authProvider = "google";
        user.isVerified = true;
        if (!user.profileImage && profileImage) user.profileImage = profileImage;
        await user.save();
      }
    }

    // Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    await user.addRefreshToken(refreshToken);

    return res.status(200).json({
      success: true,
      message: "Google authentication successful",
      data: { user: user.toJSON(), accessToken, refreshToken },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error processing Firebase token", error: error.message });
  }
};
