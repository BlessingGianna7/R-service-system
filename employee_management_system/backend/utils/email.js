const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");
require('dotenv').config();

// Configure email transporter
// utils/email.js
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,                           // smtp.gmail.com
  port: Number(process.env.EMAIL_PORT),                   // 465
  secure: process.env.EMAIL_SECURE === 'true',            // true for SMTPS
  auth: {
    user: process.env.EMAIL,                              // your gmail address
    pass: process.env.EMAIL_PASS                          // your app password
  },
  tls: {
    rejectUnauthorized: false                             // dev only
  },
  logger: true,   // enable connection logging
  debug: true     // show SMTP traffic in console
});


// Read email template and compile with Handlebars
const readHTMLFile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
      if (err) {
        reject(err);
      } else {
        resolve(html);
      }
    });
  });
};

// Send email with template
const sendEmail = async (options) => {
  try {
    const { email, subject, template, context } = options;
    
    // Check if email credentials are configured
    if (!process.env.EMAIL && !process.env.EMAIL_USER) {
      throw new Error("Email credentials are not configured");
    }

    // Check if template path exists
    const templatePath = path.join(__dirname, `../templates/${template}.html`);
    if (!fs.existsSync(templatePath)) {
      throw new Error(`Email template not found: ${template}.html`);
    }

    // Read the HTML template
    const htmlTemplate = await readHTMLFile(templatePath);
    
    // Compile the template with Handlebars
    const compiledTemplate = handlebars.compile(htmlTemplate);
    const html = compiledTemplate(context);
    
    // Send email
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Employee Management System" <${process.env.EMAIL || process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      html: html,
    };
    
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

module.exports = { sendEmail };
