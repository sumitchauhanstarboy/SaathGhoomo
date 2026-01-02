const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { verifyToken } = require("../middleware/auth");

router.post("/", verifyToken, bookingController.createBooking);
router.get("/", verifyToken, bookingController.getBookings);
router.put("/:id/status", verifyToken, bookingController.updateBookingStatus);

module.exports = router;
