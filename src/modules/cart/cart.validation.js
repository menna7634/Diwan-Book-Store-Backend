const { BadRequestError } = require('../../shared/utils/ApiError');
const Joi = require('joi');

const mongoId = Joi.string()
  .pattern(/^[a-fA-F0-9]{24}$/)
  .message('Invalid MongoDB ObjectId');

const validate = (schema, target = 'body') => {
  return async (req, res, next) => {
    const { error, value } = schema.validate(req[target], {
      abortEarly: false,
    });

    if (error) {
      return next(new BadRequestError(error.details));
    }
    next();
  };
};

const GetCartValidator = () =>
  validate(
    Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
    }),
    'query'
  );

const AddItemValidator = () =>
  validate(
    Joi.object({
      bookId: mongoId.required(),
      quantity: Joi.number().integer().min(1).max(99).required(),
      price: Joi.number().positive().precision(2).required(),
    })
  );

const SetQuantityValidator = () =>
  validate(
    Joi.object({
      quantity: Joi.number().integer().min(1).max(99).required(),
    })
  );

const ChangeStepValidator = () =>
  validate(
    Joi.object({
      step: Joi.number().integer().min(1).default(1),
    })
  );

const BookIdParamValidator = () =>
  validate(
    Joi.object({
      bookId: mongoId.required(),
    }),
    'params'
  );

module.exports = {
  GetCartValidator,
  AddItemValidator,
  SetQuantityValidator,
  ChangeStepValidator,
  BookIdParamValidator,
};
