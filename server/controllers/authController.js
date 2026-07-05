const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "lemonpage_secret";

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!["normal", "business"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `;

    db.run(sql, [name, email, hashedPassword, role], function (err) {
      if (err) {
        if (err.message.includes("UNIQUE")) {
          return res.status(400).json({ message: "Email already exists" });
        }

        return res.status(500).json({ message: "Signup failed" });
      }

      const token = jwt.sign(
  {
    id: this.lastID,
    role,
  },
  JWT_SECRET,
  { expiresIn: "1d" }
);

res.status(201).json({
  message: "User created successfully",
  token,
  user: {
    id: this.lastID,
    name,
    email,
    role,
  },
});
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql = `SELECT * FROM users WHERE email = ?`;

  db.get(sql, [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Login failed" });
    }

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  });
};