import { useEffect, useState } from "react";
import { getAllServices } from "../api/serviceApi";
import Navbar from "../components/Navbar";
import {
  addRecentlyViewed,
  getRecentlyViewed,
  addSearchHistory,
  getSearchHistory,
  clearSearchHistory,
  getPopularServices,
  getNewListings,
  getFeaturedBusinesses,
} from "../api/activityApi";

import {
  getReviewsByService,
  saveReview,
  deleteReview,
} from "../api/reviewApi";

import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "../api/favoriteApi";

function UserHome() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [services, setServices] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const [popularServices, setPopularServices] = useState([]);
  const [newListings, setNewListings] = useState([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("newest");

  const [reviews, setReviews] = useState([]);
const [reviewForm, setReviewForm] = useState({
  rating: 5,
  comment: "",
});

  const [filters, setFilters] = useState({
    category: "",
    zip_code: "",
    state: "",
    country: "",
    search: "",
  });

  useEffect(() => {
  const loadData = async () => {
  try {
    const serviceData = await getAllServices(page, 9, sort);
    const viewedData = await getRecentlyViewed();
    const historyData = await getSearchHistory();
    const favoriteData = await getFavorites();
    const popularData = await getPopularServices();
    const newListingsData = await getNewListings();
    const featuredData = await getFeaturedBusinesses();

    // Handle both old and new API responses
    if (Array.isArray(serviceData)) {
      setServices(serviceData);
      setTotalPages(1);
    } else {
      setServices(serviceData.services || []);
      setTotalPages(serviceData.totalPages || 1);
    }

    setRecentlyViewed(viewedData || []);
    setSearchHistory(historyData || []);
    setFavorites(favoriteData || []);
    setPopularServices(popularData || []);
    setNewListings(newListingsData || []);
    setFeaturedBusinesses(featuredData || []);
  } catch (error) {
    console.error("Failed to load user home data:", error);
  }
};

    loadData();
  }, [page, sort]);

  const isFavorite = (serviceId) => {
    return favorites.some((item) => item.id === serviceId);
  };

  const toggleFavorite = async (serviceId) => {
    try {
      if (isFavorite(serviceId)) {
        await removeFavorite(serviceId);
      } else {
        await addFavorite(serviceId);
      }

      const updated = await getFavorites();
      setFavorites(updated);
    } catch (error) {
      console.log("Failed to update favorite", error);
    }
  };

  const handleViewDetails = async (service) => {
  setSelectedService(service);

  try {
    await addRecentlyViewed(service.id);
    const viewed = await getRecentlyViewed();
    setRecentlyViewed(viewed);
  } catch (error) {
    console.log("Failed to save recently viewed", error);
  }

  try {
    const reviewData = await getReviewsByService(service.id);
    setReviews(reviewData);
  } catch (error) {
    console.log("Failed to load reviews", error);
  }
};

  const handleSaveSearch = async () => {
    try {
      await addSearchHistory(filters);
      const history = await getSearchHistory();
      setSearchHistory(history);
    } catch (error) {
      console.log("Failed to save search history", error);
    }
  };

  const handleClearSearchHistory = async () => {
    try {
      await clearSearchHistory();
      setSearchHistory([]);
    } catch (error) {
      console.log("Failed to clear search history", error);
    }
  };

  const categories = [
    ...new Set(services.map((service) => service.category).filter(Boolean)),
  ];

  const filteredServices = services.filter((service) => {
    const searchText = `
      ${service.service_name}
      ${service.category}
      ${service.description}
      ${service.address}
      ${service.business_name}
    `.toLowerCase();

    return (
      (!filters.search || searchText.includes(filters.search.toLowerCase())) &&
      (!filters.category || service.category === filters.category) &&
      (!filters.zip_code ||
        service.zip_code
          ?.toLowerCase()
          .includes(filters.zip_code.toLowerCase())) &&
      (!filters.state ||
        service.state?.toLowerCase().includes(filters.state.toLowerCase())) &&
      (!filters.country ||
        service.country?.toLowerCase().includes(filters.country.toLowerCase()))
    );
  });

  const handleSubmitReview = async (e) => {
  e.preventDefault();

  try {
    await saveReview(selectedService.id, reviewForm);
    const reviewData = await getReviewsByService(selectedService.id);
    setReviews(reviewData);
    setReviewForm({ rating: 5, comment: "" });
  } catch (error) {
    console.log("Failed to save review", error);
  }
};

const handleDeleteReview = async () => {
  try {
    await deleteReview(selectedService.id);
    const reviewData = await getReviewsByService(selectedService.id);
    setReviews(reviewData);
  } catch (error) {
    console.log("Failed to delete review", error);
  }
};

  return (
    <>
      <Navbar />

      <div className="user-page modern-user-page">
        <section className="listings-header">
          <h1>Available Services</h1>
          <p>Welcome, {user?.name}. Find fresh local services near you.</p>
        </section>

        <section className="user-search-row">
          <input
            placeholder="Search services..."
            value={filters.search}
            onChange={(e) =>
              setFilters({ ...filters, search: e.target.value })
            }
          />

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

        <div className="search-history-actions">
          <button className="save-search-btn" onClick={handleSaveSearch}>
            Save Search
          </button>
        </div>

        {recentlyViewed.length > 0 && (
          <section className="mini-section">
            <h2>Recently Viewed</h2>

            <div className="mini-card-row">
              {recentlyViewed.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  className="mini-service-card"
                  onClick={() => handleViewDetails(service)}
                >
                  <strong>{service.service_name}</strong>
                  <span>{service.category}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {searchHistory.length > 0 && (
          <section className="mini-section">
            <div className="mini-section-header">
              <h2>Search History</h2>

              <button
                className="clear-history-btn"
                onClick={handleClearSearchHistory}
              >
                Clear History
              </button>
            </div>

            <div className="history-row">
              {searchHistory.slice(0, 6).map((item) => (
                <button
                  key={item.id}
                  className="history-chip"
                  onClick={() =>
                    setFilters({
                      search: item.search_text || "",
                      category: item.category || "",
                      zip_code: item.zip_code || "",
                      state: item.state || "",
                      country: item.country || "",
                    })
                  }
                >
                  {item.search_text || item.category || item.zip_code || "Search"}
                </button>
              ))}
            </div>
          </section>
        )}

        {popularServices.length > 0 && (
          <section className="mini-section">
            <h2>🔥 Popular Services</h2>

            <div className="mini-card-row">
              {popularServices.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  className="mini-service-card"
                  onClick={() => handleViewDetails(service)}
                >
                  <strong>{service.service_name}</strong>
                  <span>{service.category}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {featuredBusinesses.length > 0 && (
          <section className="mini-section">
            <h2>⭐ Featured Businesses</h2>

            <div className="mini-card-row">
              {featuredBusinesses.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  className="mini-service-card featured-mini-card"
                  onClick={() => handleViewDetails(service)}
                >
                  <strong>{service.service_name}</strong>
                  <span>{service.category}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {newListings.length > 0 && (
          <section className="mini-section">
            <h2>🆕 New Listings</h2>

            <div className="mini-card-row">
              {newListings.slice(0, 4).map((service) => (
                <button
                  key={service.id}
                  className="mini-service-card"
                  onClick={() => handleViewDetails(service)}
                >
                  <strong>{service.service_name}</strong>
                  <span>{service.category}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="browse-header">
          <h2>Browse All Services</h2>
          <p>Explore every available Lemon Page listing.</p>
        </section>

        <div className="sort-row">
          <label>Sort by:</label>

          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="newest">Newest</option>
            <option value="popular">Most Popular</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>

        <section className="intro-service-grid">
          {filteredServices.length === 0 && (
            <div className="empty-state">
              <h3>No services found</h3>
              <p>Try changing your search or filters.</p>
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
                  <span>🕒 {service.opening_hours}</span>
                </div>

                <div className="card-actions">
                  <button
                    type="button"
                    className="details-btn"
                    onClick={() => handleViewDetails(service)}
                  >
                    View Details
                  </button>

                  <button
                    type="button"
                    className={`favorite-btn ${
                      isFavorite(service.id) ? "saved" : ""
                    }`}
                    onClick={() => toggleFavorite(service.id)}
                  >
                    {isFavorite(service.id) ? "❤️ Saved" : "🤍 Save"}
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

        <div className="pagination-row">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>

        {selectedService && (
          <div className="modal-overlay" onClick={() => setSelectedService(null)}>
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
                  <p className="business-name">{selectedService.business_name}</p>
                  <span className="category-pill">{selectedService.category}</span>
                </div>
              </div>

              <div className="detail-section">
                <h3>About this service</h3>
                <p>{selectedService.description || "No description provided."}</p>
              </div>

              <div className="detail-grid">
                <div>
                  <strong>📍 Address</strong>
                  <p>{selectedService.address || "Not provided"}</p>
                </div>

                <div>
                  <strong>🏛 Location</strong>
                  <p>
                    {selectedService.zip_code} {selectedService.state},{" "}
                    {selectedService.country}
                  </p>
                </div>

                <div>
                  <strong>📞 Phone</strong>
                  <p>{selectedService.phone || "Not provided"}</p>
                </div>

                <div>
                  <strong>✉️ Email</strong>
                  <p>{selectedService.email || "Not provided"}</p>
                </div>

                <div>
                  <strong>🕒 Opening Hours</strong>
                  <p>{selectedService.opening_hours || "Not provided"}</p>
                </div>

                <div>
                  <strong>🌐 Website</strong>
                  <p>{selectedService.website || "Not provided"}</p>
                </div>
              </div>

              <div className="review-section">
                <h3>Reviews</h3>

                <form onSubmit={handleSubmitReview} className="review-form">
                  <select
                    value={reviewForm.rating}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, rating: Number(e.target.value) })
                    }
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5</option>
                    <option value={4}>⭐⭐⭐⭐ 4</option>
                    <option value={3}>⭐⭐⭐ 3</option>
                    <option value={2}>⭐⭐ 2</option>
                    <option value={1}>⭐ 1</option>
                  </select>

                  <textarea
                    placeholder="Write your review..."
                    value={reviewForm.comment}
                    onChange={(e) =>
                      setReviewForm({ ...reviewForm, comment: e.target.value })
                    }
                  />

                  <div className="review-actions">
                    <button type="submit" className="save-btn">
                      Submit Review
                    </button>

                    <button
                      type="button"
                      className="danger-btn"
                      onClick={handleDeleteReview}
                    >
                      Delete My Review
                    </button>
                  </div>
                </form>

                <div className="review-list">
                  {reviews.length === 0 && <p>No reviews yet.</p>}

                  {reviews.map((review) => (
                    <div className="review-card" key={review.id}>
                      <strong>{review.reviewer_name}</strong>
                      <p>{"⭐".repeat(review.rating)}</p>
                      <p>{review.comment}</p>
                      <small>{new Date(review.created_at).toLocaleString()}</small>
                    </div>
                  ))}
                </div>
              </div>

              <div className="detail-actions">
                {selectedService.website && (
                  <a
                    href={selectedService.website}
                    target="_blank"
                    rel="noreferrer"
                    className="visit-btn"
                  >
                    Visit Website
                  </a>
                )}

                <button
                  className="share-btn"
                  onClick={() => {
                    const text = `${selectedService.service_name} - ${selectedService.category}`;
                    navigator.clipboard.writeText(text);
                    alert("Service info copied!");
                  }}
                >
                  Share
                </button>

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
    </>
  );
}

export default UserHome;