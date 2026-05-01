const { ZodError } = require('zod');
const { Prisma } = require('@prisma/client');
const { logger } = require('../config/logger');

const isProduction = process.env.NODE_ENV === 'production';

/**
 * Central error handler middleware (4 params: err, req, res, next).
 * Maps known error types to appropriate HTTP status codes.
 * Never leaks stack traces in production.
 */
const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: isProduction ? undefined : err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // ── Zod Validation Error ────────────────
  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors,
    });
  }

  // ── Prisma Known Request Error ──────────
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002: Unique constraint violation
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        success: false,
        message: `A record with this ${field} already exists`,
        errors: null,
      });
    }

    // P2025: Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Record not found',
        errors: null,
      });
    }
  }

  // ── JWT Errors ──────────────────────────
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired — please login again',
      errors: null,
    });
  }

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      errors: null,
    });
  }

  // ── Custom Errors with statusCode ───────
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message || 'An error occurred',
      errors: err.errors || null,
    });
  }

  // ── Generic 500 Error ───────────────────
  return res.status(500).json({
    success: false,
    message: isProduction ? 'Internal server error' : err.message || 'Internal server error',
    errors: isProduction ? null : [{ message: err.message, stack: err.stack }],
  });
};

module.exports = { errorHandler };
