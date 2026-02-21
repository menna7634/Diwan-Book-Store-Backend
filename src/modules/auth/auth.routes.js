const express = require("express");
const router = express.Router();
const authValidators = require('./auth.validation');
const authController = require('./auth.controller');
const { IsAuthenticated } = require("../../shared/middleware/auth.middleware");



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

router.post('/refresh',
  authValidators.RefreshInputValidator(),
  async (req, res) => {
    return res.json({
      access_token: await authController.refreshAccessToken(req.body.refresh_token)
    });
  }
);
router.post('/logout', IsAuthenticated(),
  async (req, res) => {
    await authController.logout(req.user._id);
    res.sendStatus(200);
  }
);

module.exports = router;