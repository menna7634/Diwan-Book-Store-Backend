const express = require('express');
const router = express.Router();
const authorsValidators = require('./authors.validation');
const authorsController = require('./authors.controller');

router.get('/', async (req, res) => {
  const authors = await authorsController.listAuthors();
  res.json(authors);
});

router.post(
  '/',
  authorsValidators.validateCreateAuthorInput,
  async (req, res) => {
    const author = await authorsController.createAuthor(req.body);
    res.status(201).json(author);
  }
);

router.patch(
  '/:id',authorsValidators.validateUpdateAuthorInput, async (req, res) => {
    const author = await authorsController.updateAuthor(req.params.id, req.body);
    res.json(author);
  }
);

module.exports = router;
