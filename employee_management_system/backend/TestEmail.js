// testEmail.js
const { sendEmail } = require('./utils/email');

async function testEmailSending() {
  try {
    await sendEmail({
      email: "blessinggianna7@gmail.com", // Use your actual email for testing
      subject: "Test Email",
      template: "verification",
      context: {
        username: "Test User",
        otp: "123456",
      },
    });
    console.log("Test email sent successfully!");
  } catch (error) {
    console.error("Failed to send test email:", error);
  }
}

testEmailSending();