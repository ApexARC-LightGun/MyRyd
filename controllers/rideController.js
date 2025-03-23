const Ride = require('../models/Ride');
const AdminSettings = require('../models/AdminSettings');
const { processCardPayment, logCashPayment } = require('../services/paymentService');
const { calculateRideCost } = require('../services/rideService');

// Request a ride
const requestRide = async (req, res) => {
    try {
        const { pickupLocation, stops, dropoffLocation, selectedVehicle, paymentMethod } = req.body;

        // Calculate estimated cost
        const estimatedDistance = calculateDistance(pickupLocation, dropoffLocation, stops);
        const cost = calculateRideCost(estimatedDistance, ADMIN_MINIMUM_PRICE, ADMIN_COST_PER_UNIT, 0);

        // Prepayment logic
        let paymentResult;
        if (paymentMethod === 'card') {
            paymentResult = await processCardPayment('ride-request-prepay', cost);
            if (!paymentResult.success) {
                return res.status(400).json({ message: 'Prepayment failed', error: paymentResult.error });
            }
        }

        // Create the ride
        const ride = new Ride({
            user: req.user._id,
            pickupLocation,
            stops,
            dropoffLocation,
            cost,
            prepaymentAmount: paymentMethod === 'card' ? cost : 0,
            paymentStatus: paymentMethod === 'card' ? 'prepaid' : 'pending',
            paymentMethod,
        });

        await ride.save();
        res.status(201).json({ message: 'Ride requested successfully with prepayment', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Complete ride
const completeRide = async (req, res) => {
    try {
        const { rideId, tipAmount } = req.body; // Tip amount from the customer
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        // Final cost calculation
        const finalDistance = ride.distanceFromOdometer || ride.distanceCalculated; // Use odometer if available
        const finalCost = calculateRideCost(finalDistance, ADMIN_MINIMUM_PRICE, ADMIN_COST_PER_UNIT, ride.waitCost);

        let balanceDue = 0;
        let refundAmount = 0;
        if (ride.prepaymentAmount > finalCost) {
            refundAmount = ride.prepaymentAmount - finalCost;
        } else if (ride.prepaymentAmount < finalCost) {
            balanceDue = finalCost - ride.prepaymentAmount;
        }

        // Update ride with final costs and tip
        ride.balanceDue = balanceDue;
        ride.refundAmount = refundAmount;
        ride.tipAmount = tipAmount;
        ride.paymentStatus = balanceDue > 0 ? 'pending' : 'completed';
        ride.status = 'completed';
        await ride.save();

        // Distribute tip between driver and chaser
        const driverShare = tipAmount * 0.7; // 70% to driver
        const chaserShare = tipAmount * 0.3; // 30% to chaser

        const driver = await Driver.findById(ride.driver);
        const chaser = await Driver.findById(ride.chaser);

        if (driver) {
            driver.revenue += driverShare;
            await driver.save();
        }

        if (chaser) {
            chaser.revenue += chaserShare;
            await chaser.save();
        }

        res.status(200).json({
            message: 'Ride completed with tip processed',
            ride,
            balanceDue,
            refundAmount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { requestRide, completeRide };