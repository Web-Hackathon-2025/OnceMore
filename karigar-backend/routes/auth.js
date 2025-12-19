const express = require('express');
const router = express.Router();
const { 
    register, 
    login, 
    getProfile, 
    updateProfile 
} = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);

// Admin only route example
router.get('/admin/users', protect, authorize('admin'), async (req, res) => {
    // This route is accessible only by admin
    res.json({ message: 'Admin access granted' });
});

module.exports = router;