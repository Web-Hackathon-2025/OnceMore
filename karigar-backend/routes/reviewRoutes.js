const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  submitReview,
  getCustomerReviews
} = require('../controllers/reviewController');

// Customer routes
router.post('/', protect, authorize('customer'), submitReview);
router.get('/my-reviews', protect, authorize('customer'), getCustomerReviews);

// Public routes
router.get('/provider/:providerId', /* getProviderReviews */);

module.exports = router;