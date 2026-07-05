import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/authApi";


function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const data = await login(formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "business") {
        navigate("/business");
      } else {
        navigate("/user");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
  <div className="auth-page">
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

    <div className="auth-left">
      <h1>🍋 Lemon Page</h1>
      <h2>Welcome back to your fresh local guide.</h2>
      <p>
        Login to search local services, manage your business listings,
        and connect with your community.
      </p>
    </div>

    <div className="auth-card">
      <div className="auth-badge">Fresh Access</div>

      <h2>Login</h2>
      <p className="subtitle">Continue to your Lemon Page account.</p>

      <form onSubmit={handleSubmit}>
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login to Lemon Page</button>
      </form>

      {message && <p className="error">{message}</p>}

      <p className="switch">
        New to Lemon Page? <Link to="/signup">Create account</Link>
      </p>
    </div>
  </div>
);
}

export default Login;