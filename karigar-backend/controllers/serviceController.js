const Service = require('../models/Service');

// @desc    Create a new service
// @route   POST /api/services
// @access  Private (Service Provider)
exports.createService = async (req, res) => {
    try {
        const serviceData = {
            ...req.body,
            provider: req.user.id
        };

        const service = await Service.create(serviceData);

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error creating service',
            error: error.message
        });
    }
};

// @desc    Get all services for a provider
// @route   GET /api/services/my-services
// @access  Private (Service Provider)
exports.getMyServices = async (req, res) => {
    try {
        const services = await Service.find({ provider: req.user.id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: services.length,
            services
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching services',
            error: error.message
        });
    }
};

// @desc    Get a single service
// @route   GET /api/services/:id
// @access  Private
exports.getService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('provider', 'name email phone');

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        res.status(200).json({
            success: true,
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching service',
            error: error.message
        });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private (Service Provider)
exports.updateService = async (req, res) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if user owns the service
        if (service.provider.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this service'
            });
        }

        service = await Service.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            service
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating service',
            error: error.message
        });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private (Service Provider)
exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json({
                success: false,
                message: 'Service not found'
            });
        }

        // Check if user owns the service
        if (service.provider.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this service'
            });
        }

        await service.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Service deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting service',
            error: error.message
        });
    }
};

