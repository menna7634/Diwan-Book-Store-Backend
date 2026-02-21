const express = require("express");
const router = express.Router();
const authValidators = require('./auth.validation');
const authController = require('./auth.controller');



router.post('/login',
  authValidators.LoginInputValidator(),
  async (req, res) => {
    const tokens = await authController.login(req.body);
    res.json(tokens);
  }
);

router.post('/register',
  authValidators.RegisterInputValidator(),
  async (req, res) => {
    const user = await authController.register(req.body);
    res.json(user);
  }
);

module.exports = router;