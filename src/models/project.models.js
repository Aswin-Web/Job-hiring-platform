const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  projectTitle: {
    type: String,
    required: true,
  },
  projectDomain: {
    type: String,
    required: true,
  },
  projectDescription:{
    type:String,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User", /////collection name
    required: true,
  },
});

const Project = mongoose.model("Project", projectSchema);
module.exports=Project