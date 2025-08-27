import axios from "axios";
const API_BASE = import.meta.env.VITE_API_BASE; // set on Vercel
const api = axios.create({ baseURL: API_BASE });
api.interceptors.request.use((config)=>{const t=localStorage.getItem("token"); if(t) config.headers.Authorization=`Bearer ${t}`; return config;});
export default api;
