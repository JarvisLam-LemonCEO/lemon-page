import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import {
  getAdminUsers,
  getAdminListings,
  deleteAdminUser,
  deleteAdminListing,
  toggleAdminListingFeatured,
} from "../api/adminApi";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [message, setMessage] = useState("");

  const loadAdminData = async () => {
    try {
      const userData = await getAdminUsers();
      const listingData = await getAdminListings();

      setUsers(userData);
      setListings(listingData);
    } catch {
      setMessage("Failed to load admin data");
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all related data?")) return;

    try {
      await deleteAdminUser(id);
      setMessage("User deleted.");
      loadAdminData();
    } catch {
      setMessage("Failed to delete user.");
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Delete this listing?")) return;

    try {
      await deleteAdminListing(id);
      setMessage("Listing deleted.");
      loadAdminData();
    } catch {
      setMessage("Failed to delete listing.");
    }
  };

  const handleToggleFeatured = async (listing) => {
    try {
      await toggleAdminListingFeatured(listing.id, !listing.is_featured);
      loadAdminData();
    } catch {
      setMessage("Failed to update featured status.");
    }
  };

  return (
    <>
      <Navbar />

      <div className="admin-page">
        <section className="listings-header">
          <h1>Admin Dashboard</h1>
          <p>Manage Lemon Page users and listings.</p>
        </section>

        {message && <p className="message">{message}</p>}

        <section className="admin-section">
          <h2>Users</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Admin</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>{user.is_admin ? "Yes" : "No"}</td>
                    <td>
                      <button
                        className="danger-btn"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="admin-section">
          <h2>Listings</h2>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Service</th>
                  <th>Business</th>
                  <th>Category</th>
                  <th>Views</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {listings.map((listing) => (
                  <tr key={listing.id}>
                    <td>{listing.id}</td>
                    <td>{listing.service_name}</td>
                    <td>{listing.business_name}</td>
                    <td>{listing.category}</td>
                    <td>{listing.view_count}</td>
                    <td>{listing.is_featured ? "Yes" : "No"}</td>
                    <td>
                      <div className="admin-actions">
                        <button
                          className="featured-btn"
                          onClick={() => handleToggleFeatured(listing)}
                        >
                          {listing.is_featured ? "Unfeature" : "Feature"}
                        </button>

                        <button
                          className="danger-btn"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </>
  );
}

export default AdminDashboard;