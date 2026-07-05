import { useEffect, useState } from "react";
import { serviceCategories } from "../data/categories";
import Navbar from "../components/Navbar";
import {
  getMyServices,
  createService,
  updateService,
  deleteService,
  toggleFeatured,
} from "../api/serviceApi";
import { getBusinessStats } from "../api/statsApi";


function BusinessDashboard() {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  const [stats, setStats] = useState({
  totalListings: 0,
  totalViews: 0,
  totalFavorites: 0,
  featuredListings: 0,
});

  const emptyForm = {
    service_name: "",
    category: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    zip_code: "",
    state: "",
    country: "",
    website: "",
    opening_hours: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState(emptyForm);

  const [deleteServiceId, setDeleteServiceId] = useState(null);

  const handleToggleFeatured = async (service) => {
  try {
    await toggleFeatured(service.id, !service.is_featured);
    setMessage("Featured status updated.");
    loadServices();
  } catch (error) {
  console.log("FEATURED FRONTEND ERROR:", error.response?.data || error.message);
  setMessage(error.response?.data?.message || "Failed to update featured status.");
}
};

  const loadServices = async () => {
  try {
    const data = await getMyServices();
    const statsData = await getBusinessStats();

    setServices(data);
    setStats(statsData);
  } catch {
    setMessage("Failed to load dashboard data");
  }
};

  useEffect(() => {
    loadServices();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createService(formData);
      setMessage("Service created successfully");
      setFormData(emptyForm);
      setShowAddModal(false);
      loadServices();
    } catch {
      setMessage("Failed to create service");
    }
  };

  const openEditModal = (service) => {
    setEditingService(service);
    setEditFormData({
      service_name: service.service_name || "",
      category: service.category || "",
      description: service.description || "",
      phone: service.phone || "",
      email: service.email || "",
      address: service.address || "",
      zip_code: service.zip_code || "",
      state: service.state || "",
      country: service.country || "",
      website: service.website || "",
      opening_hours: service.opening_hours || "",
    });
  };

  const closeEditModal = () => {
    setEditingService(null);
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateService(editingService.id, editFormData);
      setMessage("Service updated successfully");
      closeEditModal();
      loadServices();
    } catch {
      setMessage("Failed to update service");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteService(deleteServiceId);
      setDeleteServiceId(null);
      setMessage("Listing deleted successfully.");
      loadServices();
    } catch {
      setMessage("Failed to delete listing.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="dashboard-page">
        <section className="stats-grid">
  <div className="stat-card">
    <span>📋</span>
    <p>Total Listings</p>
    <h2>{stats.totalListings}</h2>
  </div>

  <div className="stat-card">
    <span>👀</span>
    <p>Total Views</p>
    <h2>{stats.totalViews}</h2>
  </div>

  <div className="stat-card">
    <span>❤️</span>
    <p>Total Favorites</p>
    <h2>{stats.totalFavorites}</h2>
  </div>

  <div className="stat-card">
    <span>⭐</span>
    <p>Featured Listings</p>
    <h2>{stats.featuredListings}</h2>
  </div>
</section>
        <main className="dashboard-single-layout">
  <section className="dashboard-panel listings-panel">
    <div className="listings-panel-header">
      <div>
        <h2>My Listings</h2>
        <p>Create, edit, and manage your Lemon Page service listings.</p>
      </div>

      <button
        className="add-service-btn"
        onClick={() => setShowAddModal(true)}
      >
        + Add New Service
      </button>
    </div>

    {message && <p className="message">{message}</p>}

    <div className="listing-stack">
      {services.length === 0 && <p>No listings yet.</p>}

      {services.map((service) => (
        <div className="listing-card" key={service.id}>
          <div>
            <h3>{service.service_name}</h3>
            <p className="category-pill">{service.category}</p>
            <p>{service.description}</p>
            <p>{service.phone}</p>
            <p>{service.address}</p>
          </div>

          <div className="listing-actions">
            <button
  className={service.is_featured ? "featured-btn active" : "featured-btn"}
  onClick={() => handleToggleFeatured(service)}
>
  {service.is_featured ? "Featured" : "Feature"}
</button>
            <button
              className="edit-btn"
              onClick={() => openEditModal(service)}
            >
              Edit
            </button>

            <button
              className="danger-btn"
              onClick={() => setDeleteServiceId(service.id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </section>
</main>

        {showAddModal && (
          <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>

              <h2>Add New Service</h2>
              <p className="subtitle">Create a new business listing.</p>

              <form onSubmit={handleCreate} className="edit-service-form">
                <input name="service_name" placeholder="Service name" value={formData.service_name} onChange={handleChange} required />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                <input name="email" placeholder="Business email" value={formData.email} onChange={handleChange} />
                <input name="address" placeholder="Address" value={formData.address} onChange={handleChange} />
                <input name="zip_code" placeholder="Zip code" value={formData.zip_code} onChange={handleChange} />
                <input name="state" placeholder="State" value={formData.state} onChange={handleChange} />
                <input name="country" placeholder="Country" value={formData.country} onChange={handleChange} />
                <input name="website" placeholder="Website" value={formData.website} onChange={handleChange} />
                <input name="opening_hours" placeholder="Opening hours" value={formData.opening_hours} onChange={handleChange} />

                <div className="modal-footer">
                  <button type="submit" className="save-btn">
                    Create Listing
                  </button>

                  <button
                    type="button"
                    className="close-btn"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {editingService && (
          <div className="modal-overlay" onClick={closeEditModal}>
            <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={closeEditModal}>
                ✕
              </button>

              <h2>Edit Listing</h2>
              <p className="subtitle">Update your business service information.</p>

              <form onSubmit={handleUpdate} className="edit-service-form">
                <input name="service_name" placeholder="Service name" value={editFormData.service_name} onChange={handleEditChange} required />
               <select
                  name="category"
                  value={editFormData.category}
                  onChange={handleEditChange}
                  required
                >
                  <option value="">Select Category</option>
                  {serviceCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <textarea name="description" placeholder="Description" value={editFormData.description} onChange={handleEditChange} />
                <input name="phone" placeholder="Phone" value={editFormData.phone} onChange={handleEditChange} />
                <input name="email" placeholder="Business email" value={editFormData.email} onChange={handleEditChange} />
                <input name="address" placeholder="Address" value={editFormData.address} onChange={handleEditChange} />
                <input name="zip_code" placeholder="Zip code" value={editFormData.zip_code} onChange={handleEditChange} />
                <input name="state" placeholder="State" value={editFormData.state} onChange={handleEditChange} />
                <input name="country" placeholder="Country" value={editFormData.country} onChange={handleEditChange} />
                <input name="website" placeholder="Website" value={editFormData.website} onChange={handleEditChange} />
                <input name="opening_hours" placeholder="Opening hours" value={editFormData.opening_hours} onChange={handleEditChange} />

                <div className="modal-footer">
                  <button type="submit" className="save-btn">
                    Save Changes
                  </button>

                  <button type="button" className="close-btn" onClick={closeEditModal}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {deleteServiceId && (
          <div className="modal-overlay" onClick={() => setDeleteServiceId(null)}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">🗑️</div>

              <h2>Delete Listing?</h2>

              <p>
                Are you sure you want to delete this listing?
                <br />
                <strong>This action cannot be undone.</strong>
              </p>

              <div className="confirm-buttons">
                <button
                  className="cancel-btn"
                  onClick={() => setDeleteServiceId(null)}
                >
                  Cancel
                </button>

                <button className="danger-btn" onClick={handleDelete}>
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BusinessDashboard;