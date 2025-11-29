const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { userOnly } = require('../middleware/role.middleware');

// Protected route - only authenticated users
router.get('/profile', protect, (req, res) => {
  res.json({
    success: true,
    message: 'User profile',
    user: req.user
  });
});

// Protected route - only users with 'user' role
router.get('/dashboard', protect, userOnly, (req, res) => {
  res.json({
    success: true,
    message: 'User dashboard',
    user: req.user
  });
});

module.exports = router;
