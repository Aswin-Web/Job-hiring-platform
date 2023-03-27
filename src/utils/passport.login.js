const passport = require("passport");
const User = require("../models/user.models");

const { Strategy } = require("passport-google-oauth20");

const CLIENT_ID = process.env.CLIENT_ID;

const CLIENT_SECRET = process.env.CLIENT_SECRET;

passport.serializeUser((user, done) => {
  // This is used to set the cookie

  done(null, user);
});
passport.deserializeUser(function (user, done) {
  // This is used to access th cookie
  done(null, user);
});

passport.use(
  new Strategy(
    {
      clientID: CLIENT_ID,
      clientSecret: CLIENT_SECRET,
      callbackURL: "http://localhost:5001/google/login/cb",

      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {
      console.log("signin ");
      return done(null, profile);
    }
  )
);
