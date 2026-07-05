const db = require("../db");

exports.getAllServices = (req, res) => {
  const sql = `
    SELECT services.*, users.name AS business_name
    FROM services
    JOIN users ON services.user_id = users.id
    ORDER BY services.created_at DESC
  `;

  db.all(sql, [], (err, services) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get services" });
    }

    res.json(services);
  });
};

exports.getMyServices = (req, res) => {
  const sql = `
    SELECT *
    FROM services
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;

  db.all(sql, [req.user.id], (err, services) => {
    if (err) {
      return res.status(500).json({ message: "Failed to get your services" });
    }

    res.json(services);
  });
};

exports.createService = (req, res) => {
  if (req.user.role !== "business") {
    return res.status(403).json({
      message: "Only business users can create services",
    });
  }

  const {
  service_name,
  category,
  description,
  phone,
  email,
  address,
  zip_code,
  state,
  country,
  website,
  opening_hours,
} = req.body;

  if (!service_name || !category) {
    return res.status(400).json({
      message: "Service name and category are required",
    });
  }

 const sql = `
  INSERT INTO services (
    user_id,
    service_name,
    category,
    description,
    phone,
    email,
    address,
    zip_code,
    state,
    country,
    website,
    opening_hours
  )
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.run(
    sql,
    [
      req.user.id,
      service_name,
      category,
      description,
      phone,
      email,
      address,
      zip_code,
      state,
      country,
      website,
      opening_hours,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to create service" });
      }

      res.status(201).json({
        message: "Service created successfully",
        serviceId: this.lastID,
      });
    }
  );
};

exports.updateService = (req, res) => {
  if (req.user.role !== "business") {
    return res.status(403).json({
      message: "Only business users can update services",
    });
  }

  const { id } = req.params;

  const {
    service_name,
    category,
    description,
    phone,
    email,
    address,
    website,
    opening_hours,
  } = req.body;

  const sql = `
    UPDATE services
    SET
      service_name = ?,
      category = ?,
      description = ?,
      phone = ?,
      email = ?,
      address = ?,
      website = ?,
      opening_hours = ?
    WHERE id = ? AND user_id = ?
  `;

  db.run(
    sql,
    [
      service_name,
      category,
      description,
      phone,
      email,
      address,
      website,
      opening_hours,
      id,
      req.user.id,
    ],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Failed to update service" });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          message: "Service not found or you do not own this service",
        });
      }

      res.json({ message: "Service updated successfully" });
    }
  );
};

exports.deleteService = (req, res) => {
  if (req.user.role !== "business") {
    return res.status(403).json({
      message: "Only business users can delete services",
    });
  }

  const { id } = req.params;

  const sql = `
    DELETE FROM services
    WHERE id = ? AND user_id = ?
  `;

  db.run(sql, [id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Failed to delete service" });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Service not found or you do not own this service",
      });
    }

    res.json({ message: "Service deleted successfully" });
  });
};

exports.toggleFeatured = (req, res) => {
  const { id } = req.params;
  const { is_featured } = req.body;

  const sql = `
    UPDATE services
    SET is_featured = ?
    WHERE id = ? AND user_id = ?
  `;

  db.run(sql, [is_featured ? 1 : 0, id, req.user.id], function (err) {
    if (err) {
      console.error("FEATURED ERROR:", err.message);
      return res.status(500).json({ message: "Failed to update featured status" });
    }

    if (this.changes === 0) {
      return res.status(404).json({
        message: "Service not found or you do not own this service",
      });
    }

    res.json({ message: "Featured status updated successfully" });
  });
};