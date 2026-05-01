require('dotenv').config();

const { createApp } = require('./app');
const { connectDatabase } = require('./config/db');
const { connectRedis } = require('./config/redis');
const { logger } = require('./config/logger');

const PORT = process.env.PORT || 5000;

/**
 * Bootstrap the server:
 * 1. Connect to PostgreSQL
 * 2. Connect to Redis
 * 3. Start Express server
 */
const startServer = async () => {
  try {
    // Connect to Database
    const dbConnected = await connectDatabase();
    if (!dbConnected) {
      logger.error('Failed to connect to database. Exiting...');
      process.exit(1);
    }

    // Connect to Redis (non-blocking — graceful degradation)
    await connectRedis();

    // Create and start Express app
    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`🚀 TaskFlow API running on port ${PORT}`);
      logger.info(`📖 Swagger docs: http://localhost:${PORT}/api/v1/docs`);
      logger.info(`❤️  Health check: http://localhost:${PORT}/api/v1/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        logger.error(`Port ${PORT} is already in use. Set a different PORT in server/.env or stop the process using that port.`);
      } else {
        logger.error('Server failed after startup:', {
          error: error.message,
          stack: error.stack,
        });
      }

      process.exit(1);
    });
  } catch (error) {
    logger.error('Failed to start server:', { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();
