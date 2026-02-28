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
        phone: Joi.string().trim(),
        street: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim(),
        country: Joi.string().trim().required(),
        zipCode: Joi.string().trim(),
      }).required(),
    })
  );

const GetOrdersValidator = () =>
  validate(
    Joi.object({
      page: Joi.number().integer().min(1).default(1),
      limit: Joi.number().integer().min(1).max(100).default(10),
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
