import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";
import { useUserStore } from "./useUserStore";

const LOCAL_CART_KEY = "cart";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      subtotal: 0,
      total: 0,
      coupon: null,
      isCouponApplied: false,

      // --- CART ACTIONS ---
      getCartItems: async () => {
        const user = useUserStore.getState().user;
        try {
          if (!user) {
            const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
            set({ cart: localCart });
          } else {
            const res = await axios.get("/cart");
            set({ cart: res.data || [] });
          }
          get().calculateTotals();
        } catch (err) {
          console.error("getCartItems error:", err);
          set({ cart: [] });
          get().calculateTotals();
        }
      },

      mergeLocalCartToServer: async () => {
        const localCart = JSON.parse(localStorage.getItem(LOCAL_CART_KEY) || "[]");
        if (!localCart.length) {
          await get().getCartItems();
          return;
        }

        // Wait until auth check completes
        while (useUserStore.getState().checkingAuth) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        try {
          await Promise.all(
            localCart.map((item) =>
              axios.post("/cart", {
                productId: item._id || item.productId,
                quantity: item.quantity || 1,
              })
            )
          );
          localStorage.removeItem(LOCAL_CART_KEY);
          await get().getCartItems();
          toast.success("Guest cart merged to your account");
        } catch (err) {
          console.error("mergeLocalCartToServer error:", err);
          await get().getCartItems();
        }
      },

      addToCart: async (product) => {
        // Wait until auth check completes
        while (useUserStore.getState().checkingAuth) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }
        const user = useUserStore.getState().user;

        if (!user) {
          // Guest cart
          set((prev) => {
            const existing = prev.cart.find(
              (i) => (i._id || i.cartItemId) === (product._id || product.cartItemId)
            );
            const newCart = existing
              ? prev.cart.map((i) =>
                  (i._id || i.cartItemId) === (product._id || product.cartItemId)
                    ? { ...i, quantity: i.quantity + 1 }
                    : i
                )
              : [...prev.cart, { ...product, quantity: 1, cartItemId: Date.now() }];
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
            return { cart: newCart };
          });
          get().calculateTotals();
          toast.success("Added to cart");
          return;
        }

        // Logged-in user
        try {
          await axios.post("/cart", { productId: product._id, quantity: 1 });
          await get().getCartItems(); // sync full cart from server
          toast.success("Added to cart");
        } catch (err) {
          console.error("Add to cart error:", err);
          toast.error(err.response?.data?.message || "Failed to add product");
          await get().getCartItems(); // fallback sync
        }
      },

      removeFromCart: async (id) => {
        const user = useUserStore.getState().user;
        if (!user) {
          set((prev) => {
            const newCart = prev.cart.filter((i) => i.cartItemId !== id && i._id !== id);
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
            return { cart: newCart };
          });
          get().calculateTotals();
          return;
        }

        try {
          await axios.delete(`/cart/${id}`);
          await get().getCartItems();
          toast.success("Item removed");
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to remove item");
        }
      },

      clearCart: async () => {
        const user = useUserStore.getState().user;
        if (!user) {
          localStorage.removeItem(LOCAL_CART_KEY);
          set({ cart: [] });
          get().calculateTotals();
          return;
        }

        try {
          await axios.delete("/cart");
          set({ cart: [] });
          get().calculateTotals();
          toast.success("Cart cleared");
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to clear cart");
        }
      },

      updateQuantity: async (id, quantity) => {
        const user = useUserStore.getState().user;
        if (!user) {
          set((prev) => {
            const newCart = prev.cart
              .map((i) => (i.cartItemId === id || i._id === id ? { ...i, quantity } : i))
              .filter((i) => i.quantity > 0);
            localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(newCart));
            return { cart: newCart };
          });
          get().calculateTotals();
          return;
        }

        try {
          await axios.put(`/cart/${id}`, { quantity });
          await get().getCartItems(); // sync full cart
        } catch (err) {
          toast.error(err.response?.data?.message || "Failed to update quantity");
        }
      },

      calculateTotals: () => {
        const { cart, coupon, isCouponApplied } = get();
        const subtotal = (cart || []).reduce(
          (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
          0
        );
        let total = subtotal;
        if (isCouponApplied && coupon?.discountPercentage) {
          total = subtotal - (subtotal * coupon.discountPercentage) / 100;
        }
        set({ subtotal, total });
      },

      // --- COUPONS ---
      getMyCoupon: async () => {
        try {
          const res = await axios.get("/coupons");
          if (res.data) {
            set({ coupon: res.data, isCouponApplied: true });
            get().calculateTotals();
          } else {
            set({ coupon: null, isCouponApplied: false });
          }
        } catch {
          set({ coupon: null, isCouponApplied: false });
        }
      },

      applyCoupon: async (code) => {
        try {
          if (!code) return toast.error("Please enter a coupon code");
          const res = await axios.post("/coupons/validate", { code });
          set({ coupon: res.data, isCouponApplied: true });
          get().calculateTotals();
          toast.success("Coupon applied successfully!");
        } catch (err) {
          set({ coupon: null, isCouponApplied: false });
          get().calculateTotals();
          toast.error(err.response?.data?.message || "Invalid or expired coupon");
        }
      },

      removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed");
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({ cart: state.cart }),
    }
  )
);
