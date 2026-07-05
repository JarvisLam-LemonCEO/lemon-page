const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getBusinessStats } = require("../controllers/statsController");

router.get("/business", authMiddleware, getBusinessStats);

module.exports = router;