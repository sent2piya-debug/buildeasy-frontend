import axios from "axios";

// Base API URL (from Vercel env, fallback to backend URL)
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE) ||
  "https://buildeasy-backend.onrender.com";

const api = axios.create({ baseURL: API_BASE });

// Add token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

