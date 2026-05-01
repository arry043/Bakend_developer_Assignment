const { ZodError } = require('zod');
const { errorResponse } = require('../utils/response.util');

/**
 * Zod validation middleware factory.
 * Validates req.body against the provided schema.
 * Returns 400 with field-level errors on failure.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => {
  return (req, res, next) => {
    try {
      const parsed = schema.parse(req.body);
      req.body = parsed; // Replace with parsed & coerced values
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        return errorResponse(res, 400, 'Validation failed', errors);
      }
      next(error);
    }
  };
};

module.exports = { validate };
