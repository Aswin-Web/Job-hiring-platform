require("dotenv").config();
const express = require("express");
const connectDB = require("./utils/connectDB");

const app = express();

// MongoDB Connection String
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello");
});

module.exports = app;
