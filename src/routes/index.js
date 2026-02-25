const express = require('express');

const router = express.Router();

router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/profile', require('../modules/users/profile.routes'));
router.use('/authors', require('../modules/authors/authors.routes'));
router.use('/books', require('../modules/books/books.routes'));
router.use('/categories', require('../modules/categories/categories.routes'));
router.use('/cart', require('../modules/cart/cart.routes'));
router.use('/order', require('../modules/orders/orders.routes'));
router.use('/reviews', require('../modules/reviews/reviews.routes'));

module.exports = router;
