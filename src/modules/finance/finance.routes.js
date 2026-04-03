import express from "express";
import * as financeController from "./finance.controller.js";
import * as financeValidation from "./finance.validation.js";
import { validate } from "../../middleware/validate.js";
import { protect } from "../../middleware/auth.middleware.js";
import { restrictTo } from "../../middleware/role.middleware.js";

const router = express.Router();

router.use(protect); // All routes require authentication

// Admin only routes for mutating data
router.post(
  "/",
  restrictTo("Admin"),
  validate(financeValidation.createFinanceSchema),
  financeController.createRecord
);

router.put(
  "/:id",
  restrictTo("Admin"),
  validate(financeValidation.updateFinanceSchema),
  financeController.updateRecord
);

router.delete(
  "/:id",
  restrictTo("Admin"),
  validate(financeValidation.getFinanceByIdSchema), // validating ID
  financeController.deleteRecord
);

// Analyst and Admin routes for reading distinct records
router.get(
  "/",
  restrictTo("Analyst", "Admin"),
  validate(financeValidation.listFinanceSchema),
  financeController.listRecords
);

router.get(
  "/:id",
  restrictTo("Analyst", "Admin"),
  validate(financeValidation.getFinanceByIdSchema),
  financeController.getRecordById
);

export default router;
