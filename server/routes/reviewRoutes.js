const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getReviewsByService,
  addOrUpdateReview,
  deleteReview,
} = require("../controllers/reviewController");

router.get("/:serviceId", getReviewsByService);
router.post("/:serviceId", authMiddleware, addOrUpdateReview);
router.delete("/:serviceId", authMiddleware, deleteReview);

module.exports = router;