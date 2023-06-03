const Drone = require('../models/modelDrone');

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