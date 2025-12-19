const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    serviceType: {
        type: String,
        required: [true, 'Please provide a service type'],
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Please provide a service title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a service description'],
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative']
    },
    priceType: {
        type: String,
        enum: ['hourly', 'fixed', 'per_service'],
        default: 'fixed'
    },
    availability: {
        monday: { available: Boolean, startTime: String, endTime: String },
        tuesday: { available: Boolean, startTime: String, endTime: String },
        wednesday: { available: Boolean, startTime: String, endTime: String },
        thursday: { available: Boolean, startTime: String, endTime: String },
        friday: { available: Boolean, startTime: String, endTime: String },
        saturday: { available: Boolean, startTime: String, endTime: String },
        sunday: { available: Boolean, startTime: String, endTime: String }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    location: {
        address: String,
        city: String,
        state: String,
        pincode: String
    },
    experience: {
        type: Number,
        min: 0
    },
    rating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    totalReviews: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Service', ServiceSchema);

