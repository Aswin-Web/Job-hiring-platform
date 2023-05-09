

const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
    company: {
      type: String,
    },
    location: {
      type: String,
    },
    designation: {
      type: String,
    },
    whereApply: {
      type: String,
    },
    date: {
      type: String,
    },
    joblink: {
      type: String,
    },
    status: [
      {
        round: String,
        interviewType: String,
        status: String,
        date: String,
        notes: {type:String,default:'None'},
        interviewerName:String,
        interviewerContact:String,
        interviewMode: String, 
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model("application", Schema);

module.exports = Application;
