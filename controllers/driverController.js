const User = require('../models/User');

// Driver sets up role and teammate
const setupTeam = async (req, res) => {
    try {
        const { role, teammateUsername } = req.body;

        if (!['driver', 'chaser'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role selected' });
        }

        const teammate = await User.findOne({ username: teammateUsername });
        if (!teammate || teammate.role !== 'driver') {
            return res.status(400).json({ message: 'Invalid teammate username or role' });
        }

        const user = await User.findById(req.user._id);
        user.team = {
            teammateUsername,
            role,
        };

        await user.save();
        res.status(200).json({ message: 'Team setup successful', team: user.team });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { setupTeam };