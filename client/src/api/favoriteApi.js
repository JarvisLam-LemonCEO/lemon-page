import axios from "axios";

const API_URL = "http://localhost:5050/api/favorites";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getFavorites = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

export const addFavorite = async (serviceId) => {
  const response = await axios.post(API_URL, { serviceId }, authHeader());
  return response.data;
};

export const removeFavorite = async (serviceId) => {
  const response = await axios.delete(`${API_URL}/${serviceId}`, authHeader());
  return response.data;
};