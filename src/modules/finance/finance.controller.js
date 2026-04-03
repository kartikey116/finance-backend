import * as financeService from "./finance.service.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const createRecord = asyncHandler(async (req, res) => {
  const record = await financeService.createRecord(req.body, req.user.id);
  sendResponse(res, 201, "Record created successfully", record);
});

export const listRecords = asyncHandler(async (req, res) => {
  const data = await financeService.listRecords(req.query);
  sendResponse(res, 200, "Records retrieved successfully", data);
});

export const getRecordById = asyncHandler(async (req, res) => {
  const record = await financeService.getRecordById(req.params.id);
  sendResponse(res, 200, "Record retrieved successfully", record);
});

export const updateRecord = asyncHandler(async (req, res) => {
  const record = await financeService.updateRecord(req.params.id, req.body);
  sendResponse(res, 200, "Record updated successfully", record);
});

export const deleteRecord = asyncHandler(async (req, res) => {
  await financeService.deleteRecord(req.params.id);
  sendResponse(res, 200, "Record deleted successfully");
});
