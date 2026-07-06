const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} = require("../controllers/notificationController");

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markNotificationRead);
router.patch("/read-all", authMiddleware, markAllNotificationsRead);
router.delete("/", authMiddleware, clearNotifications);

module.exports = router;