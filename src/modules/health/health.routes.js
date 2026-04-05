import express from "express";
import * as healthController from "./health.controller.js";
const router = express.Router();
/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Get system health status
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: System is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status: { type: string, example: "UP" }
 *                 timestamp: { type: string, format: "date-time" }
 *                 services:
 *                   type: object
 *                   properties:
 *                     api: { type: string, example: "UP" }
 *                     database: { type: string, example: "UP" }
 *                     cache: { type: string, example: "NOT_CONFIGURED" }
 *                 uptime: { type: number, example: 12.45 }
 *       503:
 *         description: System is degraded
 */
router.get("/", healthController.getHealth);
export default router;