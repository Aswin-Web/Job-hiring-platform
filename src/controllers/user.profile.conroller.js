const Education = require("../models/education.model");
const Skill = require("../models/skill.models");
const JobSeeker = require("../models/user.models");
const mongoose = require("mongoose");

const getUserInfo = async (req, res) => {
  const id = req.user._id.toString();

  let userEducation;
  try {
    userDetails = await JobSeeker.findById(id)
      .populate("education")
      .populate("skill");
  } catch (error) {
    console.log(error);
  }
  if (!userDetails) {
    return res.status(400).json({ message: "Could not find user" });
  }

  return res.status(200).json(userDetails);
};
const postEducation = async (req, res) => {
  const { college, degree, graduated, graduationYear, registerNumber, stream } =
    req.body;
  const user = req.user._id.toString();

  let existingUser;
  let existingCollege;
  let matchedRegister;
  try {
    existingCollege = await Education.find({ collegeName: college });
   
    matchedRegister = existingCollege.find(
      (el) => el.registerNumber === registerNumber
    );
  
    if (matchedRegister) {
      console.log("trueeee regiter number matches");
      return res
            .status(400)
            .json({
              message:
                "The user with this register number for this college already exists.!!"})
    } else {
      console.log("register number mismatches");
    }

    

    existingUser = await JobSeeker.findById(user).populate("education");
  } catch (error) {
    console.log(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "Unable to find the user" });
  }
  const edu = new Education({
    collegeName: college,
    graduated,
    graduationYear,
    degree,
    registerNumber,
    user,
    stream,
  });
  try {
    await edu.save();
    existingUser.education.push(edu);
    await existingUser.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }

  return res.status(200).json({ message: "education added", edu });
};

const deleteEducation = async (req, res) => {
  const id = req.params.id;

  let edu;
  try {
    edu = await Education.findByIdAndRemove(id).populate("user");
    await edu.user.education.pull(edu);
    await edu.user.save();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }

  if (!edu) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res.status(200).json({ message: "succeffully deleted", edu });
};

const postSkill = async (req, res) => {
  const { skill, level } = req.body;
  const user = req.user._id.toString();
  let existingUser;
  try {
    existingUser = await JobSeeker.findById(user).populate("skill");
  } catch (error) {
    console.log(error);
  }
  if (!existingUser) {
    return res.status(400).json({ message: "could not find the user" });
  }

  const findSkill = existingUser.skill.find((el) => el.skill === skill);

  if (findSkill) {
    return res.status(400).json({ message: "This skill is already present" });
  }

  const newSkill = new Skill({ skill, user, level });

  try {
    await newSkill.save();
    existingUser.skill.push(newSkill);
    await existingUser.save();

    return res.status(200).json({ message: "skill added", newSkill });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const deleteSkill = async (req, res) => {
  const skillId = req.params.id;

  let existingSkill;
  try {
    existingSkill = await Skill.findByIdAndRemove(skillId).populate("user");
    await existingSkill.user.skill.pull(existingSkill);
    await existingSkill.user.save();
  } catch (error) {
    console.log(error);
  }
  if (!existingSkill) {
    return res.status(500).json({ message: "Unable to delete" });
  }
  return res
    .status(200)
    .json({ message: "succeffully deleted", existingSkill });
};

const updateStatus = async (req, res) => {
  const { status } = req.body;
  const user = req.user._id.toString();

  if (status === "") {
    return res.status(422).json({ message: "Invalid Inputs" });
  }
  let existingUser;
  try {
    await JobSeeker.updateOne({ _id: user }, { $set: { status: status } });
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: "status updated", status });
};
module.exports = {
  getUserInfo,
  postEducation,
  deleteEducation,
  postSkill,
  deleteSkill,
  updateStatus,
};
