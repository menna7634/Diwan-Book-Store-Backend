const { UnauthorizedError } = require("../utils/ApiError");
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require("../../database/models/user.model");

const IsAuthenticated = function () {
  return async (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) throw new UnauthorizedError({ type: "not_logged_in", detail: "Must be logged in to access this page" });
    // authorization: Bearer token
    const encodedToken = authorization.split(" ")[1];
    try {
      const payload = jwt.verify(encodedToken, config.jwt.secret);

      req.user = await User.findOne({ email: payload.email });
    } catch(e) {
      throw new UnauthorizedError({ type: "invalid_token", detail: e });
    }
    if (!req.user) throw new UnauthorizedError({ type: "user_not_found", detail: "User no longer exists" });
    next();
  };
};

// This middleware, to be used after an IsAuthenticated middleware, else it wouldn't work
const IsAdmin = function () {
  return async (req, res, next) => {
    if (!req.user || req.user.role !== "admin") {
      throw new UnauthorizedError("insufficient previliges");
    }
    next();
  };
};
module.exports = {
  IsAuthenticated,
  IsAdmin,
};

