import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, default: 1, min: 1 },
  },
  { timestamps: true }
);

// Ensure one cart entry per product per user
cartSchema.index({ user: 1, productId: 1 }, { unique: true });

const Cart = mongoose.model("Cart", cartSchema);

export default Cart;
