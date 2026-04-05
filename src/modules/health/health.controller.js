// health.controller.js

// Importing necessary libraries or modules
class HealthController {
    // Health check method
    getHealth(req, res) {
        res.status(200).json({ status: 'UP', time: new Date().toISOString() });
    }
}

module.exports = new HealthController();