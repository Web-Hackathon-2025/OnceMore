const Booking = require("../models/Booking");
const Service = require("../models/Service");

// @desc    Get all bookings for a provider
// @route   GET /api/bookings/provider
// @access  Private (Service Provider)
exports.getProviderBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { provider: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("customer", "name email phone")
      .populate("service", "title serviceType price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// @desc    Get booking history for a provider
// @route   GET /api/bookings/provider/history
// @access  Private (Service Provider)
exports.getBookingHistory = async (req, res) => {
  try {
    const bookings = await Booking.find({
      provider: req.user.id,
      status: { $in: ["completed", "cancelled"] },
    })
      .populate("customer", "name email phone")
      .populate("service", "title serviceType")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking history",
      error: error.message,
    });
  }
};

// @desc    Get a single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .populate("service", "title serviceType price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    // Check if user is authorized to view this booking
    if (
      booking.customer._id.toString() !== req.user.id &&
      booking.provider._id.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this booking",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
};

// @desc    Accept a booking
// @route   PUT /api/bookings/:id/accept
// @access  Private (Service Provider)
exports.acceptBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to accept this booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Booking cannot be accepted. Current status: " + booking.status,
      });
    }

    booking.status = "accepted";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking accepted successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error accepting booking",
      error: error.message,
    });
  }
};

// @desc    Reject a booking
// @route   PUT /api/bookings/:id/reject
// @access  Private (Service Provider)
exports.rejectBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reject this booking",
      });
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message:
          "Booking cannot be rejected. Current status: " + booking.status,
      });
    }

    booking.status = "rejected";
    booking.rejectionReason = req.body.reason || "No reason provided";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rejected successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rejecting booking",
      error: error.message,
    });
  }
};

// @desc    Reschedule a booking
// @route   PUT /api/bookings/:id/reschedule
// @access  Private (Service Provider)
exports.rescheduleBooking = async (req, res) => {
  try {
    const { scheduledDate, scheduledTime } = req.body;

    if (!scheduledDate || !scheduledTime) {
      return res.status(400).json({
        success: false,
        message: "Please provide both date and time for rescheduling",
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (booking.provider.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to reschedule this booking",
      });
    }

    if (!["pending", "accepted"].includes(booking.status)) {
      return res.status(400).json({
        success: false,
        message:
          "Booking cannot be rescheduled. Current status: " + booking.status,
      });
    }

    booking.rescheduledDate = scheduledDate;
    booking.rescheduledTime = scheduledTime;
    booking.status = "rescheduled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking rescheduled successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error rescheduling booking",
      error: error.message,
    });
  }
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private (Customer)
exports.createBooking = async (req, res) => {
  try {
    const {
      serviceProviderId,
      serviceId,
      scheduledDate,
      scheduledTime,
      description,
    } = req.body;

    const booking = new Booking({
      customer: req.user.id,
      provider: serviceProviderId,
      service: serviceId,
      scheduledDate,
      scheduledTime,
      description,
      status: "pending",
    });

    await booking.save();
    await booking.populate("customer", "name email phone");
    await booking.populate("provider", "name email phone");
    await booking.populate("service", "title serviceType price");

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating booking",
      error: error.message,
    });
  }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer)
exports.getCustomerBookings = async (req, res) => {
  try {
    const { status } = req.query;
    const query = { customer: req.user.id };

    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("provider", "name email phone")
      .populate("service", "title serviceType price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching bookings",
      error: error.message,
    });
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .populate("service", "title serviceType price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching booking",
      error: error.message,
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate("customer", "name email phone")
      .populate("provider", "name email phone")
      .populate("service", "title serviceType price");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating booking status",
      error: error.message,
    });
  }
};

// @desc    Add message to booking
// @route   POST /api/bookings/:id/messages
// @access  Private
exports.addMessageToBooking = async (req, res) => {
  try {
    const { message } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    if (!booking.messages) {
      booking.messages = [];
    }

    booking.messages.push({
      sender: req.user.id,
      message,
      timestamp: new Date(),
    });

    await booking.save();

    res.status(200).json({
      success: true,
      message: "Message added to booking",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding message",
      error: error.message,
    });
  }
};
