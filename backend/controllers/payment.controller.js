import Coupon from "../models/coupon.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";
import { sendOrderConfirmation } from "../lib/email.js";

// Create Order (COD / Guest / Local Payment)
export const createOrder = async (req, res) => {
  try {
    const {
      products,
      couponCode,
      paymentMethod,
      shippingDetails,
      totalAmount,
    } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }
    const mappedProducts = products.map((p) => {
      const productId = p.product?._id || p.product || p._id;
      if (!productId) throw new Error("Product ID missing in order item");

      const discountedPrice = p.hasDiscount
        ? (p.price * (100 - (p.discountRate || 0))) / 100
        : p.price;

      return {
        product: productId,
        quantity: p.quantity,
        price: p.price,
        discountedPrice,
      };
    });

    const shippingCost = totalAmount >= 5000 ? 0 : 300;

const newOrder = new Order({
  user: req.user?._id || null,
  products: mappedProducts,
  totalAmount,
  paymentMethod,
  shippingDetails,
  couponCode: couponCode || null,
  shippingCost,
  couponDiscount: couponCode ? coupon?.discountPercentage || 0 : 0,
});

    // If a coupon is used and user is logged in, deactivate it
    if (couponCode && req.user?._id) {
      await Coupon.findOneAndUpdate(
        { code: couponCode, userId: req.user._id },
        { isActive: false }
      );
    }

    await newOrder.save();

    // Determine user info
    let userInfo;
    if (req.user) {
      userInfo = await User.findById(req.user._id).lean();
    } else if (shippingDetails.email) {
      userInfo = {
        name: shippingDetails.fullName,
        email: shippingDetails.email,
      };
    } else {
      return res
        .status(400)
        .json({ message: "No email available to send order confirmation." });
    }

    // Populate product names for email
    const populatedOrder = await newOrder.populate("products.product", "name");

    try {
      await sendOrderConfirmation(populatedOrder, userInfo);
    } catch (err) {
      console.error("Failed to send order confirmation email:", err);
    }

    res
      .status(201)
      .json({ message: "Order placed successfully!", orderId: newOrder._id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to place order", error: err.message });
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
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};
