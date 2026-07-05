import axios from "axios";

const API_URL = "http://localhost:5050/api/activity";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getNewListings = async () => {
  const response = await axios.get(`${API_URL}/new-listings`);
  return response.data;
};

export const getPopularServices = async () => {
  const response = await axios.get(`${API_URL}/popular`);
  return response.data;
};

export const getFeaturedBusinesses = async () => {
  const response = await axios.get(`${API_URL}/featured`);
  return response.data;
};

export const addRecentlyViewed = async (serviceId) => {
  const response = await axios.post(
    `${API_URL}/recently-viewed`,
    { serviceId },
    authHeader()
  );

  return response.data;
};

export const getRecentlyViewed = async () => {
  const response = await axios.get(`${API_URL}/recently-viewed`, authHeader());
  return response.data;
};

export const addSearchHistory = async (filters) => {
  const response = await axios.post(
    `${API_URL}/search-history`,
    {
      search_text: filters.search || "",
      category: filters.category || "",
      zip_code: filters.zip_code || "",
      state: filters.state || "",
      country: filters.country || "",
    },
    authHeader()
  );

  return response.data;
};

export const getSearchHistory = async () => {
  const response = await axios.get(`${API_URL}/search-history`, authHeader());
  return response.data;
};

export const clearSearchHistory = async () => {
  const response = await axios.delete(`${API_URL}/search-history`, authHeader());
  return response.data;
};

