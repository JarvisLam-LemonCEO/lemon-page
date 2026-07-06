import axios from "axios";

const API_URL = "http://localhost:5050/api/notifications";

const getToken = () => localStorage.getItem("token");

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${getToken()}`,
  },
});

export const getNotifications = async () => {
  const response = await axios.get(API_URL, authHeader());
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/read`, {}, authHeader());
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await axios.patch(`${API_URL}/read-all`, {}, authHeader());
  return response.data;
};

export const clearNotifications = async () => {
  const response = await axios.delete(API_URL, authHeader());
  return response.data;
};