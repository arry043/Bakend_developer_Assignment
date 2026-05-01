const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'default_access_secret_key_32_chars_min';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'default_refresh_secret_key_32_chars_min';
const ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || '1h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

/**
 * Sign an access token
 * @param {object} payload - Token payload { id, email, role }
 * @returns {string} JWT access token
 */
const signAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
};

/**
 * Sign a refresh token
 * @param {object} payload - Token payload { id }
 * @returns {string} JWT refresh token
 */
const signRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
};

/**
 * Verify a token
 * @param {string} token - JWT token
 * @param {string} secret - Token secret
 * @returns {object} Decoded token payload
 * @throws {JsonWebTokenError|TokenExpiredError}
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyToken,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
};
