const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

const dbPath = path.join(__dirname, "database", "lemonpage.db");
const schemaPath = path.join(__dirname, "database", "schema.sql");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to Lemon Page SQLite database");
  }
});

const schema = fs.readFileSync(schemaPath, "utf8");

db.exec(schema, (err) => {
  if (err) {
    console.error("Schema creation failed:", err.message);
  } else {
    console.log("Database tables ready");
  }
});

module.exports = db;