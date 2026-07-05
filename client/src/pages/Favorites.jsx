import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFavorites, removeFavorite } from "../api/favoriteApi";

function Favorites() {
  const [favorites, setFavorites] = useState([]);

  const loadFavorites = async () => {
    const data = await getFavorites();
    setFavorites(data);
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleRemove = async (serviceId) => {
    await removeFavorite(serviceId);
    loadFavorites();
  };

  return (
    <>
      <Navbar />

      <div className="user-page modern-user-page">
        <section className="listings-header">
          <h1>My Favorites</h1>
          <p>Your saved Lemon Page services.</p>
        </section>

        <section className="intro-service-grid">
          {favorites.length === 0 && (
            <div className="empty-state">
              <h3>No favorites yet</h3>
              <p>Save services from the Available Services page.</p>
            </div>
          )}

          {favorites.map((service) => (
            <article className="modern-service-card" key={service.id}>
              <div className="card-icon">❤️</div>

              <div className="card-main">
                <div className="card-title-row">
                  <h3>{service.service_name}</h3>
                  <span className="category-pill">{service.category}</span>
                </div>

                <p className="business-name">{service.business_name}</p>
                <p className="service-desc">{service.description}</p>

                <div className="card-info">
                  <span>📍 {service.address}</span>
                  <span>📞 {service.phone}</span>
                  <span>🕒 {service.opening_hours}</span>
                </div>

                <div className="card-actions">
                  <button
                    className="favorite-btn saved"
                    onClick={() => handleRemove(service.id)}
                  >
                    Remove
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
    </>
  );
}

export default Favorites;