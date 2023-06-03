const express = require('express');
const router = express.Router();
const droneController = require('../controllers/droneController');

//Register a new Drone
router.post('/', droneController.registerDrone);

//Get all Drones
router.get('/', droneController.getAllDrones);

//Det Drone by Serial Number
router.get('/:serialNumber', droneController.getDroneBySerialNumber);

module.exports = router;