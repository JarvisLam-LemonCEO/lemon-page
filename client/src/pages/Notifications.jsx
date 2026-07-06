import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  clearNotifications,
} from "../api/notificationApi";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");

  const loadNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
    } catch {
      setMessage("Failed to load notifications");
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  const handleClear = async () => {
    if (!window.confirm("Clear all notifications?")) return;

    await clearNotifications();
    setNotifications([]);
  };

  return (
    <>
      <Navbar />

      <div className="notifications-page">
        <section className="notifications-card">
          <div className="notifications-header">
            <div>
              <h1>Notifications</h1>
              <p>Updates about your Lemon Page listings.</p>
            </div>

            <div className="notifications-actions">
              <button className="save-search-btn" onClick={handleMarkAllRead}>
                Mark All Read
              </button>

              <button className="clear-history-btn" onClick={handleClear}>
                Clear
              </button>
            </div>
          </div>

          {message && <p className="error">{message}</p>}

          <div className="notifications-list">
            {notifications.length === 0 && (
              <div className="empty-state">
                <h3>No notifications</h3>
                <p>You have no updates yet.</p>
              </div>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                className={`notification-item ${
                  item.is_read ? "read" : "unread"
                }`}
              >
                <div>
                  <strong>{item.message}</strong>
                  <p>{item.service_name || "Lemon Page"}</p>
                  <small>{new Date(item.created_at).toLocaleString()}</small>
                </div>

                {!item.is_read && (
                  <button
                    className="profile-btn"
                    onClick={() => handleMarkRead(item.id)}
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}

export default Notifications;