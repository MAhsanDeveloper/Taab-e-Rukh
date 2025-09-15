import Coupon from "../models/coupon.model.js";

//  Fetch all active coupons (guests + logged-in)
export const getCoupon = async (req, res) => {
  try {
    const coupons = await Coupon.find({ isActive: true });

    res.json(coupons);
  } catch (error) {
    console.error("Error in getCoupon controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//  Validate a coupon code (guests + logged-in)
export const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ message: "Coupon code is required" });
    }

 const coupon = await Coupon.findOne({
  code: { $regex: `^${code.trim()}$`, $options: "i" },
  isActive: true,
});


    if (!coupon) {
      return res.status(404).json({ message: "Invalid coupon code" });
    }

    if (coupon.expirationDate && coupon.expirationDate < new Date()) {
      coupon.isActive = false;
      await coupon.save();
      return res.status(400).json({ message: "Coupon expired" });
    }

    res.json({
      message: "Coupon is valid",
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
    });
  } catch (error) {
    console.error("Error in validateCoupon controller:", error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const createCoupon = async (req, res) => {
  try {
    const { code, discountPercentage, expirationDate } = req.body;
    const existing = await Coupon.findOne({ code });
    if (existing) return res.status(400).json({ message: "Coupon code already exists" });

    const coupon = new Coupon({
      code,
      discountPercentage,
      expirationDate,
      isActive: true,
    });

    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByIdAndDelete(id);
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};