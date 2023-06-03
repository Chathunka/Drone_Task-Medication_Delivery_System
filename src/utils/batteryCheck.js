const cron = require('node-cron');
const Drone = require('../models/modelDrone');
const BatteryLog = require('../models/modelBatteryLog');

// Define the batteryChecker object
const batteryChecker = {
    start: () => {
        // Schedule the battery check task to run every 10 seconds
        cron.schedule('*/10 * * * * *', async () => {
            try {
                // Find all drones
                const drones = await Drone.find();

                // Iterate over each drone
                for (const drone of drones) {
                    // Log the battery level
                    const batteryLog = new BatteryLog({
                        drone: drone._id,
                        batteryLevel: drone.batteryCapacity,
                        timestamp: Date.now()
                    });

                    await batteryLog.save();
                }

                console.log('Battery check task completed successfully');
            } catch (error) {
                console.error('Battery check task encountered an error:', error);
            }
        });
    }
};

module.exports = batteryChecker;
