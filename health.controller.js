const mongoose = require('mongoose');
const redis = require('redis');

const client = redis.createClient();

// Health check function
const healthCheck = async (req, res) => {
    try {
        // Check database connection
        const dbConnection = await mongoose.connection.db.admin().ping();

        // Check Redis connection
        client.ping((err, reply) => {
            if (err) {
                console.error('Redis connection error:', err);
                return res.status(500).json({ status: 'error', message: 'Redis connection failed' });
            }

            // If both checks pass
            res.status(200).json({
                status: 'ok',
                database: {
                    status: 'connected',
                    dbPing: dbConnection
                },
                redis: {
                    status: reply
                }
            });
        });
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({ status: 'error', message: 'Database connection failed' });
    }
};

module.exports = {
    healthCheck
};
