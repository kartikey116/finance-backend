import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import redisClient from "../config/redis.js";
import { ApiError } from "../utils/apiResponse.js";

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.session_token) {
      token = req.cookies.session_token;
    }

    if (!token) {
      return next(new ApiError(401, "You are not logged in. Please log in to get access."));
    }

    // Verify token
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);

    // Check if user session exists in Redis (if Redis used)
    if (redisClient) {
      const sessionData = await redisClient.get(`session:${decoded.id}`);
      if (!sessionData) {
        return next(new ApiError(401, "Session expired or invalid. Please log in again."));
      }
    }

    // Attach user payload
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return next(new ApiError(401, "Your token has expired! Please log in again."));
    }
    if (err.name === "JsonWebTokenError") {
      return next(new ApiError(401, "Invalid token. Please log in again!"));
    }
    next(err);
  }
};
