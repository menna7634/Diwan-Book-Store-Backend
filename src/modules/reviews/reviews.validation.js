const Joi = require('joi');
const { BadRequestError } = require('../../shared/utils/ApiError');
const { OBJECT_ID_REGEX } = require('../../shared/utils/validators');

const mongoId = Joi.string()
  .pattern(OBJECT_ID_REGEX)
  .message('Invalid MongoDB ObjectId');

const validate = (schema, target = 'body') => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req[target], { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req[target] = value;
    next();
  };
};

const AddReviewValidate = () =>
  validate(
    Joi.object({
      book_id: mongoId.required(),
      rating: Joi.number().integer().min(1).max(5).required()
        .messages({
          'number.min': 'Rating must be at least 1',
          'number.max': 'Rating cannot exceed 5',
          'any.required': 'Rating is required'
        }),
      comment: Joi.string().trim().max(500).allow('').optional()
        .messages({
          'string.max': 'Comment cannot exceed 500 characters'
        })
    })
  );

const GetReviewsValidate = () =>
  validate(
    Joi.object({
      book_id: mongoId.required(),
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10)
    }),
    'query'
  );

const ReviewIdParamValidate = () =>
  validate(
    Joi.object({
      id: mongoId.required()
    }),
    'params'
  );

module.exports = {
  AddReviewValidate,
  GetReviewsValidate,
  ReviewIdParamValidate
};