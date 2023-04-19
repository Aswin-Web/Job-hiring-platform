const mongoose = require("mongoose");
const User = require("../models/user.models");
const Education = require("../models/education.model");
const Application = require("../models/application.models");

const getUsers = async (req, res) => {
  const user = req.user._id.toString();
  if (user === "") {
    return;
  }
  let collegeAdmin;
  let college;
  let jobSeekerCollege;

  try {
    collegeAdmin = await User.findById(user);
    college = collegeAdmin.collegeName;

    jobSeekerCollege = await Education.find({ collegeName: college }).populate(
      "user"
    );
    console.log(jobSeekerCollege, "heloooo");
   
  } catch (error) {
    console.log(error);
  }
  console.log(collegeAdmin, college, "ttttttttttttttttttttttttttt");
  console.log(jobSeekerCollege.length);

  if (jobSeekerCollege.length === 0) {
    return res
      .status(400)
      .json({ message: "No users registered for this college" });
  }
  console.log(jobSeekerCollege, "heloooo");
  return res.status(200).json(jobSeekerCollege);
};
const addCollege = async (req, res) => {
  const user = req.user._id.toString();
  const { college, contact } = req.body;
  if (college === "" && contact === "") {
    return;
  }
  let collegeAdmin;

  try {
    const abc = await User.findByIdAndUpdate(
      { _id: user },
      { $set: { collegeName: college, contact: contact } }
    );
    collegeAdmin = await User.findById(user);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "college and contact added" });
};

module.exports = {
  getUsers,
  addCollege,
};
