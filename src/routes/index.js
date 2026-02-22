const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/categories', require('../modules/categories/categories.routes'));

module.exports = router;