require("dotenv").config();
const express = require("express");
const passport=require('passport')
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const session=require('express-session')
// Utils
const connectDB = require("./utils/connectDB");

//Passport

// Routes Import
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const googleAuthRoutes=require('./routes/googleauth.routes') 

const cors =require('cors')
const app = express();

// Cookie-Parser

// MongoDB Connection String
connectDB();



app.use(
  cors({
    origin: "https://careersheets.netlify.app/",
    credentials: true,
  })
);

// app.use(cookieParser());
app.use(express.json());
app.use(
  cookieParser({
    resave:false,
    saveUninitialized:false,
    secret:'session',
    cookie:{
      maxAge:1000*60*60,
      sameSite:'none',
      secure:true,
      domain:"https://careersheets.netlify.app/authredirect"
    }
  })
)




// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Credentials", true);
//   res.header("Access-Control-Allow-Origin", "https://careersheets.netlify.app");
//   res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept"
//   );
//   next()
// });





// app.use(
//   cookieSession({ name: "session", keys: ["lama"], maxAge: 24 * 60 * 60 * 100 })
// );

// app.use(passport.initialize());
// app.use(passport.session());

// app.use(
//   cors({
//     origin: "https://careersheets.netlify.app/",
//     methods: "GET,POST,PUT,DELETE",
//     credentials: true,
//   })
// );

// Authentication Routes
// app.use("/auth", authRoutes);

// Google SignUp 
app.use('/auth/google',googleAuthRoutes)


// User Routes
app.use("/user", userRoutes);

app.use((req, res) => {
  res.status(500).json({ msg: "Something went wrong" });
});

module.exports = app;
