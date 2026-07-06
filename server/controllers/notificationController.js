const db = require("../db");

exports.getMyNotifications = (req, res) => {
  const sql = `
    SELECT notifications.*, services.service_name
    FROM notifications
    LEFT JOIN services ON notifications.service_id = services.id
    WHERE notifications.user_id = ?
    ORDER BY notifications.created_at DESC
    LIMIT 30
  `;

  db.all(sql, [req.user.id], (err, notifications) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get notifications" });
    }

    res.json(notifications);
  });
};

exports.markNotificationRead = (req, res) => {
  const { id } = req.params;

  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ? AND user_id = ?
  `;

  db.run(sql, [id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to mark notification read" });
    }

    res.json({ message: "Notification marked as read" });
  });
};

exports.markAllNotificationsRead = (req, res) => {
  const sql = `
    UPDATE notifications
    SET is_read = 1
    WHERE user_id = ?
  `;

  db.run(sql, [req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to mark all notifications read" });
    }

    res.json({ message: "All notifications marked as read" });
  });
};

exports.clearNotifications = (req, res) => {
  const sql = `
    DELETE FROM notifications
    WHERE user_id = ?
  `;

  db.run(sql, [req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to clear notifications" });
    }

    res.json({ message: "Notifications cleared" });
  });
};