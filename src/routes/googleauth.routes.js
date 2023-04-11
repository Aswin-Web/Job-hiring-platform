const generateToken = require("../utils/jwt.token");
const { authenticateUser } = require("../utils/authorisation.header.check");
const { verifyToken } = require("../utils/jwt.decode");

require("../utils/passport.google");

// MODEL - MongoDB
const User = require("../models/user.models");
const LoginHistory = require("../models/login.history.model");

const express = require("express");
const passport = require("passport");

const router = express.Router();

const jwt = require("jsonwebtoken");

async function generateJWT(
  _id,
  email,
  name,
  role,
  verification,
  displayPicture
) {
  return await jwt.sign(
    { _id, email, name, role, verification, displayPicture },
    process.env.JWT_KEY
  );
}

/*
Route         /auth/google
Description   To login / logup the user into the platform
Access        PUBLIC
Parameter     -
Method        GET
*/

router.get(
  "/",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

/*
Route         /auth/google/cb
Description   This route gives an redirect from the oauth google
Access        Logged in using GoogleID
Parameter     callback URL
Method        GET
*/

router.get(
  "/cb",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
  }),
  async function (req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", true);
    try {
      const email = req.user.emails[0].value;
      const name = req.user.displayName;
      const photo = req.user.photos[0].value;
      const isUser = await User.find({ email: email });

      // User Creation start
      if (isUser.length === 0) {
        const savedUser = await User.create({
          email: email,
          name: name,
          displayPicture: photo,
        });
        await LoginHistory.create({
          user_id: savedUser._id,
        });

        const token = await generateToken(savedUser._id);

        return res
          .cookie("email", token)
          .redirect(`${process.env.REDIRECT_URL}?token=${token}`);
      }

      if (isUser.length !== 0) {
        // Checking wheather the user is partially logged in
        if (isUser[0].role === "none" || isUser[0].verification === false) {
          const token = await generateToken(isUser[0]._id);
          return res
            .cookie("email", token)
            .redirect(`${process.env.REDIRECT_URL}?token=${token}`);

          // res.clearCookie("user"  );
          // console.log(req.cookies);
          // res.cookie("exp", "value", { expire: new Date() + 9999 });
          // return res.status(200).json({
          //   token: token,
          //   type: "none",
          //   verification: false,
          // });
        } else {
          // Else You can Create an JWT token
          const savelogin = await LoginHistory.create({
            user_id: isUser[0]._id,
          });
          const token = await generateToken(isUser[0]._id);

          //
          return res
            .cookie("email", token)
            .redirect(`${process.env.REDIRECT_URL}?token=${token}`);
        }
      }
    } catch (error) {
      console.log(error, "auth/login/verify");
      return next();
    }
  }
);

/*
Route         /auth/login/success
Description   Success login 
Access        PUBLIC
Parameter     -
Method        GET
*/

router.get("/success", (req, res) => {
  if (req.user) {
    res.send({ user: req.user.displayname });
  }
});

/*
Route         /auth/login/failure
Description   Failure login
Access        PUBLIC
Parameter     -
Method        GET
*/

router.get("/failure", (req, res) => {
  res.send("fail");
});

/*
Route         /auth/login/verify
Description   Partial account setup
Access        PRIVATE -requires JWT token
Parameter     -
Method        POST
*/

router.put("/verify", authenticateUser, async (req, res, next) => {
  try {
    const { type } = req.body;

    const resp = await User.updateOne(
      { _id: req.user._id },
      { role: type, verification: true },
      { new: true }
    );

    res.send("success");
  } catch (error) {
    console.log(error);
    return next();
  }
});

/*
Route         /auth/login/test
Description   To Generate the tokens
Access        PUBLIC
Parameter     -
Method        GET
*/

router.get("/test/:jwt_token", async (req, res, next) => {
  try {
    const jwt_token = req.params.jwt_token;
    const email = jwt_token;
    if (email) {
      const _id = await verifyToken(email);
      const user = await User.find({ _id: _id, auth: true });
      if (user.length !== 0) {
        return res.status(200).json({
          _id: user[0]._id,
          email: user[0].email,
          role: user[0].role,
          name: user[0].name,
          verification: user[0].verification,
          auth: true,
          token: await generateJWT(
            user[0]._id,
            user[0].email,
            user[0].name,
            user[0].role,
            user[0].verification,
            user[0].displayPicture
          ),
        });
      } else {
        return res.status(401).json({ auth: false });
      }
    } else {
      return res.status(401).json({ auth: false });
    }
  } catch (error) {
    console.log(error);
    return next();
  }
});

module.exports = router;
