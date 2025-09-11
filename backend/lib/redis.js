// lib/redis.js
import dotenv from "dotenv";
dotenv.config();

const disableRedis = true;

export const redis = disableRedis
  ? {
      get: async () => null,
      set: async () => null,
      del: async () => null,
      expire: async () => null,
      // add any other methods your app uses
    }
  : new (await import("ioredis")).default(process.env.UPSTASH_REDIS_URL);
