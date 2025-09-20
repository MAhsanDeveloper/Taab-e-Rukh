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
      signup: async ({ name, email, password, confirmPassword, mobileNumber }) => {
        set({ loading: true });
        if (password !== confirmPassword) {
          set({ loading: false });
          toast.error("Passwords do not match");
          return null;
        }
        if (password.length < 6) {
          set({ loading: false });
          toast.error("Password must be at least 6 characters long");
          return null;
        }

        try {
          const res = await axios.post("/auth/signup", { name, email, password, mobileNumber });
          set({ user: res.data.user, loading: false });
          toast.success(res.data.message || "Signup successful 🎉");

          await useCartStore.getState().mergeLocalCartToServer();
          await useCartStore.getState().getCartItems();
          return res.data.user;
        } catch (err) {
          set({ loading: false });
          toast.error(err.response?.data?.message || "Signup failed");
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
          set({ user: null });
          await useCartStore.getState().getCartItems();
        } catch (err) {
          toast.error(err.response?.data?.message || "Logout failed");
        }
      },

      // -----------------
      checkAuth: async () => {
        set({ checkingAuth: true });
        try {
          const res = await axios.get("/auth/profile");
          set({ user: res.data, checkingAuth: false });
          await useCartStore.getState().mergeLocalCartToServer();
        // eslint-disable-next-line no-unused-vars
        } catch (err) {
          set({ user: null, checkingAuth: false });
          await useCartStore.getState().getCartItems();
        }
      },

      // -----------------
      refreshToken: async () => {
        set({ checkingAuth: true });
        try {
          await axios.post("/auth/refresh-token");
          await get().checkAuth();
          set({ checkingAuth: false });
        } catch (err) {
          set({ user: null, checkingAuth: false });
          throw err;
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const userStore = useUserStore.getState();

      try {
        if (!refreshPromise) {
          refreshPromise = userStore.refreshToken();
        }
        await refreshPromise;
        refreshPromise = null;

        // retry original request
        return axios(originalRequest);
      } catch (refreshErr) {
        await userStore.logout();
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
