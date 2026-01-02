const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    // Authentication fields
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      minlength: 6,
      select: false,
    },
    
    // Basic profile fields
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    
    // Contact information
    mobile: {
      type: String,
      default: "",
      unique: true,
      sparse: true,
    },
    phoneNumber: {
      type: String,
      default: "",
    },
    
    // Profile information
    gender: {
      type: String,
      enum: ["Male", "Female", "Other", "Prefer not to say"],
      default: "Prefer not to say",
    },
    age: {
      type: Number,
      default: null,
      min: 18,
      max: 100,
    },
    city: {
      type: String,
      default: "",
    },
    location: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
      maxlength: 500,
    },
    
    // Interests array
    interests: {
      type: [String],
      default: [],
    },
    
    // Profile image
    profileImage: {
      type: String,
      default: null,
    },
    
    // Platform-specific fields
    isVerified: {
      type: Boolean,
      default: false,
    },
    coins: {
      type: Number,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    pricePerHour: {
      type: Number,
      default: 0,
    },
    availability: {
      type: [String], // e.g., ["Monday", "Tuesday", "Weekends"]
      default: [],
    },
    referralCode: {
      type: String,
      unique: true,
      sparse: true,
    },
    
    // OAuth fields
    googleId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "companion", "admin"],
      default: "user",
    },
    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },
    
    // Token management
    refreshTokens: [
      {
        token: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
          expires: 2592000, // 30 days
        },
      },
    ],
    
    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  // Only hash if password is modified and exists
  if (!this.isModified("password") || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to add refresh token
UserSchema.methods.addRefreshToken = function (token) {
  this.refreshTokens.push({ token });
  return this.save();
};

// Method to remove refresh token
UserSchema.methods.removeRefreshToken = function (token) {
  this.refreshTokens = this.refreshTokens.filter((t) => t.token !== token);
  return this.save();
};

// Method to get user profile (without sensitive data)
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
