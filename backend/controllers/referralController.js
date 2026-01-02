const User = require("../models/User");
const Transaction = require("../models/Transaction");

/**
 * Get referral info (code and history)
 * @route GET /api/referral
 * @access Private
 */
exports.getReferralInfo = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Find users referred by this user (if we stored referrer info in User model)
    // Currently we rely on Transaction history or we can add `referrer` field to User model for reverse lookup.
    // The current implementation in authController uses Transaction to log referral bonus.
    // So we can search Transactions with description containing "Referral bonus".
    // Or better, let's look at authController again. I didn't save referrer in User model explicitly except via transaction.
    // Wait, I should have added `referrer` to User model to track who referred whom easily.
    // But `Transaction` has `description: Referral bonus for referring ${user.name}`.
    
    // Let's rely on Transactions for history for now to avoid schema migration issues if any,
    // although I can add `referrer` to User schema easily.
    // Let's search transactions where type is 'credit' and description starts with 'Referral bonus'.
    
    const referralTransactions = await Transaction.find({
      user: userId,
      type: "credit",
      description: { $regex: "Referral bonus", $options: "i" },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: {
        referralCode: user.referralCode,
        history: referralTransactions,
        totalEarned: referralTransactions.reduce((acc, curr) => acc + curr.amount, 0),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching referral info",
      error: error.message,
    });
  }
};
