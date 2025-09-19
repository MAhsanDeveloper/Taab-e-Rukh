// cart.route.js
import express from "express";
import Cart from "../models/cart.model.js";
import { normalizeCart } from "../controllers/cart.controller.js";
import { addToCart, getCartProducts, updateQuantity } from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", protectRoute, getCartProducts);
router.post("/", protectRoute, addToCart);
router.put("/:id", protectRoute, updateQuantity);

router.delete("/:id", protectRoute, async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.deleteOne({ _id: req.params.id, user: userId });
    const updated = await Cart.find({ user: userId }).populate("productId");
    res.json(normalizeCart(updated));
  } catch (err) {
    res.status(500).json({ message: "Failed to remove item" });
  }
});

export default router;
