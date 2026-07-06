import axios from "axios";

const API_URL = "http://localhost:5050/api/admin";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getAdminUsers = async () => {
  const response = await axios.get(`${API_URL}/users`, authHeader());
  return response.data;
};

export const getAdminListings = async () => {
  const response = await axios.get(`${API_URL}/listings`, authHeader());
  return response.data;
};

export const deleteAdminUser = async (id) => {
  const response = await axios.delete(`${API_URL}/users/${id}`, authHeader());
  return response.data;
};

export const deleteAdminListing = async (id) => {
  const response = await axios.delete(`${API_URL}/listings/${id}`, authHeader());
  return response.data;
};

export const toggleAdminListingFeatured = async (id, isFeatured) => {
  const response = await axios.patch(
    `${API_URL}/listings/${id}/featured`,
    { is_featured: isFeatured },
    authHeader()
  );

  return response.data;
};