const express = require('express');
const router = express.Router();
const booksValidators = require('./books.validation');
const booksController = require('./books.controller');
const booksMiddleware = require('./books.middleware');

router.get('/', booksController.listBooks);

router.post(
  '/',
  booksMiddleware.uploadBookCover,
  booksMiddleware.normalizeBookFormBody,
  booksValidators.validateCreateBookInput,
  booksController.createBook
);

router.patch(
  '/:id',
  booksMiddleware.uploadBookCover,
  booksMiddleware.normalizeBookFormBody,
  booksValidators.validateUpdateBookInput,
  booksController.updateBook
);

router.delete(
  '/:id',
  booksValidators.validateBookIdParam,
  booksController.deleteBook
);

module.exports = router;
