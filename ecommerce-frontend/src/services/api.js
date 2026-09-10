import axios from "axios";

// Centralized backend API URL (ASP.NET Core Web API)
const isLocalhostEnv = typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1");

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  (isLocalhostEnv ? "http://localhost:5151/api" : "https://ecommerce-marketplace.onrender.com/api")
).replace(/\/+$/, "");

// Derive root server origin for image media assets
export const MEDIA_BASE_URL = API_BASE_URL.endsWith("/api")
  ? API_BASE_URL.slice(0, -4)
  : API_BASE_URL;

export const getMediaUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${MEDIA_BASE_URL}${cleanPath}`;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

// Automatic JWT Token Bearer Interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.isNetworkError = true;
      console.warn("Backend API Offline / Connection Refused at:", API_BASE_URL);
      error.message = "Unable to connect to server. Please check your network connection or backend availability.";
    } else if (error.response.status === 401) {
      console.warn("Unauthorized API request or expired token.");
    }
    return Promise.reject(error);
  }
);

export default api;