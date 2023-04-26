const User = require("../models/user.models");
const Education = require("../models/education.model");
const Application = require("../models/application.models");
const mongoose=require("mongoose")

const getUsers = async (req, res) => {
  const user = req.user._id.toString();
  if (user === "") {
    return;
  }

  let collegeAdmin;
  let college;
  //   let jobSeekerCollege;
  //   let userID = [];
  let userApplication;

  try {
    collegeAdmin = await User.findById(user);

    college = collegeAdmin.collegeName;
    console.log(collegeAdmin);

   

    userApplication = await Education.aggregate([
      { $match: { collegeName: college ,collegeVerification:true} },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $lookup: {
          from: "applications",
          localField: "user",
          foreignField: "author",
          as: "application",
        },
      },
    ]);
  } catch (error) {
    console.log(error);
  }
 


  return res
    .status(200)
    .json({ userApplication: userApplication, collegeAdmin: collegeAdmin });
};

////adding college admin's college anf contact/////
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

const getUserById = async (req, res) => {
  const id = req.params.id;
  console.log(id, "idddd");
  let applicationDetails;
  let user;
  try {
    applicationDetails = await Application.find({ author: id }).populate("author");
    console.log(applicationDetails)

    

    if (!applicationDetails) {
      return res.status(200).json({ message: "No appliation Details found" });
    }
  } catch (error) {
    console.log(error);
  }
  res
    .status(200)
    .json({ applicationDetails: applicationDetails });
};

module.exports = {
  getUsers,
  addCollege,
  getUserById,
};
