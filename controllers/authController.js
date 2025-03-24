const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User signup
const signUp = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password for secure storage
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
            phone,
        });

        await user.save();

        // Redirect to login page after successful signup
        res.redirect('/auth/login');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).render('partials/error', { message: 'An unexpected error occurred during signup.' });
    }
};

// User login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).render('users/login', { message: 'Invalid email or password.' });
        }

        // Verify the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).render('users/login', { message: 'Invalid email or password.' });
        }

        // Generate a JWT token for authentication
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Redirect to profile or dashboard page after successful login
        res.redirect('/users/profile');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).render('partials/error', { message: 'An unexpected error occurred during login.' });
    }
};

module.exports = { signUp, login };