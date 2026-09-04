import axios from "axios";

// Default backend API URL (ASP.NET Core Web API)
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5151/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 10000
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
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized API request or expired token.");
    }
    return Promise.reject(error);
  }
);

export default api;