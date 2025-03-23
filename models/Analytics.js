const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
    totalRides: { type: Number, default: 0 }, // Total completed rides
    totalEarnings: { type: Number, default: 0 }, // Total revenue from rides
    totalWaitTime: { type: Number, default: 0 }, // Total wait time in minutes
    totalDriveTime: { type: Number, default: 0 }, // Total driving time in minutes
    totalDistance: { type: Number, default: 0 }, // Total distance covered in kilometers
    rideSummaries: [
        {
            rideId: { type: mongoose.Schema.Types.ObjectId, ref: 'Ride' }, // Reference to Ride
            rideCost: { type: Number }, // Cost of the ride
            waitTime: { type: Number }, // Wait time for the ride in minutes
            driveTimeExpected: { type: Number }, // Expected drive time
            driveTimeActual: { type: Number }, // Actual drive time
        },
    ],
    lastUpdated: { type: Date, default: Date.now }, // Last update timestamp
});

module.exports = mongoose.model('Analytics', analyticsSchema);