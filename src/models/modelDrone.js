const mongoose= require('mongoose');

const droneSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        required: true,
        unique: true,
        maxlength: 100,
    },
    model: {
        type: String,
        enum: ['Lightweight', 'Middleweight', 'Cruiserweight', 'Heavyweight'],
        required: true,
    },
    weightLimit: {
        type: Number,
        max: 500,
        required: true,
    },
    batteryCapacity: {
        type: Number,
        min: 0,
        max: 100,
        required: true,
    },
    state: {
        type: String,
        enum: ['IDLE', 'LOADING', 'LOADED', 'DELIVERING', 'DELIVERED', 'RETURNING'],
        required: true,
    },
    medications: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Medication',
        },
    ],
});

module.exports = mongoose.model('Drone', droneSchema);