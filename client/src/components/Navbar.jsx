import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  navigate("/", { replace: true });
};

  return (
    <nav className="navbar">
      <Link
  to={user?.role === "business" ? "/business" : "/user"}
  className="navbar-logo"
>
  🍋 Lemon Page
</Link>

      <div className="navbar-right">
        <div className="user-info">
          <strong>{user?.name}</strong>
          <span>
            {user?.role === "business" ? "Business User" : "Normal User"}
          </span>
        </div>

        {user?.role === "normal" && (
  <button className="profile-btn" onClick={() => navigate("/favorites")}>
    Favorites
  </button>
)}

{user?.is_admin === 1 && (
  <button className="profile-btn" onClick={() => navigate("/admin")}>
    Admin
  </button>
)}

        <button className="profile-btn" onClick={() => navigate("/profile")}>
  Profile
</button>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;