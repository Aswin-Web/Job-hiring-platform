const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectID,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);


const LoginHistory=mongoose.model("LoginHistory",loginSchema)
module.exports=LoginHistory