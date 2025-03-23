const User = require('../models/User');

// Ensure the customer has a registered vehicle
const checkVehicleDetails = async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (!user || !user.vehicles || user.vehicles.length === 0) {
        return res.status(400).json({ message: 'You must register a vehicle to request a ride' });
    }
    next();
};

module.exports = { checkVehicleDetails };