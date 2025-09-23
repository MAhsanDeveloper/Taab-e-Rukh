import crypto from "crypto";
import jwt from "jsonwebtoken";
import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import Product from "../models/product.model.js";
import Order from "../models/order.model.js";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const generateTokens = (userId, jti, isAdmin = false) => {
  const accessToken = jwt.sign({ userId, jti }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  const refreshToken = jwt.sign({ userId, jti }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};


const storeRefreshToken = async (userId, jti, refreshToken) => {
  const key = `refresh_token:${userId}:${jti}`;
  const hashed = hashToken(refreshToken);
  await redis.set(key, hashed, "EX", 7 * 24 * 60 * 60);
  return key;
};

const deleteRefreshTokenKey = async (userId, jti) => {
  const key = `refresh_token:${userId}:${jti}`;
  await redis.del(key);
};

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
};

const setAuthCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 24 * 60 * 60 * 1000, //  1 day
  });
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};


const clearAuthCookies = (res) => {
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    path: "/", 
  };

  // Clear tokens
  res.clearCookie("accessToken", options);
  res.clearCookie("refreshToken", options);

  // Clear CSRF token too
  res.clearCookie("XSRF-TOKEN", {
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    path: "/", // match csurf config
  });
};

export const signup = async (req, res) => {
  try {
    let { email, password, name } = req.body;

    // Trim all inputs
    email = email?.trim();
    name = name?.trim();
    password = password?.trim();

    // 1. Check required fields
    if (!name) return res.status(400).json({ message: "Please fill in the required field: name" });
    if (!email) return res.status(400).json({ message: "Please fill in the required field: email" });
    if (!password) return res.status(400).json({ message: "Please fill in the required field: password" });

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email address" });
    }

    // 3. Validate password length
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // 4. Prepare user data
    const userData = { name, email, password, role: "customer" };

    // 5. Create user
    const user = await User.create(userData);

    // 6. Generate tokens
    const jti = crypto.randomUUID();
    const { accessToken, refreshToken } = generateTokens(user._id.toString(), jti);
    await storeRefreshToken(user._id.toString(), jti, refreshToken);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(201).json({
      message: "Signup successful 🎉",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    // Duplicate key
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} already exists` });
    }

    // Validation error
    if (error.name === "ValidationError") {
      const firstError = Object.values(error.errors)[0].message;
      return res.status(400).json({ message: firstError });
    }

    return res.status(500).json({ message: "Something went wrong, please try again" });
  }
};



export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "Missing credentials" });
    }

   const user = await User.findOne({ email });
   
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role === "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const jti = crypto.randomUUID();
    const { accessToken, refreshToken } = generateTokens(user._id.toString(), jti);

    await storeRefreshToken(user._id.toString(), jti, refreshToken);
    setAuthCookies(res, accessToken, refreshToken);

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

const jti = crypto.randomUUID();
const { accessToken, refreshToken } = generateTokens(user._id.toString(), jti, true);

await storeRefreshToken(user._id.toString(), jti, refreshToken);
setAuthCookies(res, accessToken, refreshToken);


    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error in adminLogin controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      try {
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const { userId, jti } = decoded;
        await deleteRefreshTokenKey(userId, jti);
      } catch (err) {
        console.warn("Logout: refresh token invalid or expired", err?.message || err);
      }
    }

    clearAuthCookies(res);
    return res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const { userId, jti: oldJti } = decoded;
    const storedKey = `refresh_token:${userId}:${oldJti}`;
    const storedHash = await redis.get(storedKey);

    if (!storedHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const providedHash = hashToken(refreshToken);
    if (providedHash !== storedHash) {
      await redis.del(storedKey);
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const newJti = crypto.randomUUID();
    const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
      generateTokens(userId, newJti);

    await storeRefreshToken(userId, newJti, newRefreshToken);
    await redis.del(storedKey);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    console.error("Error in refreshToken controller:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;

    // ✅ Fetch user reviews from embedded array
    const reviewedProducts = await Product.find({ "reviews.user": userId })
      .select("name reviews")
      .lean();

    const reviews = reviewedProducts.flatMap(p =>
      p.reviews
        .filter(r => r.user.toString() === userId.toString())
        .map(r => ({
          productName: p.name,
          rating: r.rating,
          comment: r.comment,
        }))
    );

    // ✅ Fetch purchased products from orders
    const orders = await Order.find({ user: userId })
      .populate("products.product", "name")
      .lean();

    const purchasedProducts = orders.flatMap(order =>
      order.products.map(p => ({
        name: p.product?.name,
        quantity: p.quantity,
      }))
    );

    return res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      reviews,
      purchases: purchasedProducts,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
