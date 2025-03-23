const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // The requesting user
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Assigned driver
    chaser: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }, // Assigned chaser
    pickupLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    stops: [
        {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true },
            arrivalTime: { type: Date }, // Time driver arrives at stop
            departureTime: { type: Date }, // Time driver leaves stop
            waitTime: { type: Number, default: 0 }, // Wait time at the stop (in minutes)
        },
    ],
    dropoffLocation: {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
    },
    distanceCalculated: { type: Number, default: 0 }, // System-calculated distance
    distanceFromOdometer: { type: Number, default: 0 }, // Chaser-reported odometer distance
    cost: { type: Number, required: true }, // Total ride cost
    tipAmount: { type: Number, default: 0 }, // Tip amount for the ride
    prepaymentAmount: { type: Number, default: 0 }, // Amount prepaid by the customer
    balanceDue: { type: Number, default: 0 }, // Outstanding balance (if any)
    refundAmount: { type: Number, default: 0 }, // Refund due (if overpaid)
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'prepaid', 'failed'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'cash'],
        default: 'card',
    },
    paymentDetails: {
        processor: { type: String },
        transactionId: { type: String },
        paidAt: { type: Date },
    },
    status: { type: String, enum: ['in_progress', 'completed'], default: 'in_progress' },
});

module.exports = mongoose.model('Ride', rideSchema);