const express = require('express');
const router = express.Router();
const validatePhone = require('../middleware/validatePhone');
const authController = require('../controllers/authController');

// User signup
router.post('/signup', validatePhone, authController.signUp);

// User login
router.post('/login', authController.login);

module.exports = router;