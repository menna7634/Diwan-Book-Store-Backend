const mongoose = require('mongoose');
const config = require('../shared/config/config');

const connectDB = async (expectedCollections = []) => {
  try {
    await mongoose.connect(config.mongoose.url);

    console.log(`MongoDB connected in ${config.env} mode`);

    await mongoose.connection.db.admin().ping();
    console.log('MongoDB connection verified');

    if (expectedCollections.length > 0) {
      const existingCollections = (
        await mongoose.connection.db.listCollections().toArray()
      ).map((c) => c.name);

      expectedCollections.forEach((col) => {
        if (!existingCollections.includes(col)) {
          console.warn(`Collection '${col}' does not exist yet`);
        } else {
          console.log(`Collection '${col}' exists`);
        }
      });
    }

    mongoose.connection.on('disconnected', () =>
      console.warn('MongoDB disconnected')
    );
    mongoose.connection.on('error', (err) =>
      console.error('MongoDB connection error:', err)
    );
  } catch (err) {
    console.error('MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
