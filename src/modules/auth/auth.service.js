import User from "../user/user.model.js";
import { ApiError } from "../../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import redisClient from "../../config/redis.js";

const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    env.JWT_ACCESS_SECRET,
    { expiresIn: env.ACCESS_TOKEN_EXPIRATION }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    env.JWT_REFRESH_SECRET,
    { expiresIn: env.REFRESH_TOKEN_EXPIRATION }
  );

  return { accessToken, refreshToken };
};

export const registerUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "Viewer",
  });

  const { accessToken, refreshToken } = generateTokens(user);
  
  if (redisClient) {
    // Store refresh token in Redis for 7 days (matching REFRESH_TOKEN_EXPIRATION)
    await redisClient.set(`session:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
  }

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.matchPassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (!user.isActive) {
    throw new ApiError(403, "Your account has been restricted. Please contact admin.");
  }

  const { accessToken, refreshToken } = generateTokens(user);

  if (redisClient) {
    await redisClient.set(`session:${user._id}`, refreshToken, "EX", 7 * 24 * 60 * 60);
  }

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    accessToken,
    refreshToken,
  };
};

export const refreshAccessToken = async (oldRefreshToken) => {
  try {
    const decoded = jwt.verify(oldRefreshToken, env.JWT_REFRESH_SECRET);
    
    if (redisClient) {
      const storedToken = await redisClient.get(`session:${decoded.id}`);
      if (storedToken !== oldRefreshToken) {
        throw new ApiError(401, "Refresh token is invalid or expired");
      }
    }

    const user = await User.findById(decoded.id);
    if (!user || !user.isActive) {
      throw new ApiError(401, "User not found or inactive");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

    if (redisClient) {
      await redisClient.set(`session:${user._id}`, newRefreshToken, "EX", 7 * 24 * 60 * 60);
    }

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new ApiError(401, "Invalid refresh token");
  }
};

export const logoutUser = async (userId) => {
  if (redisClient) {
    await redisClient.del(`session:${userId}`);
  }
};
