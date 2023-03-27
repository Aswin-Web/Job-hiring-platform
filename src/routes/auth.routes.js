const express = require("express");

const router = express.Router();

// Import controllers
const {
  createUser,
  VerfiyUserEmail,
  loginUser,
  getOTPMail,
  verifyOTP,
  resetPassword,
} = require("../controllers/auth.controller");

// User Creation Routes
router.route("/user").post(createUser);

// Email Verification
router.route("/verify/:id").get(VerfiyUserEmail);

// Login User for the User
router.route("/login").post(loginUser);

// Generate OTP via mail
router.route("/reset").post(getOTPMail);

// Check The OTP
router.route("/check").post(verifyOTP);

// Change the Password (FORGOT PASSWORD)
router.route("/change").put(resetPassword);

module.exports = router;
