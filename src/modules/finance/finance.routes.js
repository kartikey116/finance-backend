import express from "express";
import * as financeController from "./finance.controller.js";
import * as financeValidation from "./finance.validation.js";
import { validate } from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(protect); // All routes require authentication

// Admin only routes for mutating data
/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Financial record management
 */

/**
 * @swagger
 * /api/finance:
 *   post:
 *     summary: Create a new financial record
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: Admin only. Create a new income or expense record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, amount, type, category, date]
 *             properties:
 *               description: { type: string }
 *               amount: { type: number }
 *               type: { type: string, enum: [Income, Expense] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       201:
 *         description: Record created successfully
 */
router.post(
  "/",
  restrictTo("Admin"),
  validate(financeValidation.createFinanceSchema),
  financeController.createRecord
);

/**
 * @swagger
 * /api/finance/{id}:
 *   put:
 *     summary: Update a financial record
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description: { type: string }
 *               amount: { type: number }
 *               type: { type: string, enum: [Income, Expense] }
 *               category: { type: string }
 *               date: { type: string, format: date }
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.put(
  "/:id",
  restrictTo("Admin"),
  validate(financeValidation.updateFinanceSchema),
  financeController.updateRecord
);

/**
 * @swagger
 * /api/finance/{id}:
 *   delete:
 *     summary: Delete a financial record
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: Admin only.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record deleted successfully
 */
router.delete(
  "/:id",
  restrictTo("Admin"),
  validate(financeValidation.getFinanceByIdSchema), // validating ID
  financeController.deleteRecord
);

/**
 * @swagger
 * /api/finance:
 *   get:
 *     summary: List financial records
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: Analyst and Admin only. Support for filtering and pagination.
 *     parameters:
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [Income, Expense] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of records retrieved successfully
 */
router.get(
  "/",
  restrictTo("Viewer", "Analyst", "Admin"),
  validate(financeValidation.listFinanceSchema),
  financeController.listRecords
);

/**
 * @swagger
 * /api/finance/{id}:
 *   get:
 *     summary: Get a financial record by ID
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     description: Viewer, Analyst, and Admin.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Record retrieved successfully
 */
router.get(
  "/:id",
  restrictTo("Viewer", "Analyst", "Admin"),
  validate(financeValidation.getFinanceByIdSchema),
  financeController.getRecordById
);

export default router;
