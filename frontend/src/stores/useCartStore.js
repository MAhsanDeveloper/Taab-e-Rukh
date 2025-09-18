import { create } from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useCartStore = create((set, get) => ({
  cart: [],
  coupon: null,
  total: 0,
  subtotal: 0,
  isCouponApplied: false,

  // Fetch user's active coupon
  getMyCoupon: async () => {
    try {
      const res = await axios.get("/coupons", { withCredentials: true });
      if (res.data) {
        set({ coupon: res.data, isCouponApplied: true });
        get().calculateTotals();
      } else {
        set({ coupon: null, isCouponApplied: false });
      }
    } catch (error) {
      set({ coupon: null, isCouponApplied: false });
      console.error("Error fetching coupon:", error);
    }
  },

  applyCoupon: async (code) => {
    try {
      if (!code) return toast.error("Please enter a coupon code");
      const res = await axios.post(`/coupons/validate`, { code }, { withCredentials: true });

      set({ coupon: res.data, isCouponApplied: true });
      get().calculateTotals();
      toast.success("Coupon applied successfully!");
    } catch (error) {
      set({ coupon: null, isCouponApplied: false });
      get().calculateTotals();
      toast.error(error.response?.data?.message || "Invalid or expired coupon");
    }
  },

  removeCoupon: async () => {
    set({ coupon: null, isCouponApplied: false });
    get().calculateTotals();
    toast.success("Coupon removed");
  },

  // CART OPERATIONS
  getCartItems: async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
        set({ cart: localCart });
        get().calculateTotals();
        return;
      }

      const res = await axios.get(`/cart`,{ withCredentials: true });
      set({ cart: res.data });
      get().calculateTotals();
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response?.data?.message || "Failed to fetch cart");
    }
  },

  addToCart: async (product) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        set((prev) => {
          const existing = prev.cart.find((i) => i._id === product._id);
          const newCart = existing
            ? prev.cart.map((i) =>
                i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...prev.cart, { ...product, quantity: 1 }];
          localStorage.setItem("cart", JSON.stringify(newCart));
          return { cart: newCart };
        });
        toast.success("Added to cart");
        return;
      }

      const res = await axios.post(
        `/cart`,
        { productId: product._id },
        { withCredentials: true }
      );
      set((prev) => {
        const existing = prev.cart.find((i) => i._id === product._id);
        return {
          cart: existing
            ? prev.cart.map((i) =>
                i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
              )
            : [...prev.cart, res.data],
        };
      });
      get().calculateTotals();
      toast.success("Added to cart");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  },

removeFromCart: async (productId) => {
  const token = localStorage.getItem("token");

  if (!token) {
    set((prev) => {
      const newCart = prev.cart.filter((i) => i._id !== productId);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
    get().calculateTotals();
    return;
  }

  try {
    await axios.delete(`/cart/${productId}`, { withCredentials: true });

    set((prev) => ({
      cart: prev.cart.filter((i) => i._id !== productId),
    }));

    get().calculateTotals();
    toast.success("Item removed");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to remove item");
  }
},

clearCart: async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    // Clear local cart
    localStorage.removeItem("cart");
    set({ cart: [] });
    get().calculateTotals();
    return;
  }

  try {
    // Clear server cart
    await axios.delete("/cart", { withCredentials: true }); // assumes your backend clears all items on DELETE /cart
    set({ cart: [] });
    get().calculateTotals();
    toast.success("Cart cleared");
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to clear cart");
  }
},


updateQuantity: async (cartItemId, quantity) => {
  const token = localStorage.getItem("token");
  if (!token) {
    set((prev) => {
      const newCart = prev.cart
        .map((i) => (i.cartItemId === cartItemId ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0);
      localStorage.setItem("cart", JSON.stringify(newCart));
      return { cart: newCart };
    });
    get().calculateTotals();
    return;
  }

  try {
    const res = await axios.put(
      `/cart/${cartItemId}`,
      { quantity },
      { withCredentials: true }
    );
    set({ cart: res.data });
    get().calculateTotals();
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to update quantity");
  }
},

  calculateTotals: () => {
    const { cart, coupon } = get();
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    let total = subtotal;

    if (coupon?.discountPercentage) {
      total = subtotal - (subtotal * coupon.discountPercentage) / 100;
    }

    set({ subtotal, total });
  },
}));

