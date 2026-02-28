
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
    if (error) return next(new BadRequestError(error.details));
    req[target] = value;
    next();
  };
};

const PlaceOrderValidator = () =>
  validate(
    Joi.object({
      payment_method: Joi.string()
        .valid('card', 'cash_on_delivery', 'paypal')
        .default('cash_on_delivery'),
      shipping_details: Joi.object({
        fullName: Joi.string().trim().required(),
        phone: Joi.string()
          .pattern(/^(010|011|012)\d{8}$/)
          .trim()
          .required()
          .messages({
            'string.pattern.base':
              'Phone must be 11 digits starting with 010, 011, or 012',
          }),
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim(),
        country: Joi.string().trim().required(),
        zipCode: Joi.string()
          .pattern(/^\d+$/)
          .trim()
          .messages({ 'string.pattern.base': 'Zip code must be numbers only' }),
      }).required(),
    })
  );

const GetOrdersValidator = () =>
  validate(
    Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
      order_status: Joi.string().valid(
        'placed',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ),
      payment_status: Joi.string().valid(
        'pending',
        'paid',
        'failed',
        'refunded'
      ),
      from: Joi.date().iso(),
      to: Joi.date().iso(),
    }),
    'query'
  );

const OrderIdParamValidator = () =>
  validate(
    Joi.object({
      orderId: mongoId.required(),
    }),
    'params'
  );

const UpdateOrderStatusValidator = () =>
  validate(
    Joi.object({
      order_status: Joi.string().valid(
        'processing',
        'shipped',
        'delivered',
        'cancelled'
      ),
      payment_status: Joi.string().valid(
        'pending',
        'paid',
        'failed',
        'refunded'
      ),
      note: Joi.string().trim().max(500),
    }).or('order_status', 'payment_status')
  );

module.exports = {
  PlaceOrderValidator,
  GetOrdersValidator,
  OrderIdParamValidator,
  UpdateOrderStatusValidator,
};
