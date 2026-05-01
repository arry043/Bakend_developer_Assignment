const bcrypt = require('bcryptjs');
const { prisma } = require('../config/db');
const { signAccessToken, signRefreshToken } = require('../utils/token.util');
const { logger } = require('../config/logger');

const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 12;

/**
 * Register a new user
 * @param {{ email: string, password: string, role?: string }} data
 * @returns {Promise<object>} Created user (without password)
 */
const registerUser = async (data) => {
  const { email, password, role } = data;

  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    const error = new Error('An account with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      role: role || 'USER',
    },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  logger.info('User registered', { userId: user.id, email: user.email, role: user.role });

  return user;
};

/**
 * Login a user and return JWT tokens
 * @param {{ email: string, password: string }} data
 * @returns {Promise<{ accessToken: string, refreshToken: string, user: object }>}
 */
const loginUser = async (data) => {
  const { email, password } = data;

  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    logger.warn('Login failed — user not found', { email });
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Compare passwords
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    logger.warn('Login failed — invalid password', { email });
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Generate tokens
  const tokenPayload = { id: user.id, email: user.email, role: user.role };
  const accessToken = signAccessToken(tokenPayload);
  const refreshToken = signRefreshToken({ id: user.id });

  logger.info('User logged in', { userId: user.id, email: user.email });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    },
  };
};

/**
 * Get user profile by ID (excludes password)
 * @param {string} userId
 * @returns {Promise<object>} User profile
 */
const getUserProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  return user;
};

module.exports = { registerUser, loginUser, getUserProfile };
