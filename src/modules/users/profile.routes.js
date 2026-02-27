const express = require('express');
const usersController = require('./users.controller');
const { IsAuthenticated } = require('../../shared/middleware/auth.middleware');
const { UpdateProfileInputValidator } = require('./users.validation');
const router = express.Router();

router.get('',
  IsAuthenticated(),
  async (req, res) => {
    const user = await usersController.getUser(req.user.email);
    res.json(user);
  }
);

router.patch('', 
  IsAuthenticated(),
  UpdateProfileInputValidator(),
  async (req, res) => {
    const user = await usersController.updateUser(req.user.email, req.body);
    return res.json(user);
  }
);
module.exports = router;