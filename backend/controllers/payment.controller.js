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
      totalAmount: rawTotalAmount,
    } = req.body;

    if (!products || !products.length) {
      return res.status(400).json({ message: "Cart is empty." });
    }

    // Map products safely
    const mappedProducts = products.map((p) => {
      const productId = p.product?._id || p.product || p._id;
      if (!productId) throw new Error("Product ID missing in order item");

      const price = p.price ?? 0;
      const discountRate = p.discountRate ?? 0;
      const hasDiscount = p.hasDiscount ?? false;
      const discountedPrice = hasDiscount
        ? (price * (100 - discountRate)) / 100
        : price;

      return {
        product: productId,
        quantity: p.quantity ?? 1,
        price,
        discountedPrice,
      };
    });

    // Ensure totalAmount is defined and numeric
    const totalAmount = rawTotalAmount ?? mappedProducts.reduce((sum, p) => sum + (p.discountedPrice ?? p.price) * (p.quantity ?? 1), 0);

    // Calculate shipping
    const shippingCost = totalAmount >= 5000 ? 0 : 300;

    // Get coupon discount safely
    let couponDiscount = 0;
    if (couponCode && req.user?._id) {
      const coupon = await Coupon.findOne({ code: couponCode, userId: req.user._id });
      if (coupon) {
        couponDiscount = coupon.discountPercentage ?? 0;

        // Deactivate coupon
        await Coupon.findOneAndUpdate(
          { code: couponCode, userId: req.user._id },
          { isActive: false }
        );
      }
    }

    const newOrder = new Order({
      user: req.user?._id || null,
      products: mappedProducts,
      totalAmount,
      paymentMethod: paymentMethod || "Cash on Delivery",
      shippingDetails,
      couponCode: couponCode || null,
      shippingCost,
      couponDiscount,
    });

    await newOrder.save();

    // Determine user info for email
    let userInfo;
    if (req.user) {
      userInfo = await User.findById(req.user._id).lean();
    } else if (shippingDetails.email) {
      userInfo = {
        name: shippingDetails.fullName || "Customer",
        email: shippingDetails.email,
      };
    } else {
  // No email available, but still place the order successfully
  userInfo = {
    name: shippingDetails.fullName || "Customer",
    email: null,
  };
}

  // Populate product names for email
const populatedOrder = await newOrder.populate("products.product", "name");

if (userInfo.email) {
  try {
    await sendOrderConfirmation(populatedOrder, userInfo);
  } catch (err) {
    console.error("Failed to send order confirmation email:", err);
  }
} else {
  console.log("Skipping email confirmation — no email provided.");
}


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
    res
      .status(500)
      .json({ message: "Failed to fetch orders", error: err.message });
  }
};
