const db = require("../db");

exports.getReviewsByService = (req, res) => {
  const { serviceId } = req.params;

  const sql = `
    SELECT reviews.*, users.name AS reviewer_name
    FROM reviews
    JOIN users ON reviews.user_id = users.id
    WHERE reviews.service_id = ?
    ORDER BY reviews.created_at DESC
  `;

  db.all(sql, [serviceId], (err, reviews) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get reviews" });
    }

    res.json(reviews);
  });
};

exports.addOrUpdateReview = (req, res) => {
  const { serviceId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Rating must be between 1 and 5" });
  }

  const sql = `
    INSERT INTO reviews (user_id, service_id, rating, comment)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(user_id, service_id)
    DO UPDATE SET
      rating = excluded.rating,
      comment = excluded.comment,
      created_at = CURRENT_TIMESTAMP
  `;

  db.run(sql, [req.user.id, serviceId, rating, comment], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to save review" });
    }

    res.json({ message: "Review saved successfully" });
  });
};

exports.deleteReview = (req, res) => {
  const { serviceId } = req.params;

  const sql = `
    DELETE FROM reviews
    WHERE user_id = ? AND service_id = ?
  `;

  db.run(sql, [req.user.id, serviceId], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete review" });
    }

    res.json({ message: "Review deleted successfully" });
  });
};