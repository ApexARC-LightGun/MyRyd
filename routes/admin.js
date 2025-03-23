const express = require('express');
const router = express.Router();
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// Update general settings
router.post('/settings', authenticate, authorizeRoles('admin'), adminController.updateSettings);

// Update pricing and wait time settings
router.post('/settings/pricing', authenticate, authorizeRoles('admin'), adminController.updatePricingSettings);

// Update tip options
router.post('/settings/tips', authenticate, authorizeRoles('admin'), adminController.updateTipOptions);

// Fetch analytics data
router.get('/analytics', authenticate, authorizeRoles('admin'), adminController.getAnalytics);

// Search customers by filters
router.get('/customers/search', authenticate, authorizeRoles('admin'), adminController.searchCustomers);

// View customer profile
router.get('/customers/:id', authenticate, authorizeRoles('admin'), adminController.viewCustomerProfile);

// View driver or chaser profile
router.get('/drivers/:id', authenticate, authorizeRoles('admin'), adminController.viewDriverProfile);

// Activate/Deactivate driver or chaser
router.post('/drivers/:id/status', authenticate, authorizeRoles('admin'), adminController.toggleDriverStatus);

// Manually assign a driver and chaser to a ride
router.post('/rides/manual-assign', authenticate, authorizeRoles('admin'), adminController.manualAssignDriver);

module.exports = router;