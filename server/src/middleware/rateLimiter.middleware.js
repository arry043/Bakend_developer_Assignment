const rateLimit = require('express-rate-limit');

const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 900000; // 15 minutes
const RATE_LIMIT_MAX_AUTH = parseInt(process.env.RATE_LIMIT_MAX_AUTH, 10) || 10;
const RATE_LIMIT_MAX_GLOBAL = parseInt(process.env.RATE_LIMIT_MAX_GLOBAL, 10) || 100;

/**
 * Auth route limiter — 10 requests per 15 minutes
 * Applied to /auth/register and /auth/login
 */
const authLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_AUTH,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please try again later',
    errors: null,
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

/**
 * Global limiter — 100 requests per minute
 * Applied to all routes
 */
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: RATE_LIMIT_MAX_GLOBAL,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests — please try again later',
    errors: null,
  },
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  },
});

module.exports = { authLimiter, globalLimiter };
