const { prisma } = require('../config/db');
const { ROLES } = require('../constants/roles');
const { logger } = require('../config/logger');

/**
 * Get all users (admin only, excludes passwords)
 * @returns {Promise<{ users: Array, total: number }>}
 */
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return {
    users: users.map((user) => ({
      ...user,
      taskCount: user._count.tasks,
      _count: undefined,
    })),
    total: users.length,
  };
};

/**
 * Delete a user and all their tasks (admin only)
 * Prevents deletion of the last admin account
 * @param {string} userId - User ID to delete
 */
const deleteUser = async (userId) => {
  // Find the user
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }

  // Prevent deleting the last admin
  if (user.role === ROLES.ADMIN) {
    const adminCount = await prisma.user.count({
      where: { role: ROLES.ADMIN },
    });

    if (adminCount <= 1) {
      const error = new Error('Cannot delete the last admin account');
      error.statusCode = 409;
      throw error;
    }
  }

  // Delete user (tasks cascade due to schema onDelete: Cascade)
  await prisma.user.delete({
    where: { id: userId },
  });

  logger.info('User deleted', { deletedUserId: userId, deletedEmail: user.email });
};

module.exports = { getAllUsers, deleteUser };
