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

export const listRecords = async (query, user) => {
  const { type, category, search, startDate, endDate, page = "1", limit = "10" } = query;
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);

  const filter = {};
  
  // Role-based filtering: Viewers only see their own records
  if (user.role === "Viewer") {
    filter.createdBy = user.id;
  }

  if (type) filter.type = type.toLowerCase();
  if (category) filter.category = category;
  
  if (search) {
    filter.$or = [
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { notes: { $regex: search, $options: "i" } }
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

export const getRecordById = async (id, user) => {
  const record = await Finance.findById(id).populate("createdBy", "name email");
  
  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  // Ownership check for Viewers
  if (user.role === "Viewer" && record.createdBy._id.toString() !== user.id) {
    throw new ApiError(403, "You do not have permission to view this record");
  }

  return record;
};

export const updateRecord = async (id, updateData, user) => {
  const record = await Finance.findById(id);

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  // Extra safety: only Admins can reach this from routes, but good for service integrity
  if (user.role !== "Admin") {
     throw new ApiError(403, "Only Admins can update records");
  }

  const updatedRecord = await Finance.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  await invalidateDashboardCache();
  return updatedRecord;
};

export const deleteRecord = async (id, user) => {
  const record = await Finance.findById(id);

  if (!record) {
    throw new ApiError(404, "Financial record not found");
  }

  if (user.role !== "Admin") {
    throw new ApiError(403, "Only Admins can delete records");
  }

  record.isDeleted = true;
  await record.save();

  await invalidateDashboardCache();
  return record;
};
