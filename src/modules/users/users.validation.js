const Joi = require('joi');
const { BadRequestError } = require('../../shared/utils/ApiError');
const { password } = require('../../shared/utils/validators');

const UpdateProfileInputValidator = function () {
  const schema = Joi.object({
    firstname: Joi.string().trim().min(2).max(50).optional(),
    lastname: Joi.string().trim().min(2).max(50).optional(),
    dob: Joi.date().optional(),
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      zipCode: Joi.string().trim(),
    }).optional(),
    password: password.optional(),
    oldPassword: password.when('password', {
      is: Joi.exist(),
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
  }).required();
  return async (req, res, next) => {

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};

module.exports = {
  UpdateProfileInputValidator,
};
