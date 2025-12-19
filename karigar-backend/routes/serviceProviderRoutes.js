const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    getAllServiceProviders,
    getServiceProviderById,
    getServiceProviderReviews,
    getServiceProviderAvailability
} = require('../controllers/serviceProviderController');

// Public routes
router.get('/', getAllServiceProviders);
router.get('/:id', getServiceProviderById);
router.get('/:id/reviews', getServiceProviderReviews);
router.get('/:id/availability', getServiceProviderAvailability);

// For now, comment out protected routes until you create the controllers
// Protected routes for service providers
// router.post('/', protect, authorize('service_provider'), createServiceProvider);
// router.put('/:id', protect, authorize('service_provider'), updateServiceProvider);

module.exports = router;