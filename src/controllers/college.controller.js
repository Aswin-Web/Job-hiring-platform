const User = require("../models/user.models");
const Education = require("../models/education.model");
const Application = require("../models/application.models");
const mongoose = require("mongoose");

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
    
    if(!college){
      return res.status(501).json({message:"notselected"})
    }

    if (collegeAdmin.collegeVerification) {
      userApplication = await Education.aggregate([
        { $match: { collegeName: college /*collegeVerification:true*/ } },
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
        {$sort:{ "application.updatedAt":-1}},
      ]);
       
      return res
      .status(200)
      .json({ userApplication: userApplication, collegeAdmin: collegeAdmin });
    }else{
      return res.status(401).json({message:"College Admin is not verified"})
    }
  } catch (error) {
    console.log(error);
  }

 
};

////adding college admin's college and contact/////
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
      { $set: { collegeName: college, contact: contact,collegeVerification:false } }
    );
    collegeAdmin = await User.findById(user);
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "college and contact added" });
};

const getUserById = async (req, res) => {
  const id = req.params.id;

  let applicationDetails;
  let user;
  try {
    applicationDetails = await Application.find({ author: id }).populate(
      "author"
    );
   

    if (!applicationDetails) {
      return res.status(200).json({ message: "No appliation Details found" });
    }
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ applicationDetails: applicationDetails });
};

module.exports = {
  getUsers,
  addCollege,
  getUserById,
};
