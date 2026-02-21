
class WebError extends Error {
  constructor(statusCode, message, details) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

class BadRequestError extends WebError {
  constructor(detail) {
    super(400, "Bad Request", detail);
  }
}

class NotFoundError extends WebError {
  constructor(detail) {
    super(404, "Not Found", detail);
  }
}

class UnauthorizedError extends WebError {
  constructor(detail) {
    super(401, "Unauthorized Action", detail);
  }
}

module.exports = {
  WebError,
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
};