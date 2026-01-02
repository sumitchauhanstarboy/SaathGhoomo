const express = require("express");
const router = express.Router();
const referralController = require("../controllers/referralController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, referralController.getReferralInfo);

module.exports = router;
