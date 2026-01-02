/**
 * User Controller
 * Handles user profile management operations
 */

const User = require("../models/User");

/**
 * Get user profile by user ID
 * @route GET /api/users/profile
 * @access Private (requires JWT token)
 */
exports.getProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
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
      message: "User profile retrieved successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

/**
 * Get user profile by username or ID (public endpoint)
 * @route GET /api/users/:userId
 * @access Public
 */
exports.getUserProfileById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile retrieved successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: error.message,
    });
  }
};

/**
 * Update user profile
 * @route PUT /api/users/profile/update
 * @access Private (requires JWT token)
 * @param {Object} req.body - Updated profile fields
 */
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    const { name, gender, age, city, interests, profileImage, bio, mobile } = req.body;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Update allowed fields only
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }
      user.name = name.trim();
    }

    if (gender !== undefined) {
      const validGenders = ["Male", "Female", "Other", "Prefer not to say"];
      if (gender && !validGenders.includes(gender)) {
        return res.status(400).json({
          success: false,
          message: "Invalid gender value",
        });
      }
      user.gender = gender;
    }

    if (age !== undefined) {
      if (age !== null) {
        if (age < 18 || age > 100) {
          return res.status(400).json({
            success: false,
            message: "Age must be between 18 and 100",
          });
        }
      }
      user.age = age;
    }

    if (city !== undefined) {
      user.city = city || "";
    }

    if (interests !== undefined) {
      if (Array.isArray(interests)) {
        user.interests = interests;
      } else {
        return res.status(400).json({
          success: false,
          message: "Interests must be an array",
        });
      }
    }

    if (profileImage !== undefined) {
      user.profileImage = profileImage || null;
    }

    if (bio !== undefined) {
      if (bio && bio.length > 500) {
        return res.status(400).json({
          success: false,
          message: "Bio must be less than 500 characters",
        });
      }
      user.bio = bio || "";
    }

    if (mobile !== undefined) {
      // Check if mobile is unique (if it's being changed)
      if (mobile && mobile !== user.mobile) {
        const existingMobile = await User.findOne({ mobile, _id: { $ne: userId } });
        if (existingMobile) {
          return res.status(400).json({
            success: false,
            message: "Mobile number is already in use",
          });
        }
      }
      user.mobile = mobile || "";
    }

    if (req.body.pricePerHour !== undefined) {
      const price = Number(req.body.pricePerHour);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          success: false,
          message: "Price per hour must be a valid positive number",
        });
      }
      user.pricePerHour = price;
    }

    if (req.body.availability !== undefined) {
      if (Array.isArray(req.body.availability)) {
        user.availability = req.body.availability;
      } else {
        return res.status(400).json({
          success: false,
          message: "Availability must be an array",
        });
      }
    }

    // Update the updatedAt timestamp
    user.updatedAt = new Date();

    // Save user
    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: {
        user: user.toJSON(),
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
      message: "Error updating user profile",
      error: error.message,
    });
  }
};

/**
 * Get companions (Discovery API)
 * @route GET /api/users/companions
 * @access Private
 */
exports.getCompanions = async (req, res) => {
  try {
    const userId = req.userId;
    const { city, gender, minPrice, maxPrice, minRating, interests } = req.query;

    const query = {
      _id: { $ne: userId }, // Exclude current user
      // Optionally filter for users who have set a price (partners)
      // pricePerHour: { $gt: 0 } 
    };

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.pricePerHour = {};
      if (minPrice) query.pricePerHour.$gte = Number(minPrice);
      if (maxPrice) query.pricePerHour.$lte = Number(maxPrice);
    }

    if (minRating) {
      query.rating = { $gte: Number(minRating) };
    }

    if (interests) {
      const interestList = interests.split(",").map((i) => i.trim());
      query.interests = { $in: interestList };
    }

    const companions = await User.find(query)
      .select("-password -refreshTokens -__v")
      .limit(50);

    res.status(200).json({
      success: true,
      count: companions.length,
      data: companions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching companions",
      error: error.message,
    });
  }
};

/**
 * Update user interests
 * @route PUT /api/users/interests
 * @access Private (requires JWT token)
 */
exports.updateInterests = async (req, res) => {
  try {
    const userId = req.userId;
    const { interests } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    if (!Array.isArray(interests)) {
      return res.status(400).json({
        success: false,
        message: "Interests must be an array",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { interests, updatedAt: new Date() },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interests updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating interests",
      error: error.message,
    });
  }
};

/**
 * Upload or update profile image
 * @route PUT /api/users/profile-image
 * @access Private (requires JWT token)
 */
exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.userId;
    const { profileImage } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No user ID found",
      });
    }

    if (!profileImage) {
      return res.status(400).json({
        success: false,
        message: "Profile image URL is required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage, updatedAt: new Date() },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      data: {
        user: user.toJSON(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating profile image",
      error: error.message,
    });
  }
};

/**
 * Get user by email (admin only)
 * @route GET /api/users/email/:email
 * @access Admin
 */
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;

    const user = await User.findOne({ email: email.toLowerCase() });

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

/**
 * Search users by name or city
 * @route GET /api/users/search?q=name&city=city
 * @access Public
 */
exports.searchUsers = async (req, res) => {
  try {
    const { q, city, limit = 10 } = req.query;

    let query = {};

    if (q) {
      query.name = { $regex: q, $options: "i" };
    }

    if (city) {
      query.city = { $regex: city, $options: "i" };
    }

    const users = await User.find(query).limit(parseInt(limit)).select("-password");

    res.status(200).json({
      success: true,
      count: users.length,
      data: {
        users: users.map((user) => user.toJSON()),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching users",
      error: error.message,
    });
  }
};
