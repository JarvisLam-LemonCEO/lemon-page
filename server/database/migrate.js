const db = require("../db");

const addColumn = (table, column, definition) => {
  db.all(`PRAGMA table_info(${table})`, [], (err, columns) => {
    if (err) {
      console.error(err.message);
      return;
    }

    const exists = columns.some((col) => col.name === column);

    if (!exists) {
      db.run(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`, (err) => {
        if (err) console.error(err.message);
        else console.log(`Added ${column} to ${table}`);
      });
    }
  });
};

db.serialize(() => {
  addColumn("users", "created_at", "DATETIME DEFAULT CURRENT_TIMESTAMP");
  addColumn("users", "is_admin", "INTEGER DEFAULT 0");

  addColumn("services", "image_url", "TEXT");
  addColumn("services", "is_featured", "INTEGER DEFAULT 0");
  addColumn("services", "view_count", "INTEGER DEFAULT 0");

  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_services_created_at
    ON services(created_at)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_services_view_count
    ON services(view_count)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_services_category
    ON services(category)
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_notifications_user_id
    ON notifications(user_id)
  `);

  console.log("Migration complete");
});

db.run(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    service_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, service_id)
  )
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_reviews_service_id
  ON reviews(service_id)
`);

db.run(`
  CREATE INDEX IF NOT EXISTS idx_reviews_user_id
  ON reviews(user_id)
`);