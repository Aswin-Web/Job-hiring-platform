const mongoose =require('mongoose')

const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: Number,
    },
    role: {
      type: String,
      default: "none",
    },
    displayPicture: {
      type: String,
    },
    verification: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
    },
    collegeName:{type:String},
    contact:{type:String},

    education: [{ type: mongoose.Types.ObjectId, ref: "Education" }],
    skill: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Skill",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const User=mongoose.model('User',Schema)

module.exports=User