const AdminSettings = require('../models/AdminSettings');
const Analytics = require('../models/Analytics');
const Driver = require('../models/Driver');
const Ride = require('../models/Ride');
const User = require('../models/User');

// Update admin settings
const updateSettings = async (req, res) => {
    try {
        const { assignmentOption, acceptableWaitBuffer } = req.body;

        let settings = await AdminSettings.findOne({});
        if (!settings) {
            settings = new AdminSettings();
        }

        settings.assignmentOption = assignmentOption || settings.assignmentOption;
        settings.acceptableWaitBuffer = acceptableWaitBuffer || settings.acceptableWaitBuffer;
        await settings.save();

        res.status(200).json({ message: 'Settings updated successfully', settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update pricing and wait time settings
const updatePricingSettings = async (req, res) => {
    try {
        const { minimumPrice, costPerExtraUnit, costPerMinute, waitGraceTime } = req.body;

        let settings = await AdminSettings.findOne({});
        if (!settings) {
            settings = new AdminSettings();
        }

        settings.minimumPrice = minimumPrice || settings.minimumPrice;
        settings.costPerExtraUnit = costPerExtraUnit || settings.costPerExtraUnit;
        settings.costPerMinute = costPerMinute || settings.costPerMinute;
        settings.waitGraceTime = waitGraceTime || settings.waitGraceTime;
        await settings.save();

        res.status(200).json({ message: 'Pricing and wait time settings updated successfully', settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update tip options
const updateTipOptions = async (req, res) => {
    try {
        const { tipOptions } = req.body;

        let settings = await AdminSettings.findOne({});
        if (!settings) {
            settings = new AdminSettings();
        }

        settings.tipOptions = tipOptions || settings.tipOptions;
        await settings.save();

        res.status(200).json({ message: 'Tip options updated successfully', tipOptions: settings.tipOptions });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Fetch analytics data
const getAnalytics = async (req, res) => {
    try {
        const analytics = await Analytics.findOne({});
        res.status(200).json(analytics);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manual assignment of rides
const manualAssignDriver = async (req, res) => {
    try {
        const { rideId, driverId, chaserId } = req.body;

        const ride = await Ride.findById(rideId);
        const driver = await Driver.findById(driverId);
        const chaser = await Driver.findById(chaserId);

        if (!ride || !driver || !chaser) {
            return res.status(400).json({ message: 'Invalid ride or driver/chaser' });
        }

        ride.driver = driver._id;
        ride.chaser = chaser._id;
        ride.status = 'assigned';
        await ride.save();

        driver.status = 'assigned';
        chaser.status = 'assigned';
        await driver.save();
        await chaser.save();

        res.status(200).json({ message: 'Ride manually assigned successfully', ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Search customers
const searchCustomers = async (req, res) => {
    try {
        const { name, phone, pickupAddress, dropoffAddress, licensePlate } = req.query;

        const query = {};
        if (name) query.name = { $regex: name, $options: 'i' };
        if (phone) query.phone = phone;
        if (licensePlate) query['vehicles.licensePlate'] = licensePlate;

        const rides = await Ride.find({
            ...(pickupAddress && { 'pickupLocation.address': { $regex: pickupAddress, $options: 'i' } }),
            ...(dropoffAddress && { 'dropoffLocation.address': { $regex: dropoffAddress, $options: 'i' } }),
        }).populate('user');

        const customers = await User.find(query);
        const customerResults = [...customers, ...rides.map((ride) => ride.user)];

        res.status(200).json({ message: 'Search results', customers: customerResults });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View customer profile
const viewCustomerProfile = async (req, res) => {
    try {
        const customerId = req.params.id;

        const customer = await User.findById(customerId);
        const rides = await Ride.find({ user: customerId });

        if (!customer) {
            return res.status(404).json({ message: 'Customer not found' });
        }

        res.status(200).json({
            customer,
            history: rides,
            notes: customer.notes,
            revenue: customer.revenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View driver/chaser profile
const viewDriverProfile = async (req, res) => {
    try {
        const driverId = req.params.id;

        const driver = await Driver.findById(driverId);
        const rides = await Ride.find({ driver: driverId });

        if (!driver) {
            return res.status(404).json({ message: 'Driver/Chaser not found' });
        }

        res.status(200).json({
            driver,
            history: rides,
            revenue: driver.revenue,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Activate/Deactivate driver/chaser
const toggleDriverStatus = async (req, res) => {
    try {
        const driverId = req.params.id;
        const { status } = req.body;

        const driver = await Driver.findById(driverId);

        if (!driver) {
            return res.status(404).json({ message: 'Driver/Chaser not found' });
        }

        driver.status = status;
        await driver.save();

        res.status(200).json({ message: `Driver/Chaser status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateSettings,
    updatePricingSettings,
    updateTipOptions,
    getAnalytics,
    manualAssignDriver,
    searchCustomers,
    viewCustomerProfile,
    viewDriverProfile,
    toggleDriverStatus,
};