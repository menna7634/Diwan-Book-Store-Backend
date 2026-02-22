const categoryService = require('./categories.service');

const getAllCategories = async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.max(1, parseInt(req.query.limit) || 10);
  const result = await categoryService.getAllCategories({ page, limit });
  res.status(200).json({
    success: true,
    data: result.categories,
    pagination: result.pagination
  });
};

const createCategory = async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    success: true,
    message: 'Category created successfully',
    data: category
  });
};

const updateCategory = async (req, res) => {
  const category = await categoryService.updateCategory(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: 'Category updated successfully',
    data: category
  });
};

const deleteCategory = async (req, res) => {
  const result = await categoryService.deleteCategory(req.params.id);
  res.status(200).json({
    success: true,
    message: result.message
  });
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};