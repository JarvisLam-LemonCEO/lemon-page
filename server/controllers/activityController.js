const db = require("../db");
const createNotification = require("../utils/createNotification");

exports.getNewListings = (req, res) => {
  const sql = `
    SELECT services.*, users.name AS business_name
    FROM services
    JOIN users ON services.user_id = users.id
    ORDER BY services.created_at DESC
    LIMIT 12
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to get new listings" });
    res.json(rows);
  });
};

exports.getPopularServices = (req, res) => {
  const sql = `
    SELECT services.*, users.name AS business_name
    FROM services
    JOIN users ON services.user_id = users.id
    ORDER BY services.view_count DESC, services.created_at DESC
    LIMIT 12
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to get popular services" });
    res.json(rows);
  });
};

exports.getFeaturedBusinesses = (req, res) => {
  const sql = `
    SELECT services.*, users.name AS business_name
    FROM services
    JOIN users ON services.user_id = users.id
    WHERE services.is_featured = 1
    ORDER BY services.created_at DESC
    LIMIT 12
  `;

  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to get featured businesses" });
    res.json(rows);
  });
};

exports.addRecentlyViewed = (req, res) => {
  const { serviceId } = req.body;

  db.run(
    `
    INSERT INTO recently_viewed (user_id, service_id, viewed_at)
    VALUES (?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(user_id, service_id)
    DO UPDATE SET viewed_at = CURRENT_TIMESTAMP
    `,
    [req.user.id, serviceId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to add recently viewed" });
    }
  );

  db.run(
    `UPDATE services SET view_count = view_count + 1 WHERE id = ?`,
    [serviceId],
    (err) => {
      if (err) return res.status(500).json({ message: "Failed to update view count" });
      res.json({ message: "Recently viewed saved" });
    }
  );

  db.get(
  `SELECT user_id, service_name FROM services WHERE id = ?`,
  [serviceId],
  (err, service) => {
    if (!err && service && service.user_id !== req.user.id) {
      createNotification({
        userId: service.user_id,
        serviceId,
        type: "view",
        message: `Your listing "${service.service_name}" was viewed.`,
      });
    }

    res.json({ message: "Recently viewed saved" });
  }
);
};

exports.getRecentlyViewed = (req, res) => {
  const sql = `
    SELECT services.*, users.name AS business_name, recently_viewed.viewed_at
    FROM recently_viewed
    JOIN services ON recently_viewed.service_id = services.id
    JOIN users ON services.user_id = users.id
    WHERE recently_viewed.user_id = ?
    ORDER BY recently_viewed.viewed_at DESC
    LIMIT 12
  `;

  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to get recently viewed" });
    res.json(rows);
  });
};

exports.addSearchHistory = (req, res) => {
  const { search_text, category, zip_code, state, country } = req.body;

  const sql = `
    INSERT INTO search_history (
      user_id, search_text, category, zip_code, state, country
    )
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [req.user.id, search_text, category, zip_code, state, country], (err) => {
    if (err) return res.status(500).json({ message: "Failed to save search history" });
    res.json({ message: "Search history saved" });
  });
};

exports.getSearchHistory = (req, res) => {
  const sql = `
    SELECT *
    FROM search_history
    WHERE user_id = ?
    ORDER BY searched_at DESC
    LIMIT 20
  `;

  db.all(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ message: "Failed to get search history" });
    res.json(rows);
  });
};

exports.clearSearchHistory = (req, res) => {
  const sql = `
    DELETE FROM search_history
    WHERE user_id = ?
  `;

  db.run(sql, [req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to clear search history" });
    }

    res.json({ message: "Search history cleared" });
  });
};