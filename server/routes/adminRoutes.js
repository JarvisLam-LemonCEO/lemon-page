const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllUsers,
  getAllListings,
  deleteUser,
  deleteListing,
  toggleListingFeatured,
} = require("../controllers/adminController");

router.use(authMiddleware);
router.use(adminMiddleware);

router.get("/users", getAllUsers);
router.get("/listings", getAllListings);

router.delete("/users/:id", deleteUser);
router.delete("/listings/:id", deleteListing);

router.patch("/listings/:id/featured", toggleListingFeatured);

module.exports = router;