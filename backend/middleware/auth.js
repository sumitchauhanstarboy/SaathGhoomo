const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

// JWT Middleware - Verify Access Token
exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "No token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      error: error.message,
    });
  }
};

// Optional JWT Middleware - Don't fail if no token
exports.optionalVerifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    next();
  }
};

// Passport JWT Strategy
passport.use(
  "jwt",
  new LocalStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload.userId);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// // Passport Google OAuth Strategy
// if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
//   passport.use(
//     new GoogleStrategy(
//       {
//         clientID: process.env.GOOGLE_CLIENT_ID,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//         callbackURL: "/api/auth/google/callback",
//       },
//       async (accessToken, refreshToken, profile, done) => {
//         try {
//         // Check if user exists
//         let user = await User.findOne({ googleId: profile.id });

//         if (!user) {
//           // Check if email exists
//           user = await User.findOne({ email: profile.emails[0].value });

//           if (!user) {
//             // Create new user
//             user = new User({
//               googleId: profile.id,
//               email: profile.emails[0].value,
//               name: profile.displayName,
//               profileImage: profile.photos[0]?.value || null,
//               authProvider: "google",
//               isVerified: true,
//             });
//             await user.save();
//           } else {
//             // Link Google account to existing email
//             user.googleId = profile.id;
//             user.authProvider = "google";
//             user.isVerified = true;
//             if (!user.profileImage && profile.photos[0]?.value) {
//               user.profileImage = profile.photos[0].value;
//             }
//             await user.save();
//           }
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );
// } 

// Passport serialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
