const mongoose = require('mongoose');
const Medication = require('../models/modelMedication');
const Drone = require('../models/modelDrone');

// Load medications onto a drone
exports.loadMedications = async (req, res) => {
    const serialNumber = req.params.droneSerial;
    const medicationsData = req.body.medications;
  
    try {
        // Find the drone by serial number
        const drone = await Drone.findOne({ serialNumber });
        if(!drone){
            return res.status(404).json({ error: 'Drone not found' });
        }

        // Check if the drone is in a valid state for loading medications
        if(drone.state !== 'IDLE' && drone.state !== 'LOADING'){
            return res.status(400).json({ error: 'Drone is not in the IDLE or LOADING state' });
        }
        if(drone.batteryCapacity < 25){
            return res.status(400).json({ error: 'Drone battery level is below 25%' });
        }

        // Calculate the total weight of the medications
        const totalWeight = medicationsData.reduce((sum, medication) => sum + medication.weight, 0);

        // Check if the drone can carry the total weight of the medications
        if(totalWeight > drone.weightLimit){
            return res.status(400).json({ error: 'Medication weight exceeds drone weight limit' });
        }

        // Save the medications to the Medication collection
        const savedMedications = await Medication.insertMany(medicationsData);

        // Update the drone's state to LOADING and save the medications to the drone
        if(totalWeight == drone.weightLimit){
            drone.state = 'LOADED';
        }else{
            drone.state = 'LOADING';
        }
        drone.medications = savedMedications.map((medication) => medication._id);
        const updatedDrone = await drone.save();

        res.status(200).json(updatedDrone);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to load medications onto the drone' });
    }
};

// Get loaded medications for a drone
exports.getLoadedMedications = async (req, res) => {
    const serialNumber = req.params.droneSerial;
  
    try {
        // Find the drone by serial number and populate the medications field with complete medication documents
        const drone = await Drone.findOne({ serialNumber }).populate('medications');
        if(!drone){
            return res.status(404).json({ error: 'Drone not found' });
        }

        // Check if the drone is in a valid state for retrieving loaded medications
        const validStates = ['LOADING', 'LOADED', 'DELIVERING', 'DELIVERED'];
        if(!validStates.includes(drone.state)){
            return res.status(400).json({ error: 'Drone is not in a state where medications are loaded' });
        }

        res.status(200).json(drone.medications);
    } catch(err) {
        console.error('Error:', err);
        res.status(500).json({ error: 'Failed to retrieve loaded medications' });
    }
};