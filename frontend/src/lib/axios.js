// src/lib/axios.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5000/api"
      : "/api",
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
    const res = await raw.get("/csrf-token"); // ❌ wrong
    // FIX ✅:
    // const res = await raw.get("/api/csrf-token");
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

// Retry once on 403 (invalid CSRF)
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 403 &&
      !original._retry &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(original.method?.toUpperCase())
    ) {
      original._retry = true;
      await fetchCsrfToken();
      if (csrfToken) {
        original.headers["X-CSRF-Token"] = csrfToken;
      }
      return axiosInstance(original);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
