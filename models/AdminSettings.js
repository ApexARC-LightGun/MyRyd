const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
    assignmentOption: {
        type: String,
        enum: ['queue', 'closest', 'hybrid'],
        default: 'queue', // Default to queue-based assignment
    },
    acceptableWaitBuffer: {
        type: Number, // Minutes to prioritize fairness in hybrid assignment
        default: 5,
    },
    minimumPrice: {
        type: Number, // Minimum cost for rides up to 1km
        required: true,
        default: 10,
    },
    costPerExtraUnit: {
        type: Number, // Cost for every 0.2km after 1km
        required: true,
        default: 0.5,
    },
    costPerMinute: {
        type: Number, // Cost per minute of wait time
        required: true,
        default: 1,
    },
    waitGraceTime: {
        type: Number, // Grace period for free waiting time (in minutes)
        required: true,
        default: 5,
    },
    tipOptions: {
        type: [Number], // Array of percentages or fixed amounts
        default: [10, 15, 20], // Default tip percentages
    },
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);