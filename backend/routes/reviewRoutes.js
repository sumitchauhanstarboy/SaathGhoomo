const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, reviewController.addReview);
router.get("/:userId", reviewController.getReviews);

module.exports = router;
