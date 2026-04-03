import * as userService from "./user.service.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await userService.getAllUsers();
  sendResponse(res, 200, "Users retrieved successfully", users);
});

export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.createUser(req.body);
  sendResponse(res, 201, "User created successfully", user);
});

export const updateUserStatus = asyncHandler(async (req, res) => {
  const user = await userService.updateUserStatus(req.params.id, req.body.isActive);
  sendResponse(res, 200, "User status updated successfully", user);
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await userService.updateUserRole(req.params.id, req.body.role);
  sendResponse(res, 200, "User role updated successfully", user);
});
