const config = require('../config');
const nodemailer = require('nodemailer');

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
      console.log("Email sent successfully:", result.messageId);
      return result;
    } catch (error) {
      console.error("Gmail SMTP Error:", error);
    }
  }
}


module.exports = new MailService();