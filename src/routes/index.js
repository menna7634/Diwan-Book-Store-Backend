const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/authors', require('../modules/authors/authors.routes'));
router.use('/books', require('../modules/books/books.routes'));
module.exports = router;
