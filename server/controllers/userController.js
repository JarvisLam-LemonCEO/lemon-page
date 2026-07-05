const db = require("../db");

exports.getProfile = (req, res) => {
  const sql = `
    SELECT id, name, email, role
    FROM users
    WHERE id = ?
  `;

  db.get(sql, [req.user.id], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get profile" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  });
};

exports.deleteAccount = (req, res) => {
  console.log("Deleting user:", req.user.id);

  db.serialize(() => {
    db.run("DELETE FROM services WHERE user_id = ?", [req.user.id], (err) => {
      if (err) {
        console.error("Delete services error:", err);
        return res.status(500).json({
          message: "Failed to delete services",
          error: err.message,
        });
      }

      db.run("DELETE FROM users WHERE id = ?", [req.user.id], function (err) {
        if (err) {
          console.error("Delete user error:", err);
          return res.status(500).json({
            message: "Failed to delete account",
            error: err.message,
          });
        }

        console.log("Rows deleted:", this.changes);

        if (this.changes === 0) {
          return res.status(404).json({
            message: "User not found",
          });
        }

        res.json({
          message: "Account deleted successfully",
        });
      });
    });
  });
};