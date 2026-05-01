const logger = require('../utils/logger');
const { sendError } = require('../utils/apiResponse');


const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errorCode = err.errorCode || 'INTERNAL_ERROR';
  let errors = null;

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    errorCode = 'DUPLICATE_KEY';
    const field = Object.keys(err.keyPattern)[0];
    message = `Duplicate value for field: ${field}`;
  }

  // Mongoose CastError (invalid ObjectId etc.)
  if (err.name === 'CastError') {
    statusCode = 400;
    errorCode = 'INVALID_ID';
    message = `Invalid value for ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  }

  // Joi validation error
  if (err.isJoi) {
    statusCode = 422;
    errorCode = 'VALIDATION_ERROR';
    message = 'Validation failed';
    errors = err.details.map((d) => ({
      field: d.path.join('.'),
      message: d.message.replace(/"/g, ''),
    }));
  }

  // Log server errors
  if (statusCode >= 500) {
    logger.error(`[${req.method}] ${req.originalUrl} - ${message}`, {
      stack: err.stack,
      body: req.body,
    });
  } else {
    logger.warn(`[${req.method}] ${req.originalUrl} - ${statusCode} ${message}`);
  }

  return sendError(res, { statusCode, message, errorCode, errors });
};

module.exports = errorHandler;
