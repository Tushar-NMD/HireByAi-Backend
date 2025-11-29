const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controlllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected route (requires authentication)
router.get('/me', protect, getMe);

module.exports = router;
