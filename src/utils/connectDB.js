const mongoose = require("mongoose");

async function connectDB() {
  await mongoose.set("strictQuery", true);
  await mongoose
    .connect(
      process.env.MONGO_URL
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
