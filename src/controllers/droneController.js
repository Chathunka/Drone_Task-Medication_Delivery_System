const Drone = require('../models/modelDrone');
const BatteryLog = require('../models/modelBatteryLog');

//Create a new Drone
exports.registerDrone = (req, res) => {
    const { serialNumber, model, weightLimit, batteryCapacity } = req.body;

    const newDrone = new Drone({
        serialNumber,
        model,
        weightLimit,
        batteryCapacity,
        state:"IDLE",
    });

    newDrone.save()
    .then((drone) => {
        res.status(201).json(drone);
    })
    .catch((err) => {
        res.status(500).json({error: err});
    });
};

// Get a drone by serial number
exports.getDroneBySerialNumber = (req, res) => {
    const serialNumber = req.params.serialNumber;
  
    Drone.findOne({ serialNumber })
    .then((drone) => {
        if(!drone){
            res.status(404).json({ error: 'Drone not found' });
        }else{
            res.status(200).json(drone);
        }
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve the drone' });
    });
};

// Get all drones
exports.getAllDrones = (req, res) => {
    Drone.find({})
    .then((drones) => {
        res.status(200).json(drones);
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve drones' });
    });
};

// Update state of the drone
exports.updateDroneState = (req, res) => {
    const serialNumber = req.params.serialNumber;
    const newState = req.body.state;

    Drone.findOneAndUpdate({serialNumber}, {state:newState}, {new: true})
    .then((drone) => {
        if(!drone){
            res.status(404).json({error: "Drone not found"});
        }else{
            res.status(200).json(drone);
        }
    })
    .catch((err) => {
        res.status(500).json({error: err});
    });
};

// Delete a drone by serial number
exports.deleteDrone = (req, res) => {
    const serialNumber = req.params.serialNumber;
  
    Drone.findOneAndDelete({ serialNumber })
    .then((drone) => {
        if(!drone){
            res.status(404).json({ error: 'Drone not found' });
        }else{
            res.status(200).json({ message: 'Drone deleted successfully' });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to delete the drone' });
    });
};

// Check the drone battery level by serial number
exports.getDroneBatteryLevel = (req, res) => {
    const serialNumber = req.params.serialNumber;
  
    Drone.findOne({ serialNumber })
    .then((drone) => {
        if(!drone){
            res.status(404).json({ error: 'Drone not found' });
        }else{
            res.status(200).json({ batteryLevel: drone.batteryCapacity });
        }
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve the drone battery level' });
    });
};

// Update the battery level of a drone by serial number
exports.updateDroneBatteryLevel = (req, res) => {
    const serialNumber = req.params.serialNumber;
    const newBatteryLevel = req.body.batteryCapacity;
  
    Drone.findOneAndUpdate({ serialNumber }, { batteryCapacity: newBatteryLevel }, { new: true })
    .then((drone) => {
        if(!drone){
            res.status(404).json({ error: 'Drone not found' });
        }else{
            res.status(200).json(drone);
        }
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to update the drone battery level' });
    });
};

// Check available drones for loading
exports.getAvailableDronesForLoading = (req, res) => {
    Drone.find({ $or:[{ state: 'IDLE'}, { state: 'LOADING'}, { state: 'DELIVERED'}], batteryCapacity: { $gte: 25 } })
    .then((drones) => {
        res.status(200).json(drones);
    })
    .catch((err) => {
        res.status(500).json({ error: 'Failed to retrieve available drones for loading' });
    });
};

//get batteryLogs for specific drone
exports.getBatteryLogs = async (req, res) => {
    try {
        const { serialNumber } = req.params;
        // Find the drone with the specified serial number
        const drone = await Drone.findOne({ serialNumber });
        if (!drone) {
            return res.status(404).json({ error: 'Drone not found' });
        }
        // Find battery logs for the specified drone
        const batteryLogs = await BatteryLog.find({ drone: drone._id })
            .select('timestamp batteryLevel');
        // Transform the battery logs
        const transformedLogs = batteryLogs.map(log => ({
            timestamp: log.timestamp,
            batteryLevel: log.batteryLevel,
        }));
        res.json({batteryLogs: transformedLogs});
    } catch (error) {
        res.status(500).json({ error: error });
    }
};