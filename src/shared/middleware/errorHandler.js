const { WebError } = require('../utils/ApiError');
const logger = require('../utils/logger');

const ErrorHandler = (err, req, res, next) => {
  logger.error({ err, path: req.path, method: req.method }, 'Request error');

  if (err instanceof WebError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      ...(err.details && { details: err.details }),
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const details = Object.values(err.errors).map((e) => e.message);
    return res
      .status(400)
      .json({ status: 'error', message: 'Validation Error', details });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res
      .status(400)
      .json({ status: 'error', message: `Invalid ${err.path}: ${err.value}` });
  }

  // Fallback
  res.status(500).json({ status: 'error', message: 'Internal Server Error' });
};

module.exports = ErrorHandler;
