import express from "express";
import * as dashboardController from "./dashboard.controller.js";
import { protect } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(protect);

// Viewers, Analysts, and Admins can all view the dashboard
/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Aggregate financial data and analytics
 */

/**
 * @swagger
 * /api/dashboard/summary:
 *   get:
 *     summary: Get financial dashboard summary
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     description: Viewer, Analyst, and Admin. Provides aggregated data like total income, expenses, and balance.
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 */
router.get(
  "/summary",
  restrictTo("Viewer", "Analyst", "Admin"),
  dashboardController.getSummary
);

export default router;
