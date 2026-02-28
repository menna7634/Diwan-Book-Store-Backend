const config = require('../config');
const nodemailer = require('nodemailer');
const logger = require('../utils/logger').child({ module: "mail.service" });

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.mail.gmailUser,
        pass: config.mail.appPassword,
      },
    });
    this.sender = `"Diwan" <${config.GMAIL_USER}>`;
  }

  async sendVerifcationEmail(toEmail, token) {
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    const mailOptions = {
      from: this.sender,
      to: toEmail,
      subject: "Verify your email address",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Welcome!</h2>
          <p>Click the button below to verify your email address:</p>
          <a href="${verificationUrl}" 
             style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Verify Email
          </a>
          <p>If the button doesn't work, use this link: <br> ${verificationUrl}</p>
        </div>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      logger.info({ result }, "Email sent successfully:");
      return result;
    } catch (error) {
      logger.error({ error }, "Failed to send verifcation email");
    }
  }

  async sendResetPasswordEmail(toEmail, token) {
    const verificationUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    const mailOptions = {
      from: this.sender,
      to: toEmail,
      subject: "Reset your Password",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee;">
          <h2 style="color: #333;">Hello</h2>
          <p>Click the button below to reset your password:</p>
          <a href="${verificationUrl}" 
             style="background: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p>If the button doesn't work, use this link: <br> ${verificationUrl}</p>
        </div>
      `,
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      logger.info({ result }, "Email sent successfully:");
      return result;
    } catch (error) {
      logger.error({ error }, "Failed to send verifcation email");
    }
  }
}


module.exports = new MailService();