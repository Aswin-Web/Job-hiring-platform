const mongoose = require("mongoose");

const collegeListSchema = new mongoose.Schema({
  name: String,
});

const collegeList = mongoose.model("collegelist", collegeListSchema);
module.exports = collegeList;
