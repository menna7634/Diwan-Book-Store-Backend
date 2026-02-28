const ratelimit = require('express-rate-limit');

const limiter = ratelimit({
  //AI generated
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 100, // Limit each IP to 100 requests per `window`
  standardHeaders: 'draft-7', // combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: 'Too many requests, please try again later.',
});
function makeLimiter(windowMs, limit) {
  return ratelimit({
    windowMs: windowMs, // 15 minutes
    limit: limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
  });
};

module.exports = {
  limiter,
  makeLimiter
};
