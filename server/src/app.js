const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const { swaggerSpec } = require('./config/swagger');
const { morganStream } = require('./config/logger');
const { globalLimiter } = require('./middleware/rateLimiter.middleware');
const { errorHandler } = require('./middleware/error.middleware');
const { notFound } = require('./middleware/notFound.middleware');
const routes = require('./routes');

/**
 * Creates and configures the Express application.
 * Separated from server startup for testability.
 */
const createApp = () => {
  const app = express();

  // ── Security Middleware ───────────────────
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // ── Rate Limiting ────────────────────────
  app.use(globalLimiter);

  // ── Body Parsing ─────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ── HTTP Request Logging ─────────────────
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms', {
    stream: morganStream,
  }));

  // ── Swagger Docs ─────────────────────────
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'TaskFlow API Documentation',
  }));
  app.get('/api/v1/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // ── API Routes ───────────────────────────
  app.use('/api/v1', routes);

  // ── Root Route ───────────────────────────
  app.get('/', (req, res) => {
    res.json({
      name: 'TaskFlow API',
      version: '1.0.0',
      docs: '/api/v1/docs',
      health: '/api/v1/health',
    });
  });

  // ── Error Handling ───────────────────────
  app.use(notFound);
  app.use(errorHandler);

  return app;
};

module.exports = { createApp };
