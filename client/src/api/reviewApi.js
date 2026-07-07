import axios from "axios";

const API_URL = "http://localhost:5050/api/reviews";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getReviewsByService = async (serviceId) => {
  const response = await axios.get(`${API_URL}/${serviceId}`);
  return response.data;
};

export const saveReview = async (serviceId, reviewData) => {
  const response = await axios.post(
    `${API_URL}/${serviceId}`,
    reviewData,
    authHeader()
  );

  return response.data;
};

export const deleteReview = async (serviceId) => {
  const response = await axios.delete(`${API_URL}/${serviceId}`, authHeader());
  return response.data;
};