// src/api.js
import axios from "axios";

// Use env var if set, otherwise fall back to your Render URL.
// Remove any trailing slash to avoid double slashes in requests.
const API_BASE = (import.meta.env.VITE_API_BASE || "https://buildeasy-backend.onrender.com").replace(/\/$/, "");

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  // withCredentials: true, // enable if your backend uses cookies
});

// Add Authorization header from localStorage token (if present)
api.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (_) {
    // ignore if localStorage not available (SSR)
  }
  return config;
});

// Optional: centralised error normalization/logging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // You can inspect err.response?.status here, show toast, etc.
    return Promise.reject(err);
  }
);

export default api;
