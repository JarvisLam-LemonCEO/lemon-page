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

  addColumn("services", "image_url", "TEXT");
  addColumn("services", "is_featured", "INTEGER DEFAULT 0");
  addColumn("services", "view_count", "INTEGER DEFAULT 0");

  db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, service_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS saved_services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      note TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, service_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS recently_viewed (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      service_id INTEGER NOT NULL,
      viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, service_id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS search_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      search_text TEXT,
      category TEXT,
      zip_code TEXT,
      state TEXT,
      country TEXT,
      searched_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Migration complete");
});