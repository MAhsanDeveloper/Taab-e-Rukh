// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : import.meta.env.VITE_API_BASE_URL + "/api",
  withCredentials: true,
});

// 🔒 CSRF token cache
let csrfToken = null;

// Fetch CSRF token from backend
const fetchCsrfToken = async () => {
  try {
    const raw = axios.create({
      baseURL: axiosInstance.defaults.baseURL,
      withCredentials: true,
    });
    const res = await raw.get("/csrf-token");
    csrfToken = res.data?.csrfToken || null;
    return csrfToken;
  } catch (err) {
    console.error("❌ Failed to fetch CSRF token:", err.message);
    return null;
  }
};

// Attach CSRF automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase();
    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      if (csrfToken) {
        config.headers["X-CSRF-Token"] = csrfToken;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Retry once on 401 or 403
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    const isAuthEndpoint =
      original.url.includes("/auth/profile") ||
      original.url.includes("/auth/refresh-token") ||
      original.url.includes("/auth/logout");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token"); // get new tokens
        return axiosInstance(original); // retry original request
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const isAuthEndpoint =
      original.url.includes("/auth/profile") ||
      original.url.includes("/auth/refresh-token");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      original._retry = true;
      try {
        await axiosInstance.post("/auth/refresh-token");
        return axiosInstance(original);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;
