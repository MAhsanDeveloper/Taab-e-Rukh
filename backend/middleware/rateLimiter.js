import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // “Allow each user/IP up to 100 requests every 15 minutes. If they exceed that, block them temporarily.”
  message: "Too many requests from this IP, please try again later."
});
