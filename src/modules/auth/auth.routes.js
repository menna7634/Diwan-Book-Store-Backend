const express = require("express");
const router = express.Router();
const authValidators = require('./auth.validation');
const authController = require('./auth.controller');
const { IsAuthenticated } = require("../../shared/middleware/auth.middleware");
const { BadRequestError } = require("../../shared/utils/ApiError");
const { makeLimiter } = require('../../shared/middleware/ratelimiter');
const MailService = require('../../shared/services/mail.service');
const logger = require('../../shared/utils/logger').child({module: 'auth.routes'});
router.post('/login',
  makeLimiter(15 * 60 * 1000, 5),
  authValidators.LoginInputValidator(),
  async (req, res) => {
    const tokens = await authController.login(req.body);
    res.json(tokens);
  }
);

router.post('/register',
  makeLimiter(15 * 60 * 1000, 5),

  authValidators.RegisterInputValidator(),
  async (req, res) => {
    const user = await authController.register(req.body);
    res.json(user);
  }
);

router.post('/refresh',
  makeLimiter(15 * 60 * 1000, 5),

  authValidators.RefreshInputValidator(),
  async (req, res) => {
    return res.json({
      access_token: await authController.refreshAccessToken(req.body.refresh_token)
    });
  }
);
router.post('/logout', IsAuthenticated(),
  makeLimiter(15 * 60 * 1000, 5),
  async (req, res) => {
    await authController.logout(req.user._id);
    res.sendStatus(200);
  }
);

router.get('/verify',
  makeLimiter(15 * 60 * 1000, 5),

  async (req, res) => {
    const { token } = req.query;
    if (!token) throw new BadRequestError({ "type": "missing_token" });
    await authController.verifyEmail(token);

    return res.json({ "message": "Email is verified" });
  }
);

//forget password request should send an email with a valid access token
router.post('/forget-password',
  makeLimiter(60 * 60 * 1000, 5),
  authValidators.ForgetPasswordValidator(),
  async (req, res) => {
    try {

      const token = await authController.forgetPassword(req.body);
      MailService.sendResetPasswordEmail(req.body.email, token);

    } catch (error) {
      logger.warn({error}, "Error during forget password");
    }
    return res.json({ "message": "if the email exists, an email with a password reset link have been seny" });
  }
);

router.post('/reset-password',
  makeLimiter(60 * 60 * 1000, 5),
  authValidators.resetPasswordValidator(),
  async (req, res) => {
    console.log(req.body);
    await authController.resetPassword(req.body);
    return res.json({ "message": "passward has been reset" });
  }
);

module.exports = router;