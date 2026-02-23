const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
<<<<<<< author-routes
router.use('/authors', require('../modules/authors/authors.routes'));
router.use('/books', require('../modules/books/books.routes'));
module.exports = router;
=======
router.use('/categories', require('../modules/categories/categories.routes'));

module.exports = router;
>>>>>>> main
