import * as authService from "./auth.service.js";
import { sendResponse, asyncHandler, ApiError } from "../../utils/apiResponse.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = asyncHandler(async (req, res) => {
  const result = await authService.registerUser(req.body);
  
  res.cookie("refresh_token", result.refreshToken, cookieOptions);
  
  sendResponse(res, 201, "User registered successfully", {
    user: result.user,
    accessToken: result.accessToken
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await authService.loginUser(email, password);
  
  res.cookie("refresh_token", result.refreshToken, cookieOptions);

  sendResponse(res, 200, "User logged in successfully", {
    user: result.user,
    accessToken: result.accessToken
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const oldRefreshToken = req.cookies.refresh_token;
  
  if (!oldRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  const result = await authService.refreshAccessToken(oldRefreshToken);
  
  res.cookie("refresh_token", result.refreshToken, cookieOptions);

  sendResponse(res, 200, "Token refreshed successfully", {
    accessToken: result.accessToken
  });
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logoutUser(req.user.id);
  res.clearCookie("refresh_token");
  sendResponse(res, 200, "User logged out successfully");
});