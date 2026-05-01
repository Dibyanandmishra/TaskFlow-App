const config = require('./src/config');
const logger = require('./src/utils/logger');
const connectDB = require('./src/config/db');
const app = require('./src/app');

process.on('unhandledRejection', (reason) => {
  logger.error('UNHANDLED REJECTION — Shutting down...', { reason: reason?.message || reason });
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION — Shutting down...', { error: err.message, stack: err.stack });
  process.exit(1);
});

const gracefulShutdown = (signal) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);

  if (server) {
    server.close(() => {
      logger.info('HTTP server closed');
      const mongoose = require('mongoose');
      mongoose.connection.close(false).then(() => {
        logger.info('MongoDB connection closed');
        process.exit(0);
      });
    });
  }

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

let server;

const startServer = async () => {
  await connectDB();

  server = app.listen(config.port, () => {
    logger.info(`TaskFlow API running on port ${config.port} [${config.env}]`);
    if (config.env !== 'production') {
      logger.info(`API docs: http://localhost:${config.port}/api-docs`);
    }
  });
};

startServer();