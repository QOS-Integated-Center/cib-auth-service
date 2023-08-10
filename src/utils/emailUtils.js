const nodemailer = require('nodemailer');


class EmailUtils {
  static sendEmail = async (recipientEmail, message, subject) => {
    try {
      const mailOptions = {
        from: `"QOSCIB" <${process.env.SMTP_USERNAME}>`,
        to: recipientEmail,
        subject: subject,
        html: message,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };

  static sendTemplateEmail = async (data) => {
    try {
      const mailOptions = {
        from: process.env.SMTP_USERNAME,
        to: data.email,
        subject: data.subject,
        template: data.template,
        context: data.template_data,
      };

      await transporter.sendMail(mailOptions);
    } catch (error) {
      throw error;
    }
  };
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

module.exports = EmailUtils;
