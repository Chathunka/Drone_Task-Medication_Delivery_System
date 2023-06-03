const express = require('express');
const router = express.Router();
const medicationController = require('../controllers/medicationController');

// Load medications onto a drone
router.post('/:droneSerial/loadMedication', medicationController.loadMedications);

// Get loaded medications for a drone
router.get('/:droneSerial/getMedication', medicationController.getLoadedMedications);

module.exports = router;