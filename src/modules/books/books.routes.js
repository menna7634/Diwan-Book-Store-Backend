const express = require('express');
const router = express.Router();
const booksValidators = require('./books.validation');
const booksController = require('./books.controller');
const booksMiddleware = require('./books.middleware');
const { IsAuthenticated, IsAdmin } = require('../../shared/middleware/auth.middleware');

router.get('/', booksController.listBooks);

router.post(
  '/',
  IsAuthenticated(),
  IsAdmin(),
  booksMiddleware.uploadBookCover,
  booksMiddleware.normalizeBookFormBody,
  booksValidators.validateCreateBookInput,
  booksController.createBook
);

router.patch(
  '/:id',
  IsAuthenticated(),
  IsAdmin(),
  booksMiddleware.uploadBookCover,
  booksMiddleware.normalizeBookFormBody,
  booksValidators.validateUpdateBookInput,
  booksController.updateBook
);

router.delete(
  '/:id',
  IsAuthenticated(),
  IsAdmin(),
  booksValidators.validateBookIdParam,
  booksController.deleteBook
);

module.exports = router;
