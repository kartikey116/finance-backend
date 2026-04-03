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

router.get("/", userController.getAllUsers);
router.post("/", validate(userValidation.createUserSchema), userController.createUser);
router.put("/:id/status", validate(userValidation.updateStatusSchema), userController.updateUserStatus);
router.put("/:id/role", validate(userValidation.updateRoleSchema), userController.updateUserRole);

export default router;
