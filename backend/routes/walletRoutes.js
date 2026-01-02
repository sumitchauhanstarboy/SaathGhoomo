const express = require("express");
const router = express.Router();
const walletController = require("../controllers/walletController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, walletController.getWallet);
router.get("/transactions", verifyToken, walletController.getTransactions);
router.post("/add-coins", verifyToken, walletController.addCoins);

module.exports = router;
