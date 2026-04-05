import express from "express";
import * as userController from "./user.controller.js";
import * as userValidation from "./user.validation.js";
import { validate } from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";

const router = express.Router();

// All user routes below require authentication and Admin role
router.use(protect);
router.use(restrictTo("Admin"));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management (Admin only)
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: List all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 */
router.get("/", userController.getAllUsers);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password, role]
 *             properties:
 *               name: { type: string }
 *               email: { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               role: { type: string, enum: [Viewer, Analyst, Admin] }
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post("/", validate(userValidation.createUserSchema), userController.createUser);

/**
 * @swagger
 * /api/users/{id}/status:
 *   put:
 *     summary: Update user status
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [Active, Inactive, Suspended] }
 *     responses:
 *       200:
 *         description: Status updated successfully
 */
router.put("/:id/status", validate(userValidation.updateStatusSchema), userController.updateUserStatus);

/**
 * @swagger
 * /api/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [Viewer, Analyst, Admin] }
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
router.put("/:id/role", validate(userValidation.updateRoleSchema), userController.updateUserRole);

export default router;
