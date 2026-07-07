const db = require("../db");
const createNotification = require("../utils/createNotification");

exports.getAllUsers = (req, res) => {
  const sql = `
    SELECT id, name, email, role, is_admin, created_at
    FROM users
    ORDER BY created_at DESC
  `;

  db.all(sql, [], (err, users) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get users" });
    }

    res.json(users);
  });
};

exports.getAllListings = (req, res) => {
  const sql = `
    SELECT
      services.*,
      users.name AS business_name,
      users.email AS business_email,
      COALESCE(AVG(reviews.rating), 0) AS average_rating,
      COUNT(reviews.id) AS review_count
    FROM services
    JOIN users ON services.user_id = users.id
    LEFT JOIN reviews ON reviews.service_id = services.id
    GROUP BY services.id
    ORDER BY services.created_at DESC
  `;

  db.all(sql, [], (err, listings) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get listings" });
    }

    res.json(listings);
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    db.run(`DELETE FROM services WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM favorites WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM recently_viewed WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM search_history WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM notifications WHERE user_id = ?`, [id]);
    db.run(`DELETE FROM reviews WHERE user_id = ?`, [id]);

    db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to delete user" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ message: "User deleted successfully" });
    });
  });
};

exports.deleteListing = (req, res) => {
  const { id } = req.params;

  db.serialize(() => {
    db.run(`DELETE FROM favorites WHERE service_id = ?`, [id]);
    db.run(`DELETE FROM recently_viewed WHERE service_id = ?`, [id]);
    db.run(`DELETE FROM notifications WHERE service_id = ?`, [id]);
    db.run(`DELETE FROM reviews WHERE service_id = ?`, [id]);

    db.run(`DELETE FROM services WHERE id = ?`, [id], function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to delete listing" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Listing not found" });
      }

      res.json({ message: "Listing deleted successfully" });
    });
  });
};

exports.toggleListingFeatured = (req, res) => {
  const { id } = req.params;
  const { is_featured } = req.body;

  db.run(
    `UPDATE services SET is_featured = ? WHERE id = ?`,
    [is_featured ? 1 : 0, id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to update listing" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Listing not found" });
      }

      db.get(
        `SELECT user_id, service_name FROM services WHERE id = ?`,
        [id],
        (err, service) => {
          if (!err && service) {
            createNotification({
              userId: service.user_id,
              serviceId: id,
              type: "featured",
              message: is_featured
                ? `Your listing "${service.service_name}" was featured.`
                : `Your listing "${service.service_name}" was unfeatured.`,
            });
          }

          return res.json({ message: "Listing updated successfully" });
        }
      );
    }
  );
};