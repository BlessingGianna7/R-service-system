const crypto = require("crypto")

// Generate a random OTP
const generateOTP = (length = 6) => {
  const digits = "0123456789"
  let OTP = ""

  for (let i = 0; i < length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)]
  }

  return OTP
}

// Hash OTP for storage
const hashOTP = (otp) => {
  return crypto.createHash("sha256").update(otp.toString()).digest("hex")
}

// Verify OTP
const verifyOTP = (inputOTP, hashedOTP) => {
  const hashedInput = hashOTP(inputOTP)
  return hashedInput === hashedOTP
}

module.exports = {
  generateOTP,
  hashOTP,
  verifyOTP,
}
