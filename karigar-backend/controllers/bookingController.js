const Booking = require('../models/Booking');
const ServiceProvider = require('../models/ServiceProvider');
const User = require('../models/User');

// Create a new booking
exports.createBooking = async (req, res) => {
  try {
    const customerId = req.user.id;
    const {
      serviceProviderId,
      serviceType,
      description,
      address,
      schedule,
      specialInstructions,
      attachments
    } = req.body;

    // Validate required fields
    if (!serviceProviderId || !serviceType || !description || !address || !schedule) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Check if service provider exists and is available
    const serviceProvider = await ServiceProvider.findById(serviceProviderId)
      .populate('user', 'name');
    
    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    if (!serviceProvider.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Service provider is not available for bookings'
      });
    }

    // Calculate estimated price
    const estimatedHours = schedule.estimatedHours || 1;
    const estimatedTotal = serviceProvider.hourlyRate * estimatedHours;

    // Create booking
    const booking = await Booking.create({
      customer: customerId,
      serviceProvider: serviceProviderId,
      serviceType,
      description,
      address,
      schedule,
      pricing: {
        hourlyRate: serviceProvider.hourlyRate,
        estimatedTotal,
        finalAmount: estimatedTotal,
        paymentStatus: 'pending'
      },
      specialInstructions,
      attachments,
      status: 'pending',
      statusHistory: [{
        status: 'pending',
        note: 'Booking created'
      }]
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('customer', 'name email phone')
      .populate({
        path: 'serviceProvider',
        populate: {
          path: 'user',
          select: 'name phone'
        }
      });

    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      booking: populatedBooking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
};

// Get customer bookings
exports.getCustomerBookings = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { status, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const query = { customer: customerId };
    if (status) query.status = status;

    const bookings = await Booking.find(query)
      .populate('serviceProvider')
      .populate({
        path: 'serviceProvider',
        populate: {
          path: 'user',
          select: 'name profileImage phone'
        }
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.status(200).json({
      success: true,
      count: bookings.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      bookings
    });
  } catch (error) {
    console.error('Get customer bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching bookings',
      error: error.message
    });
  }
};

// Get booking by ID
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'name email phone profileImage')
      .populate({
        path: 'serviceProvider',
        populate: {
          path: 'user',
          select: 'name phone profileImage email'
        }
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is authorized to view this booking
    if (booking.customer._id.toString() !== req.user.id && 
        booking.serviceProvider.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }

    res.status(200).json({
      success: true,
      booking
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
};

// Update booking status (customer actions)
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status, cancellationReason } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if customer owns this booking
    if (booking.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    // Validate status transition
    const validTransitions = {
      'pending': ['cancelled'],
      'accepted': ['cancelled'],
      'in_progress': ['cancelled'],
      'completed': [],
      'cancelled': [],
      'rejected': []
    };

    if (!validTransitions[booking.status]?.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot change status from ${booking.status} to ${status}`
      });
    }

    // Update booking
    booking.status = status;
    if (status === 'cancelled' && cancellationReason) {
      booking.cancellationReason = cancellationReason;
    }

    if (status === 'completed') {
      booking.completedAt = new Date();
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating booking status',
      error: error.message
    });
  }
};

// Add message to booking
exports.addMessageToBooking = async (req, res) => {
  try {
    const { message } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user is part of this booking
    const isCustomer = booking.customer.toString() === req.user.id;
    const isProvider = booking.serviceProvider.user?._id.toString() === req.user.id;

    if (!isCustomer && !isProvider) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message for this booking'
      });
    }

    booking.messages.push({
      sender: isCustomer ? 'customer' : 'provider',
      message
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Message sent successfully',
      messages: booking.messages
    });
  } catch (error) {
    console.error('Add message error:', error);
    res.status(500).json({
      success: false,
      message: 'Error sending message',
      error: error.message
    });
  }
};