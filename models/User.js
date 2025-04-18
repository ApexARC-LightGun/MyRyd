const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    make: { type: String },
    model: { type: String },
    color: { type: String },
    licensePlate: { type: String },
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'driver', 'chaser', 'admin'], default: 'user' },
    vehicles: [vehicleSchema],
    revenue: { type: Number, default: 0 }, // Total revenue generated by the customer
    notes: { type: [String], default: [] }, // Admin notes about the customer
    status: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
});

module.exports = mongoose.model('User', userSchema);