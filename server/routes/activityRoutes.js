const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getNewListings,
  getPopularServices,
  getFeaturedBusinesses,
  addRecentlyViewed,
  getRecentlyViewed,
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
} = require("../controllers/activityController");

router.get("/new-listings", getNewListings);
router.get("/popular", getPopularServices);
router.get("/featured", getFeaturedBusinesses);

router.post("/recently-viewed", authMiddleware, addRecentlyViewed);
router.get("/recently-viewed", authMiddleware, getRecentlyViewed);

router.post("/search-history", authMiddleware, addSearchHistory);
router.get("/search-history", authMiddleware, getSearchHistory);
router.delete("/search-history", authMiddleware, clearSearchHistory);

module.exports = router;