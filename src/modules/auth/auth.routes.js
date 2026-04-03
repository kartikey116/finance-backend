import express from "express";
import * as authController from "./auth.controller.js";
import * as authValidation from "./auth.validation.js";
import { validate } from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", validate(authValidation.registerSchema), authController.register);
router.post("/login", validate(authValidation.loginSchema), authController.login);
router.post("/logout", protect, authController.logout);

export default router;
