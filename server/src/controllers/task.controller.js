const taskService = require('../services/task.service');
const { successResponse } = require('../utils/response.util');

/**
 * POST /tasks
 */
const createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(req.user.id, req.body);
    return successResponse(res, 201, 'Task created successfully', { task });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks
 */
const getAllTasks = async (req, res, next) => {
  try {
    const { tasks, total, page, limit, totalPages, cacheHit } =
      await taskService.getAllTasks(req.user.id, req.user.role, req.query);

    // Set cache header for debugging
    res.setHeader('X-Cache', cacheHit ? 'HIT' : 'MISS');

    return successResponse(
      res,
      200,
      'Tasks fetched successfully',
      { tasks },
      { total, page, limit, totalPages }
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /tasks/:id
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await taskService.getTaskById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    return successResponse(res, 200, 'Task fetched successfully', { task });
  } catch (error) {
    next(error);
  }
};

/**
 * PATCH /tasks/:id
 */
const updateTask = async (req, res, next) => {
  try {
    const task = await taskService.updateTask(
      req.params.id,
      req.user.id,
      req.user.role,
      req.body
    );
    return successResponse(res, 200, 'Task updated successfully', { task });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /tasks/:id
 */
const deleteTask = async (req, res, next) => {
  try {
    await taskService.deleteTask(req.params.id, req.user.id, req.user.role);
    return successResponse(res, 200, 'Task deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
