const Category = require('../../database/models/category.model');
const { NotFoundError, BadRequestError } = require('../../shared/utils/ApiError');

const getAllCategories = async ({ page = 1, limit = 10 }) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    Category.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Category.countDocuments()
  ]);

  return {
    categories,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    }
  };
};

const createCategory = async ({ name }) => {
  const exists = await Category.findOne({ name: name.toLowerCase() });
  if (exists) throw new BadRequestError('Category name already exists');

  const category = await Category.create({ name });
  return category;
};

const updateCategory = async (id, { name }) => {
  const exists = await Category.findOne({ name: name.toLowerCase() });
  if (exists) throw new BadRequestError('Category name already exists');

  const category = await Category.findByIdAndUpdate(
    id,
    { name },
    { new: true, runValidators: true }
  );
  if (!category) throw new NotFoundError('Category not found');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new NotFoundError('Category not found');

  const Book = require('../../database/models/book.model');
  const booksCount = await Book.countDocuments({ categories: id });
  if (booksCount > 0) throw new BadRequestError('Cannot delete category with linked books');

  await category.deleteOne();
  return { message: 'Category deleted successfully' };
};

module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory
};