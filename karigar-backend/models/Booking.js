const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceProvider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceProvider',
    required: true
  },
  serviceType: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  schedule: {
    date: {
      type: Date,
      required: true
    },
    timeSlot: {
      start: String,
      end: String
    },
    estimatedHours: {
      type: Number,
      default: 1
    }
  },
  pricing: {
    hourlyRate: Number,
    estimatedTotal: Number,
    finalAmount: Number,
    paymentStatus: {
      type: String,
      enum: ['pending', 'partial', 'paid', 'refunded'],
      default: 'pending'
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    timestamp: { type: Date, default: Date.now },
    note: String
  }],
  messages: [{
    sender: { type: String, enum: ['customer', 'provider'] },
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  review: {
    rating: { type: Number, min: 1, max: 5 },
    comment: String,
    timestamp: Date
  },
  attachments: [{
    type: String, // URLs to uploaded files/images
    description: String
  }],
  specialInstructions: String,
  cancellationReason: String,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

BookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Add to status history when status changes
  if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      note: this.status === 'cancelled' ? this.cancellationReason : ''
    });
  }
  
  next();
});

module.exports = mongoose.model('Booking', BookingSchema);