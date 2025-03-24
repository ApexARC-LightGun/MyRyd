const { SquareClient, SquareEnvironment, SquareError } = require('square'); // Import necessary objects
require('dotenv').config(); // Load environment variables from .env file

// Initialize the Square Client
const client = new SquareClient({
    token: process.env.SQUARE_ACCESS_TOKEN, // Use the token from your .env file
    environment: SquareEnvironment.Sandbox, // Use Sandbox for testing or SquareEnvironment.Production for live
});

// Function to process card payments
const processCardPayment = async (rideId, paymentAmount, sourceId) => {
    try {
        const response = await client.payments.createPayment({
            sourceId: sourceId, // Tokenized card details from the frontend
            idempotencyKey: `ride-${rideId}`, // Unique key to prevent duplicate charges
            amountMoney: {
                amount: paymentAmount, // Payment amount in cents (e.g., $10 = 1000)
                currency: 'USD', // Specify currency
            },
        });

        // Return success response
        return {
            success: true,
            transactionId: response.payment.id, // Payment successful, return transaction ID
        };
    } catch (error) {
        if (error instanceof SquareError) {
            error.errors.forEach((e) => {
                console.error(`Error [${e.category}]: ${e.code} - ${e.detail}`);
            });
        } else {
            console.error('Unexpected error occurred:', error); // Log any unexpected errors
        }
        return { success: false, error: error.message }; // Return error message
    }
};

// Function to log cash payments (optional)
const logCashPayment = async (rideId, paymentAmount) => {
    console.log(`Cash payment recorded for Ride ID: ${rideId}, Amount: $${(paymentAmount / 100).toFixed(2)}`);
    return { success: true, transactionId: null }; // No transaction ID for cash payments
};

module.exports = { processCardPayment, logCashPayment };