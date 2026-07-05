import axios from "axios";

const API_URL = "http://localhost:5050/api/services";

const getToken = () => localStorage.getItem("token");

export const getAllServices = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const getMyServices = async () => {
  const response = await axios.get(`${API_URL}/mine`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const createService = async (serviceData) => {
  const response = await axios.post(API_URL, serviceData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const updateService = async (id, serviceData) => {
  const response = await axios.put(`${API_URL}/${id}`, serviceData, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteService = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

const getAuthHeader = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const toggleFeatured = async (id, isFeatured) => {
  const response = await axios.patch(
    `${API_URL}/${id}/featured`,
    { is_featured: isFeatured },
    getAuthHeader()
  );

  return response.data;
};