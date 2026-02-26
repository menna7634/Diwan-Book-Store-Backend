const express = require('express');
const router = express.Router();
const authorsValidators = require('./authors.validation');
const authorsController = require('./authors.controller');
const { IsAuthenticated, IsAdmin } = require('../../shared/middleware/auth.middleware');

router.get('/', authorsController.listAuthors);

router.post(
  '/',
  IsAuthenticated(),
  IsAdmin(),
  authorsValidators.validateCreateAuthorInput,
  async (req, res) => {
    const author = await authorsController.createAuthor(req.body);
    res.status(201).json(author);
  }
);

router.patch(
  '/:id',
  IsAuthenticated(),
  IsAdmin(),
  authorsValidators.validateUpdateAuthorInput,
  async (req, res) => {
    const author = await authorsController.updateAuthor(req.params.id, req.body);
    res.json(author);
  }
);

module.exports = router;
