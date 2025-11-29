// Middleware to check if user has required role
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by protect middleware
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Check if user's role is in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }

    next(); // User has required role, continue
  };
};

// Shortcut middleware for admin-only routes
const adminOnly = authorize('admin');

// Shortcut middleware for user-only routes
const userOnly = authorize('user');

// Middleware for routes accessible by both
const authenticatedOnly = authorize('user', 'admin');

module.exports = {
  authorize,
  adminOnly,
  userOnly,
  authenticatedOnly
};
