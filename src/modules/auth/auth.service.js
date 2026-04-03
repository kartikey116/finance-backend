import User from "../user/user.model.js";
import { ApiError } from "../../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import redisClient from "../../config/redis.js";

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, env.JWT_SECRET, {
    expiresIn: "1d",
  });
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

  const token = generateToken(user);
  
  if (redisClient) {
    await redisClient.set(`session:${user._id}`, token, "EX", 86400); // 1 day
  }

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
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

  const token = generateToken(user);

  if (redisClient) {
    await redisClient.set(`session:${user._id}`, token, "EX", 86400); // 1 day
  }

  return {
    user: { id: user._id, name: user.name, email: user.email, role: user.role },
    token,
  };
};

export const logoutUser = async (userId) => {
  if (redisClient) {
    await redisClient.del(`session:${userId}`);
  }
};
