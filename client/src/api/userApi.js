import axios from "axios";

const API_URL = "http://localhost:5050/api/users";

const getToken = () => localStorage.getItem("token");

export const getProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};

export const deleteAccount = async () => {
  const response = await axios.delete(`${API_URL}/delete`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};