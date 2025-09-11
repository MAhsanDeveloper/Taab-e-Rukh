import express from "express";
import cookieParser from "cookie-parser"
import helmet from "helmet";
import hpp from "hpp";
import compression from "compression";
import cors from "cors";
import dotenv from "dotenv";
import csurf from "csurf";

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

app.set("trust proxy", 1);

const allowedOrigins = [
  "http://localhost:5173",
  "https://your-production-domain.com",
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
          "https://hh-clocks-watches-production.up.railway.app",
          ...(isProduction ? [] : ["http://localhost:5000"]),
        ],
        imgSrc: ["'self'", "data:", "https://hh-clocks-watches-production.up.railway.app"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'", "https://www.google.com", "https://www.google.com/maps", "https://maps.google.com"],
        fontSrc: ["'self'", "https:", "data:"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "https:"],
      },
    },
    crossOriginResourcePolicy: false,
  })
);

if (isProduction) {
  app.use((req, res, next) => {
    if (req.secure || req.headers["x-forwarded-proto"] === "https") {
      return next();
    }
    return res.redirect(`https://${req.headers.host}${req.url}`);
  });
}

const csrfProtection = csurf({

  cookie: {
    httpOnly: false,              // allow browser JS to read the token cookie we set (double-submit)
    secure: isProduction,         // only secure in production
    sameSite: isProduction ? "Strict" : "Lax",
    // path: "/"                  // optional explicit path
  },
});


/* FIXED: Keep the existing behavior of applying csurf to state-changing routes,
   but we MUST also run csurf for the CSRF-token issuing GET route below so
   req.csrfToken() exists and a secret cookie is set. */
app.use((req, res, next) => {
  const method = req.method.toUpperCase();
  if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return csrfProtection(req, res, next);
  }
  return next();
});

// FIXED: ensure csurf middleware runs for this GET so req.csrfToken() is defined.
// This creates the _csrf secret cookie (by csurf) and allows us to send the token
// as a non-httpOnly cookie 'XSRF-TOKEN' for double-submit.
app.get("/api/csrf-token", csrfProtection, (req, res) => {
  try {
    // req.csrfToken is guaranteed by csrfProtection middleware
    const token = req.csrfToken();

    // send the token in JSON and as a cookie for double-submit on the client
    res.cookie("XSRF-TOKEN", token, {
      httpOnly: false,             // allow frontend JS to read this cookie
      secure: isProduction,
      sameSite: isProduction ? "Strict" : "Lax",
      // path: "/"                 // optional
    });

    return res.json({ csrfToken: token });
  } catch (err) {
    console.error("Failed to generate CSRF token:", err);
    return res.status(500).json({ csrfToken: null });
  }
});

app.use("/api/auth", apiLimiter, authRoutes);
app.use("/api/payments", apiLimiter, paymentRoutes);
app.use("/api/shop", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/coupons", apiLimiter, couponRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/hero-images", heroRoutes);
app.use("/api/spotlight", spotlightRoutes);
app.use("/api/category-images", categoryImageRoutes);
app.use("/api/orders", apiLimiter, orderRoutes);

app.post("/api/admin/create-admin", protectRoute, adminRoute, createAdmin);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const msg = status >= 500 ? "Internal server error" : err.message;
  console.error(err);
  res.status(status).json({ message: msg });
});

export default app;
