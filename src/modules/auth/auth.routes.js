const express = require("express");
const router = express.Router();
const authValidators = require('./auth.validation');
const authController = require('./auth.controller');
const { IsAuthenticated } = require("../../shared/middleware/auth.middleware");
const { BadRequestError } = require("../../shared/utils/ApiError");
const { makeLimiter } = require('../../shared/middleware/ratelimiter');


router.post('/login',
  makeLimiter(15 * 60 * 1000 , 5),
  authValidators.LoginInputValidator(),
  async (req, res) => {
    const tokens = await authController.login(req.body);
    res.json(tokens);
  }
);

router.post('/register',
  makeLimiter(15 * 60 * 1000 , 5),

  authValidators.RegisterInputValidator(),
  async (req, res) => {
    const user = await authController.register(req.body);
    res.json(user);
  }
);

router.post('/refresh',
  makeLimiter(15 * 60 * 1000 , 5),

  authValidators.RefreshInputValidator(),
  async (req, res) => {
    return res.json({
      access_token: await authController.refreshAccessToken(req.body.refresh_token)
    });
  }
);
router.post('/logout', IsAuthenticated(),
  makeLimiter(15 * 60 * 1000 , 5),
  async (req, res) => {
    await authController.logout(req.user._id);
    res.sendStatus(200);
  }
);

router.get('/verify',
  makeLimiter(15 * 60 * 1000 , 5),

  async (req, res) => {
    const { token } = req.query;
    if (!token) throw new BadRequestError({ "type": "missing_token" });
    await authController.verifyEmail(token);

    return res.json({ "message": "Email is verified" });
  }
);
module.exports = router;