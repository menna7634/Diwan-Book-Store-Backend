const Book = require('../models/book.model');
const Author = require('../models/author.model');
const Category = require('../models/category.model');
const { faker } = require('@faker-js/faker');

faker.seed(123);

async function seedBooks() {
  const authors = await Author.find();
  const categories = await Category.find();

  if (!authors.length || !categories.length)
    return console.log('No authors or categories!');

  const books = [];
  const titles = [
    'Clean Code',
    'Atomic Habits',
    '1984',
    'The Hobbit',
    'Deep Work',
    'Sapiens',
    'The Lean Startup',
    'Harry Potter',
    'The Shining',
    "Hitchhiker's Guide",
    'أولاد حارتنا',
    'رواية سراب',
    'الموسم الأخير',
  ];

  function getRandomCategories(categories) {
    const count = faker.number.int({ min: 1, max: 2 });
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  for (let i = 0; i < titles.length; i++) {
    const randomAuthor =
      authors[faker.number.int({ min: 0, max: authors.length - 1 })];
    const randomCategories = getRandomCategories(categories);

    books.push({
      author_id: randomAuthor._id,
      categories: randomCategories.map((c) => c._id),
      book_title: titles[i],
      description: faker.lorem.sentences(faker.number.int({ min: 2, max: 5 })),
      book_cover_url: faker.image.urlPicsumPhotos({ width: 200, height: 300 }),
      price: faker.commerce.price({ min: 10, max: 500, dec: 2 }),
      stock: faker.number.int({ min: 0, max: 200 }),
    });
  }

  await Book.insertMany(books);
  console.log('Books seeded!');
}

module.exports = seedBooks;
