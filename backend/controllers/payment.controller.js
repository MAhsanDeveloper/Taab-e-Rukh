import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";

// Create Order (COD / Guest / Local Payment)
export const createOrder = async (req, res) => {
  try {
    const { products, couponCode, paymentMethod, shippingDetails, totalAmount } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    const newOrder = new Order({
      user: req.user?._id || null, // guest or logged-in
      products: products.map((p) => ({
        product: p._id,
        quantity: p.quantity,
        price: p.price,
      })),
      totalAmount,
      paymentMethod,
      shippingDetails,
      couponCode: couponCode || null,
    });

    // If a coupon is used and user is logged in, deactivate it
    if (couponCode && req.user?._id) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, userId: req.user._id },
        { isActive: false }
      );
    }

    await newOrder.save();
    res.status(201).json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to place order", error: err.message });
  }
};


export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "name email") // populate user info
      .populate("products.product", "name"); // populate product names

    res.status(200).json({ orders }); // must be `{ orders: [...] }`
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ message: "Failed to fetch orders", error: err.message });
  }
};