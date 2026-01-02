const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

/**
 * Get wallet balance
 * @route GET /api/wallet
 * @access Private
 */
exports.getWallet = async (req, res) => {
  try {
    const userId = req.userId;
    let wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      // Create wallet if not exists (fail-safe)
      wallet = new Wallet({ user: userId });
      await wallet.save();
    }

    res.status(200).json({
      success: true,
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching wallet",
      error: error.message,
    });
  }
};

/**
 * Get wallet transactions
 * @route GET /api/wallet/transactions
 * @access Private
 */
exports.getTransactions = async (req, res) => {
  try {
    const userId = req.userId;
    const wallet = await Wallet.findOne({ user: userId });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found",
      });
    }

    const transactions = await Transaction.find({ wallet: wallet._id })
      .sort({ createdAt: -1 })
      .populate("bookingId", "status date");

    res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching transactions",
      error: error.message,
    });
  }
};

/**
 * Add coins to wallet (Mock Payment)
 * @route POST /api/wallet/add-coins
 * @access Private
 */
exports.addCoins = async (req, res) => {
  try {
    const userId = req.userId;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid amount",
      });
    }

    let wallet = await Wallet.findOne({ user: userId });
    if (!wallet) {
      wallet = new Wallet({ user: userId });
    }

    wallet.balance += Number(amount);
    await wallet.save();

    // Update User model coins
    await User.findByIdAndUpdate(userId, { $inc: { coins: Number(amount) } });

    // Log transaction
    await Transaction.create({
      wallet: wallet._id,
      user: userId,
      amount: Number(amount),
      type: "credit",
      description: "Coins purchased",
    });

    res.status(200).json({
      success: true,
      message: "Coins added successfully",
      data: wallet,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding coins",
      error: error.message,
    });
  }
};
