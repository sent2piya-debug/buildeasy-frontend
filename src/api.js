import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE; // will come from Vercel environment
const api = axios.create({ baseURL: API_BASE });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

