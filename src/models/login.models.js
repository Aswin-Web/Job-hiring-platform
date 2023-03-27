const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    authCode: {
      type: Number,
      default: 1234,
    },
    authCodeCreatedAt: {
      type: Date,
      default: Date.now,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Login = mongoose.model("Login", LoginSchema);
module.exports = Login;
