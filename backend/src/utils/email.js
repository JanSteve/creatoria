/**
 * Send an email to a recipient.
 * Currently a stub that logs to console.
 *
 * TODO: Replace with production SMTP integration (e.g., SendGrid, AWS SES, Nodemailer).
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject line.
 * @param {string} html - HTML body content.
 * @returns {Promise<void>}
 */
const sendEmail = async (to, subject, html) => {
  console.log('📧 Email stub - would send:');
  console.log(`  To: ${to}`);
  console.log(`  Subject: ${subject}`);
  console.log(`  Body: ${html.substring(0, 200)}...`);

  // TODO: Production implementation example with Nodemailer:
  //
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransport({
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   auth: {
  //     user: process.env.SMTP_USER,
  //     pass: process.env.SMTP_PASS,
  //   },
  // });
  //
  // await transporter.sendMail({
  //   from: `"Creatoria" <noreply@creatoria.com>`,
  //   to,
  //   subject,
  //   html,
  // });

  return Promise.resolve();
};

module.exports = { sendEmail };
