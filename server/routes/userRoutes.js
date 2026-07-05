const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getProfile,
  deleteAccount,
} = require("../controllers/userController");

router.get("/profile", authMiddleware, getProfile);
router.delete("/delete", authMiddleware, deleteAccount);

module.exports = router;