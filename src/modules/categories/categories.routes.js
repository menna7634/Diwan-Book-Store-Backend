const express = require('express');
const router = express.Router();
const categoryController = require('./categories.controller');
const { createCategoryValidate, updateCategoryValidate } = require('./categories.validation');
const { IsAuthenticated, IsAdmin } = require('../../shared/middleware/auth.middleware');

router.get('/', categoryController.getAllCategories);
router.post('/', IsAuthenticated(), IsAdmin(), createCategoryValidate(), categoryController.createCategory);
router.put('/:id', IsAuthenticated(), IsAdmin(), updateCategoryValidate(), categoryController.updateCategory);
router.delete('/:id', IsAuthenticated(), IsAdmin(), categoryController.deleteCategory);

module.exports = router;