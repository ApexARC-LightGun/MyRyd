const square = require('square'); // Square SDK
const Ride = require('../models/Ride');

// Initialize Square client
const client = new square.Client({
    accessToken: process.env.SQUARE_ACCESS_TOKEN, // Store securely in `.env`
    environment: 'sandbox', // Use 'production' for live payments
});

// Process card payment
const processCardPayment = async (rideId, paymentAmount) => {
    try {
        const paymentsApi = client.paymentsApi;

        // Create a payment request
        const response = await paymentsApi.createPayment({
            sourceId: 'CARD_SOURCE_ID', // Replace with card token from frontend
            amountMoney: {
                amount: paymentAmount * 100, // Amount in cents
                currency: 'USD',
            },
            idempotencyKey: `ride-${rideId}`, // Ensure payment is processed only once
        });

        return {
            success: true,
            transactionId: response.result.payment.id,
        };
    } catch (error) {
        console.error('Payment error:', error);
        return { success: false, error: error.message };
    }
};

// Log cash payment
const logCashPayment = async (rideId, paymentAmount) => {
    // Record the cash payment manually
    return {
        success: true,
        transactionId: null, // No transaction ID for cash
    };
};

module.exports = { processCardPayment, logCashPayment };