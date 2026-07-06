const db = require("../db");

const adminMiddleware = (req, res, next) => {
  const sql = `
    SELECT id, is_admin
    FROM users
    WHERE id = ?
  `;

  db.get(sql, [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Admin check failed" });
    }

    if (!user || user.is_admin !== 1) {
      return res.status(403).json({ message: "Admin access only" });
    }

    next();
  });
};

module.exports = adminMiddleware;