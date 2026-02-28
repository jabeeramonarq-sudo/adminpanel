import axios from "axios";

const defaultApiBase = import.meta.env.DEV
    ? "http://localhost:5000/api"
    : "https://api.amonarq.com/api";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || defaultApiBase,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor to add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("adminToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
