const Joi = require('joi');
const { BadRequestError } = require('../../shared/utils/ApiError');

const schema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required()
    .messages({
      'string.empty': 'Category must be not empty',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Category name is required'
    })
});

const createCategoryValidate = function () {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};

const updateCategoryValidate = function () {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};

module.exports = { createCategoryValidate, updateCategoryValidate };