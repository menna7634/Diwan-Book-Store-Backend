const Joi = require('joi');
const { BadRequestError } = require("../../shared/utils/ApiError");
const { password } = require('../../shared/utils/validators');
const LoginInputValidator = function () {
  const schema = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().required(),
  }).required();
  return async (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};

const RegisterInputValidator = function () {
  const schema = Joi.object({
    firstname: Joi.string().required().trim().min(2).max(50),
    lastname: Joi.string().required().trim().min(2).max(50),
    dob: Joi.date().required(),
    email: Joi.string().email().lowercase().required(),
    password: password,
    address: Joi.object({
      street: Joi.string().trim(),
      city: Joi.string().trim(),
      state: Joi.string().trim(),
      country: Joi.string().trim(),
      zipCode: Joi.string().trim(),
    }).required()
  }).required();
  return async (req, res, next) => {

    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};

const RefreshInputValidator = function () {
  const schema = Joi.object({
    refresh_token: Joi.string().required()
  }).required();
  return async (req, res, next) => {
    const {error, value} = schema.validate(req.body);
    if(error) throw new BadRequestError(error.details);
    req.body = value;
    next();
  };
};


module.exports = {
  LoginInputValidator,
  RegisterInputValidator,
  RefreshInputValidator,
};