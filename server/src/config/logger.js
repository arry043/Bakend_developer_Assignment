const winston = require('winston');
const path = require('path');

const LOG_DIR = process.env.LOG_DIR || 'logs';
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';
const isProduction = process.env.NODE_ENV === 'production';

// ── Custom Log Format ─────────────────────
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.printf(({ level, message, timestamp, service, stack, ...metadata }) => {
    let log = `${timestamp} [${service || 'taskflow-api'}] ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      log += ` ${JSON.stringify(metadata)}`;
    }
    if (stack) {
      log += `\n${stack}`;
    }
    return log;
  })
);

// ── Console Format (colorized for dev) ────
const consoleFormat = winston.format.combine(
  winston.format.colorize({ all: true }),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    const meta = Object.keys(metadata).length > 0
      ? ` ${JSON.stringify(metadata)}`
      : '';
    return `${timestamp} ${level}: ${message}${meta}`;
  })
);

// ── Transports ────────────────────────────
const transports = [
  // Console transport
  new winston.transports.Console({
    level: isProduction ? 'info' : 'debug',
    format: consoleFormat,
  }),
];

// File transports (always add, even in dev — useful for debugging)
transports.push(
  // Combined log
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'combined.log'),
    level: 'info',
    format: logFormat,
    maxsize: 20 * 1024 * 1024, // 20MB
    maxFiles: 14,
    tailable: true,
  }),
  // Error log
  new winston.transports.File({
    filename: path.join(LOG_DIR, 'error.log'),
    level: 'error',
    format: logFormat,
    maxsize: 20 * 1024 * 1024, // 20MB
    maxFiles: 30,
    tailable: true,
  })
);

// ── Logger Instance ───────────────────────
const logger = winston.createLogger({
  level: LOG_LEVEL,
  defaultMeta: { service: 'taskflow-api' },
  transports,
  exitOnError: false,
});

// ── Morgan Stream ─────────────────────────
const morganStream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

module.exports = { logger, morganStream };
