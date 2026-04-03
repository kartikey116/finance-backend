import User from "./user.model.js";
import { ApiError } from "../../utils/apiResponse.js";
import redisClient from "../../config/redis.js";

export const getAllUsers = async () => {
  return await User.find().select("-__v");
};

export const createUser = async (userData) => {
  const { name, email, password, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(400, "User with this email already exists");
  }

  const user = await User.create({ name, email, password, role });
  return await User.findById(user._id).select("-password -__v");
};

export const updateUserStatus = async (userId, isActive) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // If user is deactivated, force logout by removing redis session
  if (!isActive && redisClient) {
    await redisClient.del(`session:${userId}`);
  }

  return user;
};

export const updateUserRole = async (userId, role) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  ).select("-password -__v");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
};
