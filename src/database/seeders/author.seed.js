const Author = require('../models/author.model');
const { faker } = require('@faker-js/faker');
faker.seed(123);

async function seedAuthors() {
  const authors = [];
  const names = [
    'J.K. Rowling',
    'George Orwell',
    'Yuval Noah Harari',
    'Malcolm Gladwell',
    'نجيب محفوظ',
    'أحمد خالد توفيق',
    'Paulo Coelho',
  ];

  for (let i = 0; i < names.length; i++) {
    authors.push({
      name: names[i],
      bio: faker.lorem.sentences(3),
    });
  }

  await Author.insertMany(authors);
  console.log('Authors seeded!');
}

module.exports = seedAuthors;
