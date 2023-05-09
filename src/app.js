require("dotenv").config();
const express = require("express");
const passport=require('passport')
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const session=require('express-session')
var morgan = require("morgan");
const ejs=require('ejs')

// Authorisation Header Check
const {authenticateUser} =require('./utils/authorisation.header.check')

// Utils
const connectDB = require("./utils/connectDB");

//Passport

// Routes Import
const userRoutes = require("./routes/user.routes");
const authRoutes = require("./routes/auth.routes");
const googleAuthRoutes=require('./routes/googleauth.routes') 
const CSVroutes = require('./routes/csv.routes')
const collegeAdminRouter=require("./routes/college.routes")
const collegeListRouter=require("./routes/collegeList.routes")
const platformAdminRoutes=require("./routes/platformAdmin.routes")


const cors =require('cors')
const app = express();

// Cookie-Parser

// MongoDB Connection String
connectDB();

app.use(express.json());

app.use(cookieParser());

app.use(morgan("combined"));

// app.set("view engine", "ejs");

app.use(
  cors({
    origin: ["https://careersheets.netlify.app","http://localhost:3000"],
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Allow-Origin", process.env.CLIENT_URL );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With,X-HTTP-Method-Override,Content-Type,Accept"
  );
  next()
});

///COLLEGE LIST 
app.use("/collegelist",collegeListRouter)

// PlatformAdmin
app.use("/admin",  platformAdminRoutes);


// Create an CSV
app.use('/csv',CSVroutes)

// Authentication Routes
// app.use("/auth", authRoutes);

// Google SignUp 
app.use('/auth/google',googleAuthRoutes)

// Authorisation Controller
app.use(authenticateUser);

////collegeadmin routes////
app.use("/collegeadmin",collegeAdminRouter)

// User Routes
app.use("/user", userRoutes);
// 


app.use("/*",(req, res) => {
  console.log("Could not match any Route")
  res.status(500).json({ msg: "Something went wrong" });
});

app.use((req, res) => {
  console.log("Controller Error")
  res.status(500).json({ msg: "Something went wrong" });
});



// 
module.exports = app;
