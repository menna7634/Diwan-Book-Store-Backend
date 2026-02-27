const Review = require('../models/review.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');
const { faker } = require('@faker-js/faker');
faker.seed(123);

async function seedReviews() {
  const users = await User.find();
  const books = await Book.find();

  const reviews = [];

  function randomInt(min, max) {
    return faker.number.int({ min, max });
  }

  for (let i = 0; i < books.length; i++) {
    const user = users[i % users.length];
    const book = books[i];

    reviews.push({
      user_id: user._id,
      book_id: book._id,
      rating: randomInt(1, 5),
      comment: faker.lorem.sentences(randomInt(1, 3)),
    });
  }

  await Review.insertMany(reviews);
  console.log('Reviews seeded!');
}

module.exports = seedReviews;
