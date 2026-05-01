const { PrismaClient } = require('@prisma/client');
const { logger } = require('./logger');

const isProduction = process.env.NODE_ENV === 'production';
const DB_KEEPALIVE_INTERVAL_MS = Number(process.env.DB_KEEPALIVE_INTERVAL_MS || 240000);
const DB_CONNECT_RETRIES = Number(process.env.DB_CONNECT_RETRIES || 5);
const DB_CONNECT_RETRY_DELAY_MS = Number(process.env.DB_CONNECT_RETRY_DELAY_MS || 2000);

let keepAliveTimer = null;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const prisma = new PrismaClient({
  log: isProduction
    ? [{ emit: 'event', level: 'error' }]
    : [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
});

// ── Log Prisma Events ─────────────────────
prisma.$on('error', (e) => {
  logger.error('Prisma error:', { error: e.message, target: e.target });
});

if (!isProduction) {
  prisma.$on('query', (e) => {
    logger.debug('Prisma query:', {
      query: e.query,
      duration: `${e.duration}ms`,
    });
  });

  prisma.$on('warn', (e) => {
    logger.warn('Prisma warning:', { error: e.message });
  });
}

const startDatabaseKeepAlive = () => {
  if (isProduction || DB_KEEPALIVE_INTERVAL_MS <= 0 || keepAliveTimer) return;

  keepAliveTimer = setInterval(async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      logger.warn('Database keepalive failed:', { error: error.message });
      await prisma.$disconnect().catch(() => {});
    }
  }, DB_KEEPALIVE_INTERVAL_MS);

  keepAliveTimer.unref?.();
};

// ── Graceful Shutdown ─────────────────────
const gracefulShutdown = async (signal) => {
  logger.info(`Received ${signal}. Disconnecting Prisma...`);
  if (keepAliveTimer) {
    clearInterval(keepAliveTimer);
  }
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

/**
 * Test database connection
 */
const connectDatabase = async () => {
  for (let attempt = 1; attempt <= DB_CONNECT_RETRIES; attempt += 1) {
    try {
      await prisma.$connect();
      logger.info('✅ Database connected successfully');
      startDatabaseKeepAlive();
      return true;
    } catch (error) {
      if (attempt === DB_CONNECT_RETRIES) {
        logger.error('❌ Database connection failed:', { error: error.message });
        return false;
      }

      const delay = DB_CONNECT_RETRY_DELAY_MS * attempt;
      logger.warn(`Database connection attempt ${attempt}/${DB_CONNECT_RETRIES} failed. Retrying in ${delay}ms`, {
        error: error.message,
      });
      await wait(delay);
    }
  }

  return false;
};

module.exports = { prisma, connectDatabase };
