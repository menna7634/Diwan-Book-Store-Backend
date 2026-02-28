const connectDB = require('../connection');
const seedAuthors = require('./author.seed');
const seedCategories = require('./category.seed');
const seedUsers = require('./user.seed');
const seedBooks = require('./book.seed');
const seedReviews = require('./review.seed');
const seedCarts = require('./cart.seed');
const seedOrders = require('./order.seed');

async function seed() {
  try {
    await connectDB([
      'authors',
      'categories',
      'users',
      'books',
      'reviews',
      'carts',
      'orders',
    ]);

    console.log('MongoDB connected and verified');

    const mongoose = require('mongoose');
    await mongoose.connection.db.dropDatabase();
    console.log('Database cleared');

    await seedAuthors();
    await seedCategories();
    await seedUsers();
    await seedBooks();
    await seedReviews();
    await seedCarts();
    await seedOrders();

    console.log('All data seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    process.exit(1);
  }
}

seed();
