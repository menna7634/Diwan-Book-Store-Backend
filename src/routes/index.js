const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/authors', require('../modules/authors/authors.routes'));
module.exports = router;
