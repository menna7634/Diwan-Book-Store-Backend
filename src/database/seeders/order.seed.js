const Order = require('../models/order.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');
const { faker } = require('@faker-js/faker');
faker.seed(123);

async function seedOrders() {
  const users = await User.find();
  const books = await Book.find();

  if (!users.length || !books.length) return console.log('No users or books!');

  const orders = [];

  function randomElement(arr) {
    return arr[faker.number.int({ min: 0, max: arr.length - 1 })];
  }

  for (let i = 0; i < 30; i++) {
    const user = users[i % users.length];
    const orderBooks = [books[i % books.length]];

    orders.push({
      user_id: user._id,
      payment_method: randomElement(['card', 'cash_on_delivery', 'paypal']),
      payment_status: randomElement(['pending', 'paid', 'failed']),
      order_status: randomElement([
        'placed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
      ]),
      shipping_details: {
        fullName: `${user.firstname} ${user.lastname}`,
        phone: faker.phone.number(),
        street: user.address?.street || '123 Default St',
        city: user.address?.city || 'Cairo',
        state: user.address?.state || '',
        country: user.address?.country || 'Egypt',
      },
      books: orderBooks.map((b) => ({
        book_id: b._id,
        name: b.book_title,
        quantity: faker.number.int({ min: 1, max: 3 }),
        price: b.price,
      })),
    });
  }

  await Order.insertMany(orders);
  console.log('Orders seeded!');
}

module.exports = seedOrders;
