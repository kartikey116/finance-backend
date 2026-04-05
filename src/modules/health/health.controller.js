import mongoose from "mongoose";
import redisClient from "../../config/redis.js";
import { sendResponse, asyncHandler } from "../../utils/apiResponse.js";

export const getHealth = asyncHandler(async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        let dbPing = null;
        
        if (dbStatus === 'connected') {
            const admin = mongoose.connection.db.admin();
            dbPing = await admin.ping();
        }

        let redisStatus = 'disconnected';
        if (redisClient) {
            try {
                const reply = await redisClient.ping();
                redisStatus = reply;
            } catch (err) {
                console.error('Redis connection error:', err);
                redisStatus = 'error';
            }
        }

        const isHealthy = dbStatus === 'connected' && redisStatus === 'PONG';
        const statusCode = isHealthy ? 200 : 500;

        res.status(statusCode).json({
            status: isHealthy ? 'ok' : 'error',
            database: {
                status: dbStatus,
                dbPing: dbPing
            },
            redis: {
                status: redisStatus
            },
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    } catch (error) {
        console.error('Health Check Error:', error);
        res.status(500).json({ status: 'error', message: 'Health check failed' });
    }
});