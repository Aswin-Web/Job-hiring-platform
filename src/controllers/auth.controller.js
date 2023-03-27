const Login = require("../models/login.models");
const SendSMS = require("../utils/twillo.sms");
const Mail = require("../utils/nodemailer.email");
const jwt = require("jsonwebtoken");
const { hashPassword, compareHash } = require("../utils/bcrypt");

// JWT Token Generator -EMAIL
const generateToken = require("../utils/jwt.EMAIL");
// FOR CLIENLT
const clientJWTToken = require("../utils/jwt.token");

/*
Route         /auth/user
Description   To Save an user
Access        PUBLIC
Parameter     None
Method        POST
*/
const createUser = async (req, res, next) => {
  try {
    const role = "Jobseeker";
    const authCode = Math.floor(1000 + Math.random() * 9000);
    const { email, username, password, phone } = req.body;
    const hash = await hashPassword(password);
    const user = await Login.create({
      email,
      username,
      password: hash,
      role,
      phone,
      authCode,
    });
    const VerifyJWT = await generateToken(user._id, authCode);
    const htmlText = `<h1>You have successfully created your Account</h1>
                      <h3>Please click the verify button or copy and paste the link in the browser</h3>
                      <a href="http://${req.hostname}:${req.socket.localPort}/auth/verify/${VerifyJWT}"><button>Verify</button></a>
                      <h3>Or</h3>
                      <p>http://${req.hostname}:${req.socket.localPort}/auth/verify/${VerifyJWT}</p>`;

    Mail(email, "Success", htmlText);
    // SendSMS(authCode); OTP Message Sender
    res.status(201).json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Bad Request" });
  }
};

/*
Route         /auth/verify/:JWT_Token
Description   To Save an user
Access        PUBLIC
Parameter     /JWT_Token
Method        GET
*/
const VerfiyUserEmail = async (req, res, next) => {
  try {
    const _id = req.params.id;
    //Token Information
    const user = await jwt.verify(_id, process.env.JWT_KEY);
    // Database Information about the current user
    const User = await Login.findById({ _id: user._id });
    if (User && !User.isEmailVerified && user.code === User.authCode) {
      const updated = await Login.updateOne(
        { _id: user._id },
        { isEmailVerified: true }
      );
      res
        .status(200)
        .json({ msg: "Successfully verified the User && Please do login..." });
    } else {
      res.status(400).json({ msg: "User already Verified" });
    }
  } catch (error) {
    return next();
  }
};

/*
Route         /auth/login
Description   To login to the  user
Access        PUBLIC
Parameter     /
Method        POST
*/
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const User = await Login.findOne({ email: email }).select(
        "password isEmailVerified username role email"
      );
      const checkPassword = await compareHash(password, User.password);
      if (User && checkPassword) {
        if (User.isEmailVerified===false){
          return res.status(400).json({msg:"please verify your mail"})
        }
        const token = await clientJWTToken(User._id, email);
        return res.status(200).json({
          username: User.username,
          role: User.role,
          token: token,
        });
      } else {
        return res.status(400).json({ msg: "password incorrect" });
      }
      return res.status(400).json({ msg: "No user Found" });
    } else {
      return res.status(400).json({ msg: "fill the fields" });
    }
  } catch (error) {
    console.log(error);
    return next();
  }
};

/*
Route         /auth/reset
Description   To generate the OTP via mail
Access        PUBLIC
Parameter     /
Method        POST
*/
const getOTPMail = async (req, res, next) => {
  try {
    const authCode = Math.floor(1000 + Math.random() * 9000);
    const htmlText = `<h1>Reset Your Password</h1>
                      <h3>Your One-Time-Password is Here</h3>
                      <p>You have generated an one-time-password ${authCode}. Use this to reset your password</p>`;
    const { email } = req.body;
    const User = await Login.findOne({ email: email });
    if (Object.keys(User).length !== 0) {
      // const token=await generateToken(User._id,authCode)
      const update = await Login.updateOne(
        { email: email },
        { authCode: authCode }
      );
      const mail = Mail(email, "Reset Password", htmlText);
      return res.status(200).json({ msg: "Email sent", email: email });
    }
    return res.status(400).json({ msg: "invalid credentials" });
  } catch (error) {
    return next();
  }
};

/*
Route         /auth/check
Description   To verify the OTP with the database 
Access        PUBLIC
Parameter     email,code should be passed
Method        POST
*/
const verifyOTP = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const User = await Login.findOne({ email }).select("authCode");
    if (code === User.authCode) {
      return res.status(200).json({ msg: "otp is verified" });
    } else {
      return res.status(400).json({ msg: "invaild OTP" });
    }
  } catch (error) {
    return next();
  }
};

/*
Route         /auth/change
Description   To reset the password
Access        PUBLIC
Parameter     email,code,password,confirm_password should be passed
Method        PUT
*/
const resetPassword = async (req, res, next) => {
  try {
    console.log("hhhh");
    const { email, authCode, password, confirmPassword } = req.body;
    const hash = await hashPassword(password);
    if (email || authCode || password || confirmPassword) {
      if (password.length >= 8 && password === confirmPassword) {
        const User = await Login.find({
          email: email,
          authCode: authCode,
        }).select("_id authCode");
        console.log(User.length);
        if (User.length !== 0) {
          console.log("dd");
          const Code = Math.floor(1000 + Math.random() * 9000);
          const update = await Login.updateOne(
            { _id: User[0]._id },
            { password: hash, authCode: Code }
          );
          return res.status(200).json({ msg: "Password Updated Succesfully" });
        }
        return res.status(400).json({ msg: "User Unavailable" });
      } else {
        return res.status(400).json({ msg: "Password does not match" });
      }
    } else {
      return res.json({ msg: "invalid fields" });
    }
  } catch (error) {
    console.log(error);
    return next();
  }
};

module.exports = {
  createUser,
  VerfiyUserEmail,
  loginUser,
  getOTPMail,
  verifyOTP,
  resetPassword,
};
