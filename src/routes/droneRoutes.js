const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');

//Register a new Drone
router.post('/', droneController.registerDrone);

//Get all Drones
router.get('/', droneController.getAllDrones);

// Check available drones for loading
router.get('/available-for-loading', droneController.getAvailableDronesForLoading);

//Det Drone by Serial Number
router.get('/:serialNumber', droneController.getDroneBySerialNumber);

// Update the state of a drone
router.put('/:serialNumber/state', droneController.updateDroneState);

// Update the drone battery level for a given drone
router.put('/:serialNumber/set-battery-level', droneController.updateDroneBatteryLevel);

// Check the drone battery level for a given drone
router.get('/:serialNumber/get-battery-level', droneController.getDroneBatteryLevel);

// Delete a drone
router.delete('/:serialNumber', droneController.deleteDrone);

// get battery logs for drone by Serial number
router.get('/:serialNumber/battery-logs', droneController.getBatteryLogs);

module.exports = router;