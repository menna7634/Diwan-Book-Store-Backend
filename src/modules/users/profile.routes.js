const express = require('express');
const usersController = require('./users.controller');
const { IsAuthenticated } = require('../../shared/middleware/auth.middleware');
const router = express.Router();

router.get('',
  IsAuthenticated(),
  async (req, res) => {
    const user = await usersController.getUser(req.user.email);
    res.json(user);
  }
);

module.exports = router;