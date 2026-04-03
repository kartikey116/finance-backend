import express from "express";
import * as dashboardController from "./dashboard.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// Viewers, Analysts, and Admins can all view the dashboard
router.get(
  "/summary",
  restrictTo("Viewer", "Analyst", "Admin"),
  dashboardController.getSummary
);

export default router;
