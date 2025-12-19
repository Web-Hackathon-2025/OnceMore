const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getCustomerBookings,
  getBookingById,
  updateBookingStatus,
  addMessageToBooking
} = require('../controllers/bookingController');

// Customer routes
router.post('/', protect, authorize('customer'), createBooking);
router.get('/my-bookings', protect, authorize('customer'), getCustomerBookings);
router.get('/:id', protect, getBookingById);
router.put('/:id/status', protect, updateBookingStatus);
router.post('/:id/messages', protect, addMessageToBooking);

// Service provider routes
router.get('/provider/my-bookings', protect, authorize('service_provider'), /* getProviderBookings */);
router.put('/:id/provider-status', protect, authorize('service_provider'), /* updateBookingStatusByProvider */);

module.exports = router;