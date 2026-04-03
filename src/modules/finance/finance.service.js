import Finance from "./finance.model.js";
import { ApiError } from "../../utils/apiResponse.js";
import { clearCachePattern } from "../../cache/cache.service.js";

const invalidateDashboardCache = async () => {
  await clearCachePattern("dashboard:summary:*");
};

export const createRecord = async (recordData, userId) => {
  const record = await Finance.create({ ...recordData, createdBy: userId });
  await invalidateDashboardCache();
  return record;
};

export const listRecords = async (query) => {
  const { type, category, search, startDate, endDate, page = "1", limit = "10" } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  
  if (search) {
    // Basic text search using regex across notes and category
    filter.$or = [
      { notes: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ];
  }
  
  if (startDate || endDate) {
    filter.date = {};
    if (startDate) filter.date.$gte = new Date(startDate);
    if (endDate) filter.date.$lte = new Date(endDate);
  }

  const skip = (pageNum - 1) * limitNum;

  const records = await Finance.find(filter)
    .sort({ date: -1 })
    .skip(skip)
    .limit(limitNum)
    .populate("createdBy", "name email");

  const total = await Finance.countDocuments(filter);

  return {
    records,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
    },
  };
};

export const getRecordById = async (id) => {
  const record = await Finance.findById(id).populate("createdBy", "name email");
  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }
  return record;
};

export const updateRecord = async (id, updateData) => {
  const record = await Finance.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }
  
  await invalidateDashboardCache();
  return record;
};

export const deleteRecord = async (id) => {
  // Use findByIdAndUpdate to toggle isDeleted flag (Soft Delete)
  const record = await Finance.findByIdAndUpdate(
    id, 
    { isDeleted: true },
    { new: true }
  );

  if (!record) {
    throw new ApiError(404, "Financial record not found or already deleted");
  }
  await invalidateDashboardCache();
  return record;
};
