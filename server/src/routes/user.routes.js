const { Router } = require('express');
const { getUsers, removeUser } = require('../controllers/user.controller');
const { isAuthenticated } = require('../middleware/auth.middleware');
const { isAdmin } = require('../middleware/role.middleware');

const router = Router();

// All user routes require authentication + admin role
router.use(isAuthenticated, isAdmin);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users (Admin only)
 *     description: Returns a list of all registered users with their task counts. Passwords are excluded.
 *     tags: [Users (Admin)]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         allOf:
 *                           - $ref: '#/components/schemas/UserResponse'
 *                           - type: object
 *                             properties:
 *                               taskCount:
 *                                 type: integer
 *                                 example: 5
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 */
router.get('/', getUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     description: >
 *       Delete a user and all their associated tasks (cascade delete).
 *       Cannot delete the last admin account.
 *     tags: [Users (Admin)]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID to delete
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Not authorized (admin only)
 *       404:
 *         description: User not found
 *       409:
 *         description: Cannot delete the last admin account
 */
router.delete('/:id', removeUser);

module.exports = router;
