const mongoose = require("mongoose");

async function connectDB() {
  await mongoose
    .connect(
      `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@inventory.ce7ild2.mongodb.net/app?retryWrites=true&w=majority`
    )
    .then(() => {
      console.log("MongoDB Connected SuccessFully");
    })
    .catch((err) => {
      console.log(err);
      console.log("Something Went Wrong with MongoDB");
    });
}
module.exports = connectDB;
