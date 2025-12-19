const express = require('express');
const router = express.Router();
const {
    createService,
    getMyServices,
    getService,
    updateService,
    deleteService
} = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Service provider routes
router.post('/', authorize('service_provider'), createService);
router.get('/my-services', authorize('service_provider'), getMyServices);
router.get('/:id', getService);
router.put('/:id', authorize('service_provider'), updateService);
router.delete('/:id', authorize('service_provider'), deleteService);

module.exports = router;

