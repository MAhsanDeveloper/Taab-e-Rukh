import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useCartStore } from "./useCartStore";

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      checkingAuth: true,

      // -----------------
      signup: async ({
        name,
        email,
        password,
        confirmPassword,
      }) => {
        set({ loading: true });

        // Trim input
        name = name?.trim();
        email = email?.trim();
        password = password?.trim();

        // 1. Required fields
        if (!name || !email || !password) {
          toast.error("Please fill in the required fields");
          set({ loading: false });
          return null;
        }

        // 2. Password match & length
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          set({ loading: false });
          return null;
        }
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters long");
          set({ loading: false });
          return null;
        }

        // 3. Email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          toast.error("Invalid email address");
          set({ loading: false });
          return null;
        }

        try {
          const payload = {
            name,
            email,
            password,
          };
          
          const res = await axios.post("/auth/signup", payload);
          set({ user: res.data.user, loading: false });
          toast.success(res.data.message || "Signup successful 🎉");

          await useCartStore.getState().mergeLocalCartToServer();
          await useCartStore.getState().getCartItems();
          return res.data.user;
        } catch (error) {
          const message =
            error.response?.data?.message || "Signup failed. Please try again";
          toast.error(message);
          set({ loading: false });
          return null;
        }
      },

      // -----------------
      login: async (email, password) => {
        set({ loading: true });
        try {
          const res = await axios.post("/auth/login", { email, password });
          set({ user: res.data, loading: false });
          await useCartStore.getState().mergeLocalCartToServer();
          return res.data;
        } catch (err) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Login failed");
          return null;
        }
      },

      // -----------------
      logout: async () => {
        try {
          await axios.post("/auth/logout");
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          set({ user: null, checkingAuth: false });
          await useCartStore.getState().getCartItems();
        }
      },

      // -----------------
      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          // silent request: bypass interceptors that log errors
          const res = await axios.get("/auth/profile").catch((err) => {
            if (err.response?.status !== 401)
              console.error("checkAuth error:", err);
            return null; // ignore 401
          });

          if (res?.data) {
            set({ user: res.data, checkingAuth: false });
            await useCartStore.getState().mergeLocalCartToServer();
          } else {
            set({ user: null, checkingAuth: false });
            await useCartStore.getState().getCartItems();
          }
          // eslint-disable-next-line no-unused-vars
        } catch (err) {
          // fallback, unlikely to hit
          set({ user: null, checkingAuth: false });
          await useCartStore.getState().getCartItems();
        }
      },

      // -----------------
      refreshToken: async () => {
        try {
          await axios.post("/auth/refresh-token"); // only called by interceptor
          await get().checkAuth(); // re-fetch user if refresh worked
        } catch (err) {
          set({ user: null, checkingAuth: false });
          throw err; // will trigger logout in interceptor
        }
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

// ---------------------------
// Axios interceptor
let refreshPromise = null;
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};

    // Ignore auth endpoints to prevent infinite loop
    const isAuthEndpoint =
      originalRequest.url.includes("/auth/profile") ||
      originalRequest.url.includes("/auth/refresh-token") ||
      originalRequest.url.includes("/auth/logout");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isAuthEndpoint
    ) {
      originalRequest._retry = true;
      const userStore = useUserStore.getState();

      try {
        if (!refreshPromise) {
          refreshPromise = userStore.refreshToken();
        }
        await refreshPromise;
        refreshPromise = null;

        return axios(originalRequest);
      } catch (refreshErr) {
        await userStore.logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);
