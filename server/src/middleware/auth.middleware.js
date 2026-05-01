const { verifyToken, ACCESS_TOKEN_SECRET } = require('../utils/token.util');
const { errorResponse } = require('../utils/response.util');
const { logger } = require('../config/logger');

/**
 * Authentication middleware — verifies JWT from Authorization: Bearer header.
 * Attaches req.user = { id, email, role } on success.
 */
const isAuthenticated = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 401, 'No token provided — please login');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return errorResponse(res, 401, 'No token provided — please login');
    }

    const decoded = verifyToken(token, ACCESS_TOKEN_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      logger.warn('Token expired', { ip: req.ip });
      return errorResponse(res, 401, 'Token expired — please login again');
    }
    if (error.name === 'JsonWebTokenError') {
      logger.warn('Invalid token', { ip: req.ip, message: error.message });
      return errorResponse(res, 401, 'Invalid token');
    }
    logger.error('Auth middleware error:', { message: error.message });
    return errorResponse(res, 401, 'Authentication failed');
  }
};

module.exports = { isAuthenticated };
