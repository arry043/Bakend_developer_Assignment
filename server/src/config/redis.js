const Redis = require('ioredis');
const { logger } = require('./logger');

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const REDIS_RETRY_LIMIT = Number(process.env.REDIS_RETRY_LIMIT || 0);

let redisClient;
let isRedisConnected = false;

try {
  redisClient = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > REDIS_RETRY_LIMIT) {
        logger.warn('Redis reconnect disabled — running without cache');
        return null;
      }

      const delay = Math.min(times * 200, 5000);
      logger.warn(`Redis reconnect attempt ${times}, retrying in ${delay}ms`);
      return delay;
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => {
    isRedisConnected = true;
    logger.info('✅ Redis connected successfully');
  });

  redisClient.on('error', (err) => {
    isRedisConnected = false;
    logger.error('❌ Redis error:', { error: err.message });
  });

  redisClient.on('close', () => {
    isRedisConnected = false;
    logger.warn('Redis connection closed');
  });

  redisClient.on('reconnecting', () => {
    logger.info('Redis reconnecting...');
  });
} catch (error) {
  logger.error('❌ Redis initialization failed:', { error: error.message });
  // Create a dummy client that gracefully degrades
  redisClient = null;
}

// ── Redis Helper Functions ────────────────
// All wrapped in try-catch for graceful degradation

/**
 * Get value from Redis cache
 * @param {string} key - Cache key
 * @returns {Promise<string|null>} Cached value or null
 */
const get = async (key) => {
  try {
    if (!redisClient || !isRedisConnected) return null;
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    logger.error('Redis GET error:', { key, error: error.message });
    return null;
  }
};

/**
 * Set value in Redis cache
 * @param {string} key - Cache key
 * @param {string} value - Value to cache
 * @param {number} ttl - Time to live in seconds
 */
const set = async (key, value, ttl) => {
  try {
    if (!redisClient || !isRedisConnected) return;
    if (ttl) {
      await redisClient.setex(key, ttl, value);
    } else {
      await redisClient.set(key, value);
    }
  } catch (error) {
    logger.error('Redis SET error:', { key, error: error.message });
  }
};

/**
 * Delete a key from Redis cache
 * @param {string} key - Cache key to delete
 */
const del = async (key) => {
  try {
    if (!redisClient || !isRedisConnected) return;
    await redisClient.del(key);
  } catch (error) {
    logger.error('Redis DEL error:', { key, error: error.message });
  }
};

/**
 * Delete all keys matching a pattern (using SCAN for production safety)
 * @param {string} pattern - Key pattern to match (e.g. 'tasks:user123:*')
 */
const delByPattern = async (pattern) => {
  try {
    if (!redisClient || !isRedisConnected) return;
    let cursor = '0';
    do {
      const [nextCursor, keys] = await redisClient.scan(
        cursor,
        'MATCH',
        pattern,
        'COUNT',
        100
      );
      cursor = nextCursor;
      if (keys.length > 0) {
        await redisClient.del(...keys);
      }
    } while (cursor !== '0');
  } catch (error) {
    logger.error('Redis DEL pattern error:', { pattern, error: error.message });
  }
};

/**
 * Flush all Redis data
 */
const flush = async () => {
  try {
    if (!redisClient || !isRedisConnected) return;
    await redisClient.flushdb();
  } catch (error) {
    logger.error('Redis FLUSH error:', { error: error.message });
  }
};

/**
 * Connect to Redis
 */
const connectRedis = async () => {
  try {
    if (!redisClient) {
      logger.warn('Redis client not initialized — running without cache');
      return false;
    }
    await redisClient.connect();
    return true;
  } catch (error) {
    logger.warn('Redis connection failed — running without cache:', {
      error: error.message,
    });
    return false;
  }
};

/**
 * Check if Redis is connected
 */
const getRedisStatus = () => isRedisConnected;

module.exports = {
  redisClient,
  get,
  set,
  del,
  delByPattern,
  flush,
  connectRedis,
  getRedisStatus,
};
