const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkVehicleDetails } = require('../middleware/vehicleMiddleware');
const rideController = require('../controllers/rideController');

console.log(authenticate); // Should log a function
console.log(checkVehicleDetails); // Should log a function
console.log(rideController); // Should log an object with { requestRide: [Function], completeRide: [Function] }

// Request a ride
router.post('/request', authenticate, checkVehicleDetails, rideController.requestRide);

// Complete a ride
router.post('/complete', authenticate, rideController.completeRide);

module.exports = router;