/**
 * Send a standardized success response
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Success message
 * @param {object|null} data - Response data
 * @param {object|null} meta - Pagination or additional metadata
 */
const successResponse = (res, statusCode, message, data = null, meta = null) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  if (meta !== null) {
    response.meta = meta;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 * @param {import('express').Response} res
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array|null} errors - Array of field-level errors
 */
const errorResponse = (res, statusCode, message, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

module.exports = { successResponse, errorResponse };
