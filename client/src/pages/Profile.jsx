import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getProfile, deleteAccount } from "../api/userApi";

function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch {
        setMessage("Failed to load profile");
      }
    };

    loadProfile();
  }, []);

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/", { replace: true });
    } catch {
      setMessage("Failed to delete account");
    }
  };

  const handleCancel = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role === "business") {
    navigate("/business");
  } else {
    navigate("/user");
  }
};

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <section className="profile-card">
          <h1>Profile Management</h1>
          <p className="subtitle">View your account information.</p>

          {message && <p className="error">{message}</p>}

          {profile && (
            <div className="profile-info">
              <div>
                <strong>Name</strong>
                <p>{profile.name}</p>
              </div>

              <div>
                <strong>Email</strong>
                <p>{profile.email}</p>
              </div>

              <div>
                <strong>Role</strong>
                <p>{profile.role === "business" ? "Business User" : "Normal User"}</p>
              </div>
            </div>
          )}

          <div className="profile-actions">
  <button
    className="cancel-profile-btn"
    onClick={handleCancel}
  >
    Cancel
  </button>

  <button
    className="danger-profile-btn"
    onClick={() => setShowConfirm(true)}
  >
    Delete Account
  </button>
</div>
        </section>

        {showConfirm && (
          <div className="modal-overlay" onClick={() => setShowConfirm(false)}>
            <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
              <div className="confirm-icon">⚠️</div>

              <h2>Delete Account?</h2>

              <p>
                This will permanently delete your account.
                <br />
                Business users will also lose all service listings.
              </p>

              <div className="confirm-buttons">
                <button className="cancel-btn" onClick={() => setShowConfirm(false)}>
                  Cancel
                </button>

                <button className="danger-btn" onClick={handleDeleteAccount}>
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

export default Profile;