import axios from "axios";

const API_URL = "http://localhost:5050/api/stats";

const getToken = () => localStorage.getItem("token");

export const getBusinessStats = async () => {
  const response = await axios.get(`${API_URL}/business`, {
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  return response.data;
};