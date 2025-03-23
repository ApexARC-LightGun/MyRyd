const User = require('../models/User');

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { name, phone } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.phone = phone || user.phone;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Add a vehicle to user's account
const addVehicle = async (req, res) => {
    try {
        const { make, model, color, licensePlate } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const newVehicle = {
            make,
            model,
            color,
            licensePlate,
        };

        user.vehicles.push(newVehicle);
        await user.save();

        res.status(200).json({ message: 'Vehicle added successfully', vehicles: user.vehicles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Remove a vehicle from user's account
const removeVehicle = async (req, res) => {
    try {
        const { licensePlate } = req.body;

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.vehicles = user.vehicles.filter((vehicle) => vehicle.licensePlate !== licensePlate);
        await user.save();

        res.status(200).json({ message: 'Vehicle removed successfully', vehicles: user.vehicles });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateProfile, addVehicle, removeVehicle };