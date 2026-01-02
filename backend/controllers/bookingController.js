const Booking = require("../models/Booking");
const User = require("../models/User");
const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

/**
 * Create a new booking
 * @route POST /api/bookings
 * @access Private
 */
exports.createBooking = async (req, res) => {
  try {
    const bookerId = req.userId;
    const { partnerId, date, time, duration } = req.body;

    // Validation
    if (!partnerId || !date || !time || !duration) {
      return res.status(400).json({
        success: false,
        message: "Please provide partnerId, date, time, and duration",
      });
    }

    if (bookerId === partnerId) {
      return res.status(400).json({
        success: false,
        message: "You cannot book yourself",
      });
    }

    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({
        success: false,
        message: "Partner not found",
      });
    }

    // Prevent double booking
    // Check if partner has any "accepted" or "pending" bookings that overlap
    const existingBookings = await Booking.find({
      partner: partnerId,
      date: date,
      status: { $in: ["pending", "accepted"] },
    });

    const newStart = parseInt(time.split(":")[0]) * 60 + parseInt(time.split(":")[1]);
    const newEnd = newStart + duration * 60;

    for (const booking of existingBookings) {
      const existingStart = parseInt(booking.time.split(":")[0]) * 60 + parseInt(booking.time.split(":")[1]);
      const existingEnd = existingStart + booking.duration * 60;

      if (newStart < existingEnd && existingStart < newEnd) {
        return res.status(400).json({
          success: false,
          message: "Partner is already booked for this time slot",
        });
      }
    }

    // Calculate cost
    const totalCoins = partner.pricePerHour * duration;

    // Check booker's wallet balance
    const bookerWallet = await Wallet.findOne({ user: bookerId });
    if (!bookerWallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    if (bookerWallet.balance < totalCoins) {
      return res.status(400).json({
        success: false,
        message: "Insufficient coins",
      });
    }

    // Create booking
    const booking = new Booking({
      booker: bookerId,
      partner: partnerId,
      date,
      time,
      duration,
      totalCoins,
      status: "pending",
      paymentStatus: "pending", // Coins will be deducted upon acceptance or immediately?
      // Let's deduct immediately to reserve coins, and refund if cancelled.
    });

    await booking.save();

    // Deduct coins from booker
    bookerWallet.balance -= totalCoins;
    await bookerWallet.save();

    // Update User model coins as well for consistency (optional but good for redundancy if used elsewhere)
    await User.findByIdAndUpdate(bookerId, { $inc: { coins: -totalCoins } });

    // Log transaction
    await Transaction.create({
      wallet: bookerWallet._id,
      user: bookerId,
      amount: totalCoins,
      type: "debit",
      description: `Booking with ${partner.name}`,
      bookingId: booking._id,
    });

    res.status(201).json({
      success: true,
      message: "Booking request sent successfully",
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

/**
 * Get user bookings (as booker or partner)
 * @route GET /api/bookings
 * @access Private
 */
exports.getBookings = async (req, res) => {
  try {
    const userId = req.userId;
    const { role } = req.query; // "booker" or "partner"

    let query = {};
    if (role === "partner") {
      query = { partner: userId };
    } else if (role === "booker") {
      query = { booker: userId };
    } else {
      query = { $or: [{ booker: userId }, { partner: userId }] };
    }

    const bookings = await Booking.find(query)
      .populate("booker", "name email profileImage")
      .populate("partner", "name email profileImage")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

/**
 * Update booking status
 * @route PUT /api/bookings/:id/status
 * @access Private
 */
exports.updateBookingStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { status } = req.body;
    const bookingId = req.params.id;

    if (!["accepted", "rejected", "completed", "cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check permissions
    // Only partner can accept/reject
    // Booker can cancel (if pending)
    // Both can complete? Usually booker confirms completion or partner marks complete and booker verifies.
    // Let's keep it simple:
    // Partner: accepted, rejected, completed
    // Booker: cancelled

    if (status === "accepted" || status === "rejected") {
      if (booking.partner.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Only partner can accept or reject booking",
        });
      }
    }

    if (status === "cancelled") {
      if (booking.booker.toString() !== userId && booking.partner.toString() !== userId) {
        return res.status(403).json({
          success: false,
          message: "Not authorized to cancel this booking",
        });
      }
    }

    // Logic for refund/payment
    if (status === "rejected" || status === "cancelled") {
      // Refund coins to booker if they were deducted
      // Check if not already refunded
      if (booking.paymentStatus !== "refunded") {
         const bookerWallet = await Wallet.findOne({ user: booking.booker });
         if (bookerWallet) {
           bookerWallet.balance += booking.totalCoins;
           await bookerWallet.save();
           
           await User.findByIdAndUpdate(booking.booker, { $inc: { coins: booking.totalCoins } });

           await Transaction.create({
             wallet: bookerWallet._id,
             user: booking.booker,
             amount: booking.totalCoins,
             type: "credit",
             description: `Refund for booking ${booking._id}`,
             bookingId: booking._id,
           });
           
           booking.paymentStatus = "refunded";
         }
      }
    } else if (status === "completed") {
      // Transfer coins to partner (minus commission)
      // Platform commission 20%
      const commission = booking.totalCoins * 0.20;
      const partnerEarnings = booking.totalCoins - commission;

      const partnerWallet = await Wallet.findOne({ user: booking.partner });
      if (partnerWallet) {
        partnerWallet.balance += partnerEarnings;
        await partnerWallet.save();

        await User.findByIdAndUpdate(booking.partner, { $inc: { coins: partnerEarnings } });

        await Transaction.create({
          wallet: partnerWallet._id,
          user: booking.partner,
          amount: partnerEarnings,
          type: "credit",
          description: `Earnings from booking ${booking._id}`,
          bookingId: booking._id,
        });
        
        booking.paymentStatus = "paid";
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status}`,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error: error.message,
    });
  }
};
