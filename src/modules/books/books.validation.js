const Joi = require('joi');
const { BadRequestError } = require('../../shared/utils/ApiError');
const { URL_REGEX, OBJECT_ID_REGEX } = require('../../shared/utils/validators');

const mongoose = require('mongoose');

const createSchema = Joi.object({
  author_id: Joi.string()
    .pattern(OBJECT_ID_REGEX)
    .required()
    .messages({ 'string.pattern.base': 'Invalid author ID' }),
  categories: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_REGEX))
    .min(1)
    .required()
    .messages({ 'string.pattern.base': 'Invalid category ID' }),
  book_title: Joi.string().trim().min(1).max(300).required(),
  book_cover_url: Joi.string()
    .trim()
    .pattern(URL_REGEX)
    .allow('', null)
    .optional(),
  price: Joi.number().positive().min(0.01).max(999999.99).precision(2).required(),
  stock: Joi.number().integer().min(0).optional().default(0),
}).required();

const updateSchema = Joi.object({
  author_id: Joi.string()
    .pattern(OBJECT_ID_REGEX)
    .messages({ 'string.pattern.base': 'Invalid author ID' }),
  categories: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_REGEX))
    .min(1)
    .messages({ 'string.pattern.base': 'Invalid category ID' }),
  book_title: Joi.string().trim().min(1).max(300),
  book_cover_url: Joi.string()
    .trim()
    .pattern(URL_REGEX)
    .allow('', null),
  price: Joi.number().positive().min(0.01).max(999999.99).precision(2),
  stock: Joi.number().integer().min(0),
})
  .min(1)
  .required();

const validateCreateBookInput = async (req, res, next) => {
  const { error, value } = createSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    throw new BadRequestError(messages);
  }
  req.body = value;
  next();
};

const validateUpdateBookInput = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid book ID');
  }
  const { error, value } = updateSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    throw new BadRequestError(messages);
  }
  req.body = value;
  next();
};

const validateBookIdParam = async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new BadRequestError('Invalid book ID');
  }
  next();
};

module.exports = { validateCreateBookInput, validateUpdateBookInput, validateBookIdParam };
