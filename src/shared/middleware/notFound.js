const { NotFoundError } = require('../utils/ApiError');

const NotFound = (req, res, next) => {
  next(new NotFoundError(`Route ${req.originalUrl} not found`));
};

module.exports = NotFound;
