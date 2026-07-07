import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices } from "../api/serviceApi";
import { getReviewsByService } from "../api/reviewApi";

function Intro() {
  const [selectedService, setSelectedService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    category: "",
    zip_code: "",
    state: "",
    country: "",
  });

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getAllServices();

if (Array.isArray(data)) {
  setServices(data);
} else {
  setServices(data.services || []);
}
      } catch (error) {
        console.log("Failed to load services", error);
      }
    };

    loadServices();
  }, []);

  const categories = [
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  const filteredServices = services.filter((service) => {
    return (
      (!filters.category || service.category === filters.category) &&
      (!filters.zip_code ||
        service.zip_code?.toLowerCase().includes(filters.zip_code.toLowerCase())) &&
      (!filters.state ||
        service.state?.toLowerCase().includes(filters.state.toLowerCase())) &&
      (!filters.country ||
        service.country?.toLowerCase().includes(filters.country.toLowerCase()))
    );
  });

  const handleViewDetails = async (service) => {
  setSelectedService(service);

  try {
    const reviewData = await getReviewsByService(service.id);
    setReviews(reviewData);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="intro-page compact-intro">
      <nav className="intro-nav modern-nav">
        <div className="intro-logo">
          <span className="logo-mark">🍋</span>
          <div>
            <strong>Lemon Page</strong>
            <small>Fresh local discovery</small>
          </div>
        </div>

        <div className="intro-links">
          <Link className="active-home" to="/">
            🏠 Home
          </Link>
          <Link to="/login">Login</Link>
          <Link className="nav-btn" to="/signup">
            Sign Up
          </Link>
        </div>
      </nav>

      <section className="listings-header">
        <h1>Newly Listed Services</h1>
        <p>Explore the latest services added to Lemon Page.</p>
      </section>

      <section className="filter-panel modern-filter">
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value })
          }
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <input
          placeholder="Zip code"
          value={filters.zip_code}
          onChange={(e) =>
            setFilters({ ...filters, zip_code: e.target.value })
          }
        />

        <input
          placeholder="State"
          value={filters.state}
          onChange={(e) =>
            setFilters({ ...filters, state: e.target.value })
          }
        />

        <input
          placeholder="Country"
          value={filters.country}
          onChange={(e) =>
            setFilters({ ...filters, country: e.target.value })
          }
        />
      </section>

      <section className="intro-service-grid">
  {filteredServices.length === 0 && (
    <div className="empty-state">
      <h3>No services found</h3>
      <p>Try changing your filters.</p>
    </div>
  )}

  {filteredServices.slice(0, 9).map((service) => (
    <article className="modern-service-card" key={service.id}>
      <div className="card-icon">🏪</div>

      <div className="card-main">
        <div className="card-title-row">
          <h3>{service.service_name}</h3>
          <span className="category-pill">{service.category}</span>
        </div>

        <p className="business-name">{service.business_name}</p>

        <p className="rating-line">
          ⭐ {Number(service.average_rating || 0).toFixed(1)}{" "}
          ({service.review_count || 0} reviews)
        </p>

        <p className="service-desc">
          {service.description || "No description provided."}
        </p>

        <div className="card-info">
          <span>📍 {service.address || "Address not provided"}</span>
          <span>
            🏛️ {service.zip_code} {service.state}, {service.country}
          </span>
          <span>📞 {service.phone || "Phone not provided"}</span>
          <span>🕒 {service.opening_hours || "Hours not provided"}</span>
        </div>

        <div className="card-actions">
          <button
            className="details-btn"
            onClick={() => handleViewDetails(service)}
          >
            View Details
          </button>

          {service.website && (
            <a
              href={service.website}
              target="_blank"
              rel="noreferrer"
              className="website-link"
            >
              Visit Website ↗
            </a>
          )}
        </div>
      </div>
    </article>
  ))}
</section>

{selectedService && (
  <div
    className="modal-overlay"
    onClick={() => setSelectedService(null)}
  >
    <div
      className="service-detail-modal"
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="modal-close"
        onClick={() => setSelectedService(null)}
      >
        ✕
      </button>

      <div className="detail-header">
        <div className="modal-icon">🏪</div>

        <div>
          <h2>{selectedService.service_name}</h2>

          <p className="business-name">
            {selectedService.business_name}
          </p>

          <span className="category-pill">
            {selectedService.category}
          </span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Description</h3>
        <p>{selectedService.description}</p>
      </div>

      <div className="detail-grid">
        <div>
          <strong>📍 Address</strong>
          <p>{selectedService.address}</p>
        </div>

        <div>
          <strong>📞 Phone</strong>
          <p>{selectedService.phone}</p>
        </div>

        <div>
          <strong>🕒 Opening Hours</strong>
          <p>{selectedService.opening_hours}</p>
        </div>

        <div>
          <strong>🌐 Website</strong>
          <p>{selectedService.website}</p>
        </div>
      </div>

      <div className="review-section">
        <h3>
          Reviews ({reviews.length})
        </h3>

        {reviews.length === 0 && (
          <p>No reviews yet.</p>
        )}

        {reviews.map((review) => (
          <div
            className="review-card"
            key={review.id}
          >
            <strong>{review.reviewer_name}</strong>

            <p>
              {"⭐".repeat(review.rating)}
            </p>

            <p>{review.comment}</p>

            <small>
              {new Date(review.created_at).toLocaleDateString()}
            </small>
          </div>
        ))}
      </div>

      <div className="detail-actions">
        <a
          href="/signup"
          className="save-btn"
        >
          Sign up to write a review
        </a>

        <button
          className="close-btn"
          onClick={() => setSelectedService(null)}
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default Intro;