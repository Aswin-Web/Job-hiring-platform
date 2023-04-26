const mongoose = require("mongoose");

const educationSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    required: true,
  },
  stream: { type: String, required: true },
  graduated: {
    type: String,
    required: true,
  },
  graduationYear: {
    type: String,
    required: true,
  },
  registerNumber: {
    type: String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", /////collection name
    required: true,
  },
});

const Education = mongoose.model("Education", educationSchema);
module.exports = Education;
