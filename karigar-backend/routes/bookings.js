const express = require('express');
const router = express.Router();
const {
    getProviderBookings,
    getBookingHistory,
    getBooking,
    acceptBooking,
    rejectBooking,
    rescheduleBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Provider routes
router.get('/provider', authorize('service_provider'), getProviderBookings);
router.get('/provider/history', authorize('service_provider'), getBookingHistory);
router.get('/:id', getBooking);
router.put('/:id/accept', authorize('service_provider'), acceptBooking);
router.put('/:id/reject', authorize('service_provider'), rejectBooking);
router.put('/:id/reschedule', authorize('service_provider'), rescheduleBooking);

module.exports = router;

