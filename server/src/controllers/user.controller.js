const { getAllUsers, deleteUser } = require('../services/user.service');
const { successResponse } = require('../utils/response.util');

/**
 * GET /users — Admin only
 */
const getUsers = async (req, res, next) => {
  try {
    const { users, total } = await getAllUsers();
    return successResponse(res, 200, 'Users fetched successfully', { users }, { total });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /users/:id — Admin only
 */
const removeUser = async (req, res, next) => {
  try {
    await deleteUser(req.params.id);
    return successResponse(res, 200, 'User deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = { getUsers, removeUser };
