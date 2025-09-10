import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // guest orders allowed
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
      },
    ],

    totalAmount: { type: Number, required: true, min: 0 },

    paymentMethod: { type: String, required: true },

    shippingDetails: {
      fullName: { type: String, required: true },
      email: { type: String },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      note: { type: String },
    },

    couponCode: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
