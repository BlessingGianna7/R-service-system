import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Change if your backend uses another base URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request if present
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosInstance; 