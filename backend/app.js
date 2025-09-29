import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import csurf from "csurf";
import path from "path";
import { fileURLToPath } from "url";

import { apiLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import contactRoutes from "./routes/contact.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import heroRoutes from "./routes/hero.route.js";
import spotlightRoutes from "./routes/spotlight.route.js";
import categoryImageRoutes from "./routes/categoryImage.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";

dotenv.config();
const app = express();
const isProduction = process.env.NODE_ENV === "production";

// --- Fix __dirname for ESM ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// trust proxy headers
app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://thesgrgroup.com",
  "http://thesgrgroup.com",
  "https://api.thesgrgroup.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  })
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(hpp());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://thesgrgroup.com",
          "https://api.thesgrgroup.com",
          "https://31.97.110.69:5000",
        ],
        imgSrc: ["'self'", "data:", "https://thesgrgroup.com", "https://res.cloudinary.com"],
        objectSrc: ["'none'"],
        frameSrc: [
          "'self'",
          "https://www.google.com",
          "https://www.google.com/maps",
          "https://maps.google.com",
        ],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:", "'unsafe-inline'"],
      },
    },
    crossOriginResourcePolicy: false,
  })
);

// CSRF protection
const csrfProtection = csurf({
  cookie: {
    httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  },
});

// Exclude refresh-token route from CSRF
app.use((req, res, next) => {
  if (req.path === "/api/auth/refresh-token") {
    return next();
  }
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return csrfProtection(req, res, next);
  }
  return next();
});

app.get("/api/csrf-token", csrfProtection, (req, res) => {
  try {
    const token = req.csrfToken();
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false,
      secure: isProduction,
      sameSite: isProduction ? "Strict" : "Lax",
    });
    return res.json({ csrfToken: token });
  } catch (err) {
    console.error("Failed to generate CSRF token:", err);
    return res.status(500).json({ csrfToken: null });
  }
});

// --- API routes ---
app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/payments", apiLimiter, paymentRoutes);
app.use("/api/shop", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/coupons", apiLimiter, couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hero-images", heroRoutes);
app.use("/api/spotlight", spotlightRoutes);
app.use("/api/category-images", categoryImageRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);
app.use("/api/products", reviewRoutes);

// --- Error handler ---
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = status >= 500 ? "Internal server error" : err.message;
  console.error(err);
  res.status(status).json({ message: msg });
});

// --- Serve frontend in production ---
if (isProduction) {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

export default app;
