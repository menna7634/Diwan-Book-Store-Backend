const Cart = require('../models/cart.model');
const User = require('../models/user.model');
const Book = require('../models/book.model');

async function seedCarts() {
  const users = await User.find();
  const books = await Book.find();

  const carts = [];

  for (const user of users) {
    carts.push({
      user_id: user._id,
      items: [
        {
          book_id: books[0]._id,
          quantity: 1,
          price: books[0].price,
        },
      ],
    });
  }

  await Cart.insertMany(carts);
  console.log('Carts seeded!');
}

module.exports = seedCarts;
