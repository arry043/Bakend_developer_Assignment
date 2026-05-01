const { prisma } = require('../config/db');
const redis = require('../config/redis');
const { generateCacheKey } = require('../utils/cache.util');
const { CACHE_TTL } = require('../constants/cache.constants');
const { ROLES } = require('../constants/roles');
const { logger } = require('../config/logger');

/**
 * Create a new task
 * @param {string} userId - The user creating the task
 * @param {object} data - Task data
 * @returns {Promise<object>} Created task
 */
const createTask = async (userId, data) => {
  const task = await prisma.task.create({
    data: {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : null,
      userId,
    },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  // Invalidate cache for this user
  await invalidateUserTaskCache(userId);

  logger.info('Task created', { taskId: task.id, userId, title: task.title });

  return task;
};

/**
 * Get all tasks with pagination, search, filters, and RBAC
 * @param {string} userId - Current user ID
 * @param {string} role - Current user role
 * @param {object} query - Query parameters
 * @returns {Promise<{ tasks: Array, total: number, page: number, totalPages: number }>}
 */
const getAllTasks = async (userId, role, query) => {
  const { skip, take, page, limit, orderBy } = require('../utils/pagination.util').parsePagination(query);

  // Build cache key
  const cacheKey = generateCacheKey(
    'tasks',
    role === ROLES.ADMIN ? 'ALL' : userId,
    `p${page}`,
    `l${limit}`,
    `s${query.search || ''}`,
    `st${query.status || ''}`,
    `pr${query.priority || ''}`,
    `sb${query.sortBy || 'createdAt'}`,
    `o${query.order || 'desc'}`
  );

  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) {
    logger.debug('Cache HIT', { cacheKey });
    return { ...JSON.parse(cached), cacheHit: true };
  }

  logger.debug('Cache MISS', { cacheKey });

  // Build where clause
  const where = {};

  // RBAC: USER sees own tasks, ADMIN sees all
  if (role !== ROLES.ADMIN) {
    where.userId = userId;
  }

  // Search by title or description (case-insensitive)
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: 'insensitive' } },
      { description: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  // Filter by status
  if (query.status) {
    where.status = query.status;
  }

  // Filter by priority
  if (query.priority) {
    where.priority = query.priority;
  }

  // Execute query
  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take,
      orderBy,
      include: {
        user: {
          select: { id: true, email: true, role: true },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  const result = {
    tasks,
    total,
    page,
    limit,
    totalPages,
  };

  // Store in cache
  await redis.set(cacheKey, JSON.stringify(result), CACHE_TTL.TASKS);

  return { ...result, cacheHit: false };
};

/**
 * Get a single task by ID with RBAC
 * @param {string} taskId - Task ID
 * @param {string} userId - Current user ID
 * @param {string} role - Current user role
 * @returns {Promise<object>} Task
 */
const getTaskById = async (taskId, userId, role) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  if (!task) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  // RBAC: USER can only access own tasks
  if (role !== ROLES.ADMIN && task.userId !== userId) {
    const error = new Error('Access denied — this task does not belong to you');
    error.statusCode = 403;
    throw error;
  }

  return task;
};

/**
 * Update a task with RBAC
 * @param {string} taskId - Task ID
 * @param {string} userId - Current user ID
 * @param {string} role - Current user role
 * @param {object} data - Update data
 * @returns {Promise<object>} Updated task
 */
const updateTask = async (taskId, userId, role, data) => {
  // First check ownership
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role !== ROLES.ADMIN && existingTask.userId !== userId) {
    const error = new Error('Access denied — this task does not belong to you');
    error.statusCode = 403;
    throw error;
  }

  // Update task
  const updateData = { ...data };
  if (data.dueDate !== undefined) {
    updateData.dueDate = data.dueDate ? new Date(data.dueDate) : null;
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: updateData,
    include: {
      user: {
        select: { id: true, email: true, role: true },
      },
    },
  });

  // Invalidate cache
  await invalidateUserTaskCache(existingTask.userId);
  if (role === ROLES.ADMIN && existingTask.userId !== userId) {
    await invalidateUserTaskCache(userId);
  }

  logger.info('Task updated', { taskId, userId });

  return task;
};

/**
 * Delete a task with RBAC
 * @param {string} taskId - Task ID
 * @param {string} userId - Current user ID
 * @param {string} role - Current user role
 */
const deleteTask = async (taskId, userId, role) => {
  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    const error = new Error('Task not found');
    error.statusCode = 404;
    throw error;
  }

  if (role !== ROLES.ADMIN && existingTask.userId !== userId) {
    const error = new Error('Access denied — this task does not belong to you');
    error.statusCode = 403;
    throw error;
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  // Invalidate cache
  await invalidateUserTaskCache(existingTask.userId);

  logger.info('Task deleted', { taskId, userId });
};

/**
 * Invalidate all cached task queries for a user (and admin "ALL" queries)
 * @param {string} userId
 */
const invalidateUserTaskCache = async (userId) => {
  try {
    await redis.delByPattern(`tasks:${userId}:*`);
    await redis.delByPattern(`tasks:ALL:*`);
    logger.debug('Cache invalidated', { userId });
  } catch (error) {
    logger.error('Cache invalidation error:', { message: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
