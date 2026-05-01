const { Router } = require('express');
const authRoutes = require('./auth.routes');
const taskRoutes = require('./task.routes');
const userRoutes = require('./user.routes');
const healthRoutes = require('./health.routes');

const router = Router();

// ── Mount Route Groups ────────────────────
router.use('/auth', authRoutes);
router.use('/tasks', taskRoutes);
router.use('/users', userRoutes);
router.use('/health', healthRoutes);

module.exports = router;
