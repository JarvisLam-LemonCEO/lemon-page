import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllServices } from "../api/serviceApi";

function Intro() {
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
        setServices(data);
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

        {filteredServices.map((service) => (
          <article className="modern-service-card" key={service.id}>
            <div className="card-icon">🏪</div>

            <div className="card-main">
              <div className="card-title-row">
                <h3>{service.service_name}</h3>
                <span className="category-pill">{service.category}</span>
              </div>

              <p className="business-name">{service.business_name}</p>
              <p className="service-desc">{service.description}</p>

              <div className="card-info">
                <span>📍 {service.address}</span>
                <span>
                  🏛️ {service.zip_code} {service.state}, {service.country}
                </span>
                <span>📞 {service.phone}</span>
              </div>

              <div className="card-actions">
                <button type="button" className="details-btn">
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
    </div>
  );
}

export default Intro;