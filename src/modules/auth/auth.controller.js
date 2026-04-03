import * as authService from "./auth.service.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  sendResponse(res, 201, "User registered successfully", result);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  
  // Set cookie for session (optional but secure method)
  res.cookie("session_token", result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 day
  });

  sendResponse(res, 200, "User logged in successfully", result);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.clearCookie("session_token");
  sendResponse(res, 200, "User logged out successfully");
});