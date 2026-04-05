import redisClient from "../config/redis.js";
import { ApiError } from "../utils/apiResponse.js";

const WINDOW_SIZE_IN_SECONDS = 60;
const MAX_REQUESTS = 100;

export const rateLimiter = async (req, res, next) => {
  if (process.env.NODE_ENV === "test") {
    return next();
  }
  
  if (!redisClient) {
    return next();
  }
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const key = `rate_limit:${ip}`;
    const currentRequests = await redisClient.incr(key);
    if (currentRequests === 1) {
      await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
    }
    if (currentRequests > MAX_REQUESTS) {
      return next(new ApiError(429, "Too many requests, please try again later."));
    }
    next();
  } catch (error) {
    console.error("Redis Rate Limiter Error:", error);
    next();
  }
};
