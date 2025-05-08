const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sequelize = require("../config/db");
const { generateOTP, hashOTP, verifyOTP } = require("../utils/otp");
const { sendEmail } = require("../utils/email");
require('dotenv').config();

// Create JWT token
const createToken = (user) => {
  return jwt.sign(
    { 
      userId: user.id, 
      username: user.username,
      email: user.email, 
      role: user.role 
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_LIFETIME || "1d" }
  );
};

// Register user
const register = async (req, res) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    const { username, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      where: { email },
      transaction
    });

    if (existingUser) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // OTP expires in 10 minutes
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Create user with OTP
    const newUser = await User.create({
      username,
      email,
      password,
      role: role || "employee",
      isVerified: false,
      otpCode: hashedOTP,
      otpExpiresAt: otpExpiry
    }, { transaction });

    // Commit transaction before sending email
    await transaction.commit();
    transaction = null; // Clear transaction reference

    try {
      // Send verification email
      await sendEmail({
        email: email,
        subject: "Email Verification - Employee Management System",
        template: "verification",
        context: {
          username: username,
          otp: otp,
        },
      });

      res.status(201).json({
        success: true,
        message: "Registration successful. Please check your email for verification code.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // User is already created at this point, so we return success but with a warning
      res.status(201).json({
        success: true,
        message: "Registration successful, but we couldn't send the verification email. Please contact support.",
        warning: "Email service unavailable",
      });
    }
  } catch (error) {
    // Only rollback transaction if it exists and hasn't been committed/rolled back yet
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Verify OTP
const verifyEmail = async (req, res) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Check if OTP exists and is not expired
    if (!user.otpCode || !user.otpExpiresAt) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired. Please request a new one.",
      });
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otpExpiresAt)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please request a new one.",
      });
    }

    // Verify OTP
    if (!verifyOTP(otp, user.otpCode)) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Update user as verified and clear OTP
    await user.update({
      isVerified: true,
      otpCode: null,
      otpExpiresAt: null
    }, { transaction });

    await transaction.commit();
    transaction = null; // Clear transaction reference

    res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    // Only rollback transaction if it exists and hasn't been committed/rolled back yet
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Verification error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Resend OTP
const resendOTP = async (req, res) => {
  let transaction;
  
  try {
    transaction = await sequelize.transaction();
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ 
      where: { email },
      transaction
    });

    if (!user) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if user is already verified
    if (user.isVerified) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Generate new OTP
    const otp = generateOTP();
    const hashedOTP = hashOTP(otp);

    // OTP expires in 10 minutes
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

    // Update user with new OTP
    await user.update({
      otpCode: hashedOTP,
      otpExpiresAt: otpExpiry
    }, { transaction });

    await transaction.commit();
    transaction = null; // Clear transaction reference

    try {
      // Send verification email
      await sendEmail({
        email: user.email,
        subject: "Email Verification - Employee Management System",
        template: "verification",
        context: {
          username: user.username,
          otp: otp,
        },
      });

      res.status(200).json({
        success: true,
        message: "Verification code sent. Please check your email.",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      res.status(200).json({
        success: true,
        message: "OTP updated successfully, but we couldn't send the verification email. Please contact support.",
        warning: "Email service unavailable",
      });
    }
  } catch (error) {
    // Only rollback transaction if it exists and hasn't been committed/rolled back yet
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    console.error("Resend OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    // Check password
    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // Create token
    const token = createToken(user);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  resendOTP,
  login,
};