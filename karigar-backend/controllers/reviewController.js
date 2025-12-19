const Review = require('../models/Review');
const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');

// Submit a review
exports.submitReview = async (req, res) => {
  try {
    const { bookingId, rating, comment, images } = req.body;
    const customerId = req.user.id;

    // Validate required fields
    if (!bookingId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide booking ID, rating, and comment'
      });
    }

    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId)
      .populate('serviceProvider');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking belongs to customer
    if (booking.customer.toString() !== customerId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to review this booking'
      });
    }

    // Check if booking is completed
    if (booking.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Can only review completed bookings'
      });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({ booking: bookingId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Review already submitted for this booking'
      });
    }

    // Create review
    const review = await Review.create({
      booking: bookingId,
      customer: customerId,
      serviceProvider: booking.serviceProvider._id,
      rating: {
        overall: rating.overall,
        professionalism: rating.professionalism || rating.overall,
        quality: rating.quality || rating.overall,
        punctuality: rating.punctuality || rating.overall,
        communication: rating.communication || rating.overall
      },
      comment,
      images,
      isVerified: true
    });

    // Update booking with review reference
    booking.review = review._id;
    await booking.save();

    // Update service provider's average rating
    await updateServiceProviderRating(booking.serviceProvider._id);

    // Populate review with customer info
    const populatedReview = await Review.findById(review._id)
      .populate('customer', 'name profileImage');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review: populatedReview
    });
  } catch (error) {
    console.error('Submit review error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting review',
      error: error.message
    });
  }
};

// Helper function to update service provider rating
const updateServiceProviderRating = async (serviceProviderId) => {
  try {
    const reviews = await Review.find({ serviceProvider: serviceProviderId });
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, review) => sum + review.rating.overall, 0);
      const averageRating = totalRating / reviews.length;
      
      await ServiceProvider.findByIdAndUpdate(serviceProviderId, {
        'rating.average': averageRating,
        'rating.count': reviews.length
      });
    }
  } catch (error) {
    console.error('Update rating error:', error);
  }
};

// Get customer reviews
exports.getCustomerReviews = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ customer: customerId })
      .populate('serviceProvider')
      .populate({
        path: 'serviceProvider',
        populate: {
          path: 'user',
          select: 'name profileImage'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ customer: customerId });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      reviews
    });
  } catch (error) {
    console.error('Get customer reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};