const express = require("express")
const router = express.Router()
const { body } = require("express-validator")
const { register, verifyEmail, resendOTP, login } = require("../controllers/authController")
const { validate, registerValidation, loginValidation, otpValidation } = require("../middleware/validation")

// Auth routes
router.post("/signup", validate(registerValidation), register)
router.post("/verify-email", validate(otpValidation), verifyEmail)
router.post(
  "/resend-otp",
  validate([
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Please provide a valid email"),
  ]),
  resendOTP,
)
router.post("/login", validate(loginValidation), login)

module.exports = router
