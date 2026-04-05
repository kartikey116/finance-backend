import Redis from "ioredis";
import { Redis as UpstashRedis } from "@upstash/redis";
import { env } from "./env.js";

let redisClient = null;

if (env.REDIS_URL) {
  // Use standard Redis URL if provided
  redisClient = new Redis(env.REDIS_URL);
} else if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
  const upstashClient = new UpstashRedis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN,
  });

  // Proxy-based compatibility layer: Correctly routes ioredis set commands to Upstash
  redisClient = new Proxy(upstashClient, {
    get: (target, prop) => {
      const originalValue = target[prop];
      if (typeof originalValue === "function") {
        if (prop === "set") {
          return (key, value, ...args) => {
            if (args[0] === "EX" && typeof args[1] === "number") {
              return originalValue.apply(target, [key, value, { ex: args[1] }]);
            }
            return originalValue.apply(target, [key, value, ...args]);
          };
        }
        return originalValue.bind(target);
      }
      return originalValue;
    },
  });

  if (env.NODE_ENV !== "test") {
    console.log("Redis initialized via Upstash REST (with ioredis proxy compatibility)");
  }
} else if (env.UPSTASH_REDIS_REST_URL) {
  if (env.NODE_ENV !== "test") {
    console.warn("Provide REDIS_URL or both UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN");
  }
}

if (!redisClient) {
  if (env.NODE_ENV !== "test") {
    console.warn("Redis client not initialized. Cache and rate limiting might fail or be bypassed.");
  }
} else if (redisClient instanceof Redis) {
  redisClient.on("connect", () => console.log("Redis Connected (ioredis)"));
  redisClient.on("error", (err) => console.error("Redis Error:", err));
}

export default redisClient;
