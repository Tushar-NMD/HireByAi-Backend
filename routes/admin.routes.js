const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// Admin-only route
router.get('/dashboard', protect, adminOnly, (req, res) => {
  res.json({
    success: true,
    message: 'Admin dashboard',
    user: req.user
  });
});

// Get all users (admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find();
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

module.exports = router;
