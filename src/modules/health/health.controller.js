import mongoose from "mongoose";
import redisClient from "../../config/redis.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const getHealth = asyncHandler(async (req, res) => {
    const healthStatus = {
        status: "UP",
        timestamp: new Date().toISOString(),
        services: {
            api: "UP",
            database: "DOWN",
            cache: "DOWN",
        },
        uptime: process.uptime(),
    };

    try {
        if (mongoose.connection.readyState === 1) {
            healthStatus.services.database = "UP";
        }
    } catch (error) {
        healthStatus.services.database = "DOWN";
    }

    try {
        if (redisClient) {
            await redisClient.ping();
            healthStatus.services.cache = "UP";
        } else {
            healthStatus.services.cache = "NOT_CONFIGURED";
        }
    } catch (error) {
        healthStatus.services.cache = "DOWN";
    }

    const serviceValues = Object.values(healthStatus.services);
    const allUp = serviceValues.every((s) => s === "UP" || s === "NOT_CONFIGURED");
    const hasFailure = serviceValues.some((s) => s === "DOWN");
    healthStatus.status = hasFailure ? "DEGRADED" : "UP";
    const statusCode = healthStatus.status === "UP" ? 200 : 503;

    sendResponse(res, statusCode, "Health status retrieved", healthStatus);
});