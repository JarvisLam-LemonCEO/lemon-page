import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="notfound-page">
      <div className="notfound-card">
        <h1>🍋 404</h1>
        <h2>Page not found</h2>
        <p>The page you are looking for does not exist.</p>

        <Link className="home-button" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
}

export default NotFound;