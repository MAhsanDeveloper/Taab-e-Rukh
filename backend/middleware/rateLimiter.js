import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import IORedis from "ioredis";

const windowMs = 15 * 60 * 1000; // 15 minutes
const maxRequests = 100;

let apiLimiter;

if (process.env.REDIS_URL) {
  const redisClient = new IORedis(process.env.REDIS_URL, {
    // optional connection options
    maxRetriesPerRequest: 1,
  });

  apiLimiter = rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.call(...args),
    }),
    message: "Too many requests from this IP, please try again later.",
  });
} else {
  apiLimiter = rateLimit({
    windowMs,
    max: maxRequests,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests from this IP, please try again later.",
  });
}

export { apiLimiter };
