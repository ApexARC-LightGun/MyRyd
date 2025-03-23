const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkVehicleDetails } = require('../middleware/vehicleMiddleware');
const rideController = require('../controllers/rideController');

// Request a ride
router.post('/request', authenticate, checkVehicleDetails, rideController.requestRide);

// Complete a ride
router.post('/complete', authenticate, rideController.completeRide);

module.exports = router;