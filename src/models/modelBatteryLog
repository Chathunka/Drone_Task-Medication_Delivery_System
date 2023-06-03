const mongoose = require('mongoose');

// Define the BatteryLog schema
const batteryLogSchema = new mongoose.Schema({
    drone: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Drone',
        required: true
    },
    batteryLevel: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Create the BatteryLog model
const BatteryLog = mongoose.model('BatteryLog', batteryLogSchema);

module.exports = BatteryLog;
