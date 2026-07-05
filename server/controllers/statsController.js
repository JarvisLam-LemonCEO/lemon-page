const db = require("../db");

exports.getBusinessStats = (req, res) => {
  const userId = req.user.id;

  const sql = `
    SELECT
      COUNT(*) AS totalListings,
      COALESCE(SUM(view_count), 0) AS totalViews,
      COALESCE(SUM(is_featured), 0) AS featuredListings
    FROM services
    WHERE user_id = ?
  `;

  db.get(sql, [userId], (err, stats) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get stats" });
    }

    const favoriteSql = `
      SELECT COUNT(*) AS totalFavorites
      FROM favorites
      JOIN services ON favorites.service_id = services.id
      WHERE services.user_id = ?
    `;

    db.get(favoriteSql, [userId], (err, favStats) => {
      if (err) {
        return res.status(500).json({ message: "Failed to get favorites stats" });
      }

      res.json({
        totalListings: stats.totalListings,
        totalViews: stats.totalViews,
        featuredListings: stats.featuredListings,
        totalFavorites: favStats.totalFavorites,
      });
    });
  });
};