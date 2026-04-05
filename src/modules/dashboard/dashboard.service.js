import mongoose from "mongoose";
import Finance from "../finance/finance.model.js";
import { getCache, setCache } from "../../cache/cache.service.js";

export const getDashboardSummary = async (user) => {
  const isViewer = user && user.role === "Viewer";
  const cacheKey = isViewer ? `dashboard:summary:user:${user.id}` : "dashboard:summary:general";
  const cachedData = await getCache(cacheKey);

  if (cachedData) {
    cachedData._wasCached = true;
    return cachedData;
  }

  const matchFilter = { isDeleted: false };

  if (isViewer) {
    matchFilter.createdBy = new mongoose.Types.ObjectId(user.id);
  }

  const matchStage = { $match: matchFilter };

  const totalsInfo = await Finance.aggregate([
    matchStage,
    {
      $group: {
        _id: "$type",
        totalAmount: { $sum: "$amount" },
      },
    },
  ]);

  let totalIncome = 0;
  let totalExpense = 0;

  totalsInfo.forEach((item) => {
    if (item._id === "income") totalIncome = item.totalAmount;
    if (item._id === "expense") totalExpense = item.totalAmount;
  });

  const netBalance = totalIncome - totalExpense;
  const categoryTotals = await Finance.aggregate([
    matchStage,
    {
      $group: {
        _id: { type: "$type", category: "$category" },
        total: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        type: "$_id.type",
        category: "$_id.category",
        total: 1,
      },
    },
  ]);

  const recentFilter = isViewer ? { createdBy: user.id } : {};
  const recentActivity = await Finance.find(recentFilter)
    .sort({ date: -1, createdAt: -1 })
    .limit(5)
    .select("-__v");

  const monthlyTrends = await Finance.aggregate([
    matchStage,
    {
      $group: {
        _id: {
          year: { $year: "$date" },
          month: { $month: "$date" },
          type: "$type"
        },
        total: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.month": 1 }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        month: "$_id.month",
        type: "$_id.type",
        total: 1
      }
    }
  ]);

  const weeklyTrends = await Finance.aggregate([
    matchStage,
    {
      $group: {
        _id: {
          year: { $isoWeekYear: "$date" },
          week: { $isoWeek: "$date" },
          type: "$type"
        },
        total: { $sum: "$amount" }
      }
    },
    {
      $sort: { "_id.year": 1, "_id.week": 1 }
    },
    {
      $project: {
        _id: 0,
        year: "$_id.year",
        week: "$_id.week",
        type: "$_id.type",
        total: 1
      }
    }
  ]);

  const summary = {
    totalIncome,
    totalExpense,
    netBalance,
    categoryTotals,
    recentActivity,
    monthlyTrends,
    weeklyTrends,
  };

  await setCache(cacheKey, summary, 3600);

  return summary;
};
