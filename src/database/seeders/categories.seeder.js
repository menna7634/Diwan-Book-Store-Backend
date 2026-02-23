require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('../models/category.model');
const config = require('../../shared/config');

const categories = [
  { name: 'fiction' },
  { name: 'non-fiction' },
  { name: 'science' },
  { name: 'history' },
  { name: 'biography' },
  { name: 'technology' },
  { name: 'philosophy' },
  { name: 'art' },
  { name: 'poetry' },
  { name: 'children' }
];

const seedCategories = async () => {
  try {
    console.log(`Connecting to MongoDB at ${config.mongoose.url}...`);
    await mongoose.connect(config.mongoose.url);
    
    await Category.deleteMany();
    console.log('Cleared existing categories');

    await Category.insertMany(categories);
    console.log(`Successfully seeded ${categories.length} categories`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories:', error);
    process.exit(1);
  }
};

seedCategories();
