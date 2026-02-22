const mongoose = require('mongoose');
const Joi = require('joi');
const { BadRequestError } = require('../../shared/utils/ApiError');

const createSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200).required(),
  bio: Joi.string().trim().max(2000).allow(''),
}).required();

const updateSchema = Joi.object({
  name: Joi.string().trim().min(2).max(200),
  bio: Joi.string().trim().max(2000).allow(''),
})
  .min(1)
  .required();

const validateCreateAuthorInput = async (req, res, next) => {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    throw new BadRequestError(messages);
  }
  req.body = value;
  next();
};

const validateUpdateAuthorInput = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid author ID');
  }
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map(d => d.message);
    throw new BadRequestError(messages);
  }
  req.body = value;
  next();
};

module.exports = { validateCreateAuthorInput, validateUpdateAuthorInput };
