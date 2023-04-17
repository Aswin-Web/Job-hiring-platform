const passport = require("passport");


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
      callbackURL: `${process.env.CALLBACK_URL}/auth/google/cb`,

      passReqToCallback: true,
    },
    function (request, accessToken, refreshToken, profile, done) {


      return done(null, profile);
    }
  )
);
