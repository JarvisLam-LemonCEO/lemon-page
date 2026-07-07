const db = require("../db");
const createNotification = require("../utils/createNotification");

exports.getFavorites = (req, res) => {
  const sql = `
    SELECT
      services.*,
      users.name AS business_name,
      COALESCE(AVG(reviews.rating), 0) AS average_rating,
      COUNT(reviews.id) AS review_count
    FROM favorites
    JOIN services ON favorites.service_id = services.id
    JOIN users ON services.user_id = users.id
    LEFT JOIN reviews ON reviews.service_id = services.id
    WHERE favorites.user_id = ?
    GROUP BY services.id
    ORDER BY favorites.created_at DESC
  `;

  db.all(sql, [req.user.id], (err, favorites) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get favorites" });
    }

    res.json(favorites);
  });
};

exports.addFavorite = (req, res) => {
  const { serviceId } = req.body;

  const sql = `
    INSERT OR IGNORE INTO favorites (user_id, service_id)
    VALUES (?, ?)
  `;

  db.run(sql, [req.user.id, serviceId], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to save service" });
    }

    db.get(
      `SELECT user_id, service_name FROM services WHERE id = ?`,
      [serviceId],
      (err, service) => {
        if (!err && service && service.user_id !== req.user.id) {
          createNotification({
            userId: service.user_id,
            serviceId,
            type: "favorite",
            message: `Someone saved your listing "${service.service_name}".`,
          });
        }

        return res.json({ message: "Service saved successfully" });
      }
    );
  });
};

exports.removeFavorite = (req, res) => {
  const { serviceId } = req.params;

  const sql = `
    DELETE FROM favorites
    WHERE user_id = ? AND service_id = ?
  `;

  db.run(sql, [req.user.id, serviceId], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to remove favorite" });
    }

    res.json({ message: "Favorite removed successfully" });
  });
};