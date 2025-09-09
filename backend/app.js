import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
// import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import { apiLimiter } from "./middleware/rateLimiter.js";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import couponRoutes from "./routes/coupon.route.js";
import paymentRoutes from "./routes/payment.route.js";
import analyticsRoutes from "./routes/analytics.route.js";
import heroRoutes from "./routes/hero.route.js";
import spotlightRoutes from "./routes/spotlight.route.js";
import categoryImageRoutes from "./routes/categoryImage.route.js";
import orderRoutes from "./routes/order.route.js";


import { createAdmin } from "./controllers/admin.controller.js";
import { protectRoute, adminRoute } from "./middleware/auth.middleware.js";

dotenv.config();
const app = express();
const isProduction = process.env.NODE_ENV === "production";

// --------------------
const allowedOrigins = [
  "http://localhost:5173",              // Dev frontend
  "https://your-production-domain.com", // Production frontend
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
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Safe mongo sanitize
// app.use(
//   mongoSanitize({
//     replaceWith: "_", // avoids "Cannot set property query" error
//   })
// );

app.use(hpp());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: [
          "'self'",
          "https://hh-clocks-watches-production.up.railway.app",
          ...(isProduction ? [] : ["http://localhost:5000"]),
        ],
        imgSrc: ["'self'", "data:", "https://hh-clocks-watches-production.up.railway.app"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", "https://www.google.com", "https://www.google.com/maps", "https://maps.google.com"],
        fontSrc: ["'self'", "https:", "data:"],
      },
    },
    crossOriginResourcePolicy: false,
  })
);


app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/payments", apiLimiter, paymentRoutes);
app.use("/api/shop", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hero-images", heroRoutes);
app.use("/api/spotlight", spotlightRoutes);
app.use("/api/category-images", categoryImageRoutes);
app.use("/api/orders", orderRoutes);

app.post("/api/admin/create-admin", protectRoute, adminRoute, createAdmin);

export default app;
