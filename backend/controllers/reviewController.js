const Review = require("../models/Review");
const Booking = require("../models/Booking");
const User = require("../models/User");

/**
 * Add a review for a booking
 * @route POST /api/reviews
 * @access Private
 */
exports.addReview = async (req, res) => {
  try {
    const reviewerId = req.userId;
    const { bookingId, rating, comment } = req.body;

    if (!bookingId || !rating) {
      return res.status(400).json({
        success: false,
        message: "Please provide bookingId and rating",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({
        success: false,
        message: "Can only review completed bookings",
      });
    }

    // Determine reviewee
    let revieweeId;
    if (booking.booker.toString() === reviewerId) {
      revieweeId = booking.partner;
    } else if (booking.partner.toString() === reviewerId) {
      revieweeId = booking.booker;
    } else {
      return res.status(403).json({
        success: false,
        message: "Not authorized to review this booking",
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ booking: bookingId, reviewer: reviewerId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this booking",
      });
    }

    const review = new Review({
      booking: bookingId,
      reviewer: reviewerId,
      reviewee: revieweeId,
      rating,
      comment,
    });

    await review.save();

    // Update User's average rating
    const stats = await Review.aggregate([
      { $match: { reviewee: revieweeId } },
      {
        $group: {
          _id: "$reviewee",
          avgRating: { $avg: "$rating" },
          nRating: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await User.findByIdAndUpdate(revieweeId, {
        rating: stats[0].avgRating,
        ratingCount: stats[0].nRating,
      });
    }

    res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding review",
      error: error.message,
    });
  }
};

/**
 * Get reviews for a user
 * @route GET /api/reviews/:userId
 * @access Public
 */
exports.getReviews = async (req, res) => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId })
      .populate("reviewer", "name profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching reviews",
      error: error.message,
    });
  }
};
