import Redis from "ioredis";
import { env } from "./env.js";

let redisClient = null;

if (env.REDIS_URL) {
  // Use standard Redis URL if provided
  redisClient = new Redis(env.REDIS_URL);
} else if (env.UPSTASH_REDIS_REST_URL) {
  // If only Upstash REST URLs are available, ioredis won't work perfectly via REST,
  // but Upstash offers redis:// URLs in their console that map to REDIS_URL.
  // We'll throw an error advising proper ioredis compatible URL.
  // Wait, let's just log a warning and proceed without Redis if not fully available
  // or use the url if it happens to be valid for ioredis.
  if (env.NODE_ENV !== "test") {
    console.warn("⚠️ Provide REDIS_URL for ioredis (e.g. redis://default:pass@endpoint:port)");
  }
}

if (!redisClient) {
  if (env.NODE_ENV !== "test") {
    console.warn("⚠️ Redis client not initialized. Cache and rate limiting might fail or be bypassed.");
  }
} else {
  redisClient.on("connect", () => console.log("✅ Redis Connected"));
  redisClient.on("error", (err) => console.error("❌ Redis Error:", err));
}

export default redisClient;
