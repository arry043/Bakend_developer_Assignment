const { ROLES } = require('../constants/roles');
const { errorResponse } = require('../utils/response.util');

/**
 * Admin role check middleware.
 * Must run AFTER isAuthenticated middleware.
 * Returns 403 if user is not ADMIN.
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return errorResponse(res, 401, 'Authentication required');
  }

  if (req.user.role !== ROLES.ADMIN) {
    return errorResponse(res, 403, 'Access denied — admin privileges required');
  }

  next();
};

module.exports = { isAdmin };
