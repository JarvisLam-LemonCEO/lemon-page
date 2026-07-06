const db = require("../db");

const createNotification = ({ userId, serviceId, type, message }) => {
  const sql = `
    INSERT INTO notifications (
      user_id,
      service_id,
      type,
      message
    )
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [userId, serviceId, type, message], (err) => {
    if (err) {
      console.error("NOTIFICATION ERROR:", err.message);
    }
  });
};

module.exports = createNotification;