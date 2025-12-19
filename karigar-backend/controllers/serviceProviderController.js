const ServiceProvider = require('../models/ServiceProvider');
const Review = require('../models/Review');
const User = require('../models/User');

// Get all service providers
exports.getAllServiceProviders = async (req, res) => {
  try {
    const { 
      serviceType, 
      city, 
      minRating, 
      sortBy = 'rating',
      limit = 20,
      page = 1 
    } = req.query;

    const query = { isAvailable: true };
    
    if (serviceType) {
      query.serviceType = serviceType;
    }
    
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }
    
    if (minRating) {
      query['rating.average'] = { $gte: parseFloat(minRating) };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortQuery = {};
    switch (sortBy) {
      case 'rating':
        sortQuery = { 'rating.average': -1 };
        break;
      case 'price':
        sortQuery = { hourlyRate: 1 };
        break;
      case 'experience':
        sortQuery = { experience: -1 };
        break;
      default:
        sortQuery = { createdAt: -1 };
    }

    const serviceProviders = await ServiceProvider.find(query)
      .populate('user', 'name email phone')
      .sort(sortQuery)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceProvider.countDocuments(query);

    res.status(200).json({
      success: true,
      count: serviceProviders.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      serviceProviders
    });
  } catch (error) {
    console.error('Get service providers error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service providers',
      error: error.message
    });
  }
};

// Get service provider by ID
exports.getServiceProviderById = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id)
      .populate('user', 'name email phone profileImage');

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    res.status(200).json({
      success: true,
      serviceProvider
    });
  } catch (error) {
    console.error('Get service provider error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching service provider',
      error: error.message
    });
  }
};

// Get service provider reviews
exports.getServiceProviderReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ serviceProvider: req.params.id })
      .populate('customer', 'name profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ serviceProvider: req.params.id });

    res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      reviews
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Get service provider availability
exports.getServiceProviderAvailability = async (req, res) => {
  try {
    const serviceProvider = await ServiceProvider.findById(req.params.id)
      .select('availability isAvailable');

    if (!serviceProvider) {
      return res.status(404).json({
        success: false,
        message: 'Service provider not found'
      });
    }

    res.status(200).json({
      success: true,
      availability: serviceProvider.availability,
      isAvailable: serviceProvider.isAvailable
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching availability',
      error: error.message
    });
  }
};
