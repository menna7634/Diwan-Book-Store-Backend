const Joi = require('joi');

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,10}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/;
const URL_REGEX = /^https?:\/\/.+/;
const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

const objectId = Joi.string()
  .pattern(OBJECT_ID_REGEX)
  .messages({ 'string.pattern.base': 'Invalid ID format' });

const email = Joi.string()
  .trim()
  .lowercase()
  .pattern(EMAIL_REGEX)
  .messages({ 'string.pattern.base': 'Please provide a valid email address' });

const password = Joi.string().min(8).max(64).pattern(PASSWORD_REGEX).messages({
  'string.min': 'Password must be at least 8 characters',
  'string.max': 'Password cannot exceed 64 characters',
  'string.pattern.base':
    'Password must include uppercase, lowercase, number, and special character (@$!%*?&)',
});

const confirmPassword = (ref = 'password') =>
  Joi.any()
    .valid(Joi.ref(ref))
    .required()
    .messages({ 'any.only': 'Passwords do not match' });

const isInteger = {
  validator: (v) => Number.isInteger(v),
  message: (p) => `${p.path} must be a whole number`,
};

const isPositiveMoney = {
  validator: (v) => v > 0 && Math.round(v * 100) === v * 100,
  message: (p) =>
    `${p.path} must be a positive number with at most 2 decimal places`,
};

module.exports = {
  EMAIL_REGEX,
  PASSWORD_REGEX,
  URL_REGEX,
  OBJECT_ID_REGEX,
  objectId,
  email,
  password,
  confirmPassword,
  isInteger,
  isPositiveMoney,
};
