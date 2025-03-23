const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const driverController = require('../controllers/driverController');

// Driver sets up role and teammate
router.post('/setupTeam', authenticate, driverController.setupTeam);

module.exports = router;