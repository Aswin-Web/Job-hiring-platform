const fastcsv = require("fast-csv");
const fs = require("fs");
const ws = fs.createWriteStream("bezkoder_mongodb_fastcsv.csv");
const LoginHistory = require("../models/login.history.model");
const createCSVUsers = async (req, res) => {
  const data = await LoginHistory.find({})
    .select("user_id")
    .sort({ createdAt: -1 })
    .populate({
      path: "user_id",
      select: "_id email name role ",
    });
  const modify =await data.map((item) => {
    console.log("item", item);
    return {  ...item.toObject(),...item.user_id.toObject() };
  });

 
  // console.log(modify)
  fastcsv
    .write(modify, { headers: true })
    .on("finish", function () {
      console.log("Write to bezkoder_mongodb_fastcsv.csv successfully!");
    })
    .pipe(ws);
    console.log(data.length)

  return res.send("hello");
};

module.exports = { createCSVUsers };
