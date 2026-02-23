const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/profile', require('../modules/users/profile.routes'));
router.use('/authors', require('../modules/authors/authors.routes'));
router.use('/books', require('../modules/books/books.routes'));
router.use('/categories', require('../modules/categories/categories.routes'));

module.exports = router;
