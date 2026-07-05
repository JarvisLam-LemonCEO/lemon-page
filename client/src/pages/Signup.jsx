import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "../api/authApi";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "normal",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const data = await signup(formData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    if (data.user.role === "business") {
      navigate("/business");
    } else {
      navigate("/user");
    }
  } catch (error) {
    console.log(error);
    setMessage(error.response?.data?.message || error.message || "Signup failed");
  }
};

  return (
  <div className="auth-page">
    {/* Navigation Buttons */}
    <div className="auth-navbar">
      <button
        type="button"
        className="nav-button secondary"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <Link className="home-button" to="/">
        🏠 Home
      </Link>
    </div>

    {/* Left Side */}
    <div className="auth-left">
      <h1>🍋 Lemon Page</h1>
      <h2>Find services. Grow your business.</h2>
      <p>
        Join a fresh yellow page platform made for local users and business
        owners.
      </p>
    </div>

    {/* Signup Card */}
    <div className="auth-card">
      <div className="auth-badge">Join Lemon Page</div>

      <h2>Create Account</h2>
      <p className="subtitle">Start using Lemon Page today.</p>

      <form onSubmit={handleSubmit}>
        <label>Full Name</label>
        <input
          name="name"
          placeholder="John Smith"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Email Address</label>
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          name="password"
          type="password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <label>Account Type</label>
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
        >
          <option value="normal">👤 Normal User</option>
          <option value="business">🏢 Business User</option>
        </select>

        <button type="submit">Create Account</button>
      </form>

      {message && <p className="error">{message}</p>}

      <p className="switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  </div>
);
}

export default Signup;