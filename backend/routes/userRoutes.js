/**
 * User Routes
 * Routes for user profile management
 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { verifyToken } = require("../middleware/auth");

/**
 * Protected Routes (require JWT authentication)
 */

// Get companions (Discovery API)
router.get("/companions", verifyToken, userController.getCompanions);

// Get current logged-in user's profile
router.get("/profile", verifyToken, userController.getProfile);

// Update current logged-in user's profile
router.put("/profile/update", verifyToken, userController.updateProfile);

// Update user interests
router.put("/interests", verifyToken, userController.updateInterests);

// Update profile image
router.put("/profile-image", verifyToken, userController.updateProfileImage);

/**
 * Public Routes
 */

// Get user profile by ID
router.get("/:userId", userController.getUserProfileById);

// Search users by name or city
router.get("/search", userController.searchUsers);

// Get user by email (can add admin middleware later)
router.get("/email/:email", userController.getUserByEmail);

module.exports = router;
