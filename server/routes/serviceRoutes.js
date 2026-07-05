const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  getAllServices,
  getMyServices,
  createService,
  updateService,
  deleteService,
  toggleFeatured,
} = require("../controllers/serviceController");

router.get("/", getAllServices);
router.get("/mine", authMiddleware, getMyServices);
router.post("/", authMiddleware, upload.single("image"), createService);

router.patch("/:id/featured", authMiddleware, toggleFeatured);

router.put("/:id", authMiddleware, upload.single("image"), updateService);
router.delete("/:id", authMiddleware, deleteService);

module.exports = router;