const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const validatePhone = require('../middleware/validatePhone');
const userController = require('../controllers/userController');

// Update user profile
router.post('/profile', authenticate, validatePhone, userController.updateProfile);

// Add a vehicle to the user's account
router.post('/vehicles/add', authenticate, userController.addVehicle);

// Remove a vehicle from the user's account
router.post('/vehicles/remove', authenticate, userController.removeVehicle);

module.exports = router;