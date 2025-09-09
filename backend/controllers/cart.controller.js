import Cart from "../models/cart.model.js";

// Helper function to normalize cart items
const normalizeCart = (cart) =>
  cart.map((item) => ({
    cartItemId: item._id, // actual Cart document id
    productId: item.productId._id, // product id
    name: item.productId.name,
    description: item.productId.description,
    mainImage: item.productId.mainImage,
    price: item.productId.price,
    hasDiscount: item.productId.hasDiscount,
    discountRate: item.productId.discountRate,
    quantity: item.quantity,
  }));

export const getCartProducts = async (req, res) => {
  try {
    const cart = await Cart.find({ user: req.user._id }).populate("productId");
    res.json(normalizeCart(cart));
  } catch (err) {
    console.error("getCartProducts error:", err);
    res.status(500).json({ message: "Failed to fetch cart" });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    let cartItem = await Cart.findOne({ user: userId, productId });

    if (cartItem) {
      cartItem.quantity += 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({ user: userId, productId, quantity: 1 });
    }

    await cartItem.populate("productId");

    res.json(normalizeCart([cartItem])[0]);
  } catch (error) {
    console.error("addToCart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const removeAllFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user._id;

    if (!productId) {
      await Cart.deleteMany({ user: userId });
    } else {
      await Cart.deleteOne({ user: userId, productId });
    }

    const updated = await Cart.find({ user: userId }).populate("productId");
    res.json(normalizeCart(updated));
  } catch (error) {
    console.error("removeAllFromCart error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateQuantity = async (req, res) => {
  try {
    const { id: productId } = req.params; // productId comes from route param
    const { quantity } = req.body;
    const userId = req.user._id;

    if (quantity <= 0) {
      await Cart.deleteOne({ user: userId, productId });
    } else {
      const cartItem = await Cart.findOneAndUpdate(
        { user: userId, productId },
        { $set: { quantity } },
        { new: true }
      ).populate("productId");

      if (!cartItem) {
        return res.status(404).json({ message: "Product not found in cart" });
      }
    }

    const updated = await Cart.find({ user: userId }).populate("productId");
    res.json(normalizeCart(updated));
  } catch (error) {
    console.error("updateQuantity error:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
