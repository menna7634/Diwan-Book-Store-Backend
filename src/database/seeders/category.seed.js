const Category = require('../models/category.model');

async function seedCategories() {
  const categoriesData = [
    'fiction',
    'non-fiction',
    'fantasy',
    'science',
    'history',
    'technology',
    'biography',
    'self-help',
    'romance',
    'mystery',
    'رواية',
    'علوم',
    'تاريخ',
    'تكنولوجيا',
  ];

  const categories = categoriesData.map((name) => ({ name }));

  await Category.insertMany(categories);
  console.log('Categories seeded!');
}

module.exports = seedCategories;
