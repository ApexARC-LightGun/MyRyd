const Ride = require('../models/Ride'); // Import Ride model
const { processCardPayment, logCashPayment } = require('../services/paymentService'); // Import payment services
const { calculateRideCost } = require('../services/rideService'); // Import ride cost calculation service

// Request a ride
const requestRide = async (req, res) => {
    try {
        // Validate request body fields
        const { pickupLocation, dropoffLocation, paymentMethod, sourceId } = req.body;
        if (!pickupLocation || !dropoffLocation || !paymentMethod) {
            return res.status(400).json({ message: 'Missing required fields.' });
        }

        // Calculate ride cost (example calculation function)
        const rideCost = calculateRideCost(pickupLocation, dropoffLocation);

        // Process payment
        let paymentResult;
        if (paymentMethod === 'card') {
            if (!sourceId) {
                return res.status(400).json({ message: 'Missing card source ID for payment.' });
            }

            paymentResult = await processCardPayment('example-ride-id', rideCost, sourceId);

            if (!paymentResult.success) {
                return res.status(400).json({ message: 'Payment failed', error: paymentResult.error });
            }
        } else if (paymentMethod === 'cash') {
            paymentResult = await logCashPayment('example-ride-id', rideCost);
        } else {
            return res.status(400).json({ message: 'Invalid payment method.' });
        }

        // Additional logic to create a ride (storing data, etc.)
        const newRide = new Ride({
            user: req.user._id, // Ensure req.user is populated by authentication middleware
            pickupLocation,
            dropoffLocation,
            cost: rideCost,
            paymentStatus: paymentMethod === 'card' ? 'prepaid' : 'pending',
            paymentMethod,
        });

        await newRide.save();

        res.status(201).json({ message: 'Ride requested successfully', ride: newRide });
    } catch (error) {
        console.error('Error requesting ride:', error);

        // Avoid exposing internal details to the client
        res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
    }
};

// Complete a ride
const completeRide = async (req, res) => {
    try {
        const { rideId } = req.body; // Extract the ride ID from the request

        if (!rideId) {
            return res.status(400).json({ message: 'Ride ID is required.' });
        }

        // Fetch the ride from the database
        const ride = await Ride.findById(rideId);
        if (!ride) {
            return res.status(404).json({ message: 'Ride not found.' });
        }

        if (ride.status === 'completed') {
            return res.status(400).json({ message: 'Ride is already completed.' });
        }

        // Update ride status to completed
        ride.status = 'completed';
        await ride.save();

        res.status(200).json({ message: 'Ride completed successfully', ride });
    } catch (error) {
        console.error('Error completing ride:', error);

        // Avoid exposing internal details to the client
        res.status(500).json({ message: 'An unexpected error occurred. Please try again.' });
    }
};

// Export both controller functions
module.exports = { requestRide, completeRide };