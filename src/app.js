require("dotenv").config();
const express = require("express");
const passport=require('passport')
const cookieParser = require("cookie-parser");
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


app.use(cookieParser());


app.use(
  cors({
    origin: [`${process.env.CLIENT_URL}`,"http://localhost:3000"],
    credentials:true,
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders:['Access-Control-Allow-Origin','Content-Type','Authorization']
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept"
  );
  next()
});



app.use(express.json());

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
