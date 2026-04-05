import * as dashboardService from "./dashboard.service.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const getSummary = asyncHandler(async (req, res) => {
  const summary = await dashboardService.getDashboardSummary(req.user);
  sendResponse(res, 200, "Dashboard summary retrieved successfully", summary);
});
