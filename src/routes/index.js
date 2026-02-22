const express = require('express');


const router = express.Router();


router.use('/auth', require('../modules/auth/auth.routes'));
router.use('/profile', require('../modules/users/profile.routes'));
module.exports = router;