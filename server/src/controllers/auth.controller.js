const { registerUser, loginUser, getUserProfile } = require('../services/auth.service');
const { successResponse } = require('../utils/response.util');

/**
 * POST /auth/register
 */
const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body);
    return successResponse(res, 201, 'User registered successfully', { user });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /auth/login
 */
const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    return successResponse(res, 200, 'Login successful', {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: result.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /auth/me
 */
const getMe = async (req, res, next) => {
  try {
    const user = await getUserProfile(req.user.id);
    return successResponse(res, 200, 'User profile fetched', { user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getMe };
