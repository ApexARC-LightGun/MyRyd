const express = require('express');
const router = express.Router();
const validatePhone = require('../middleware/validatePhone');
const authController = require('../controllers/authController');

// Render signup form (GET)
router.get('/signup', (req, res) => {
    res.render('users/signup'); // Ensure this matches the location of signup.ejs
});

// Render login form (GET)
router.get('/login', (req, res) => {
    res.render('users/login'); // Ensure this matches the location of login.ejs
});

// User signup (POST)
router.post('/signup', validatePhone, authController.signUp);

// User login (POST)
router.post('/login', authController.login);

module.exports = router;