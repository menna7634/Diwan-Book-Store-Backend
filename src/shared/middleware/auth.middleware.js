const { UnauthorizedError } = require('../utils/ApiError');
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../../database/models/user.model');

const IsAuthenticated = function () {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
      console.log('No authorization header found');
      throw new UnauthorizedError({
        type: 'not_logged_in',
        detail: 'Must be logged in to access this page',
      });
    }

    const encodedToken = authorization.split(' ')[1];
    if (!encodedToken) {
      console.log('Bearer token missing in authorization header');
      throw new UnauthorizedError({
        type: 'invalid_token',
        detail: 'Bearer token missing',
      });
    }

    try {
      const payload = jwt.verify(encodedToken, config.jwt.secret);
      req.user = await User.findOne({ email: payload.email });
    } catch (e) {
      console.log('JWT verification failed:', e);
      throw new UnauthorizedError({ type: 'invalid_token', detail: e });
    }

    if (!req.user) {
      console.log('User not found in database');
      throw new UnauthorizedError({
        type: 'user_not_found',
        detail: 'User no longer exists',
      });
    }

    console.log('Authentication passed, moving to next middleware');
    next();
  };
};

const IsAdmin = function () {
  return async (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
      console.log('User is not admin or missing');
      throw new UnauthorizedError('insufficient previliges');
    }
    next();
  };
};

module.exports = {
  IsAuthenticated,
  IsAdmin,
};
