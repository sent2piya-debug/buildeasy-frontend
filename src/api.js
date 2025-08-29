// src/api.js
import axios from "axios";

// Use Vercel env var if set, otherwise fall back to your Render URL
const API_BASE =
  (import.meta.env && import.meta.env.VITE_API_BASE) ||
  "https://buildeasy-backend.onrender.com";

const api = axios.create({ baseURL: API_BASE });

// Add JWT if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

