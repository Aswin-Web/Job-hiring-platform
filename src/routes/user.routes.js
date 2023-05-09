const Education = require("../models/education.model");
const Skill = require("../models/skill.models");
const JobSeeker = require("../models/user.models");
const mongoose = require("mongoose");

const express = require("express");
const router = express.Router();
const {
  getUserInfo,
  postEducation,
  deleteEducation,
  postSkill,
  deleteSkill,
  updateStatus,
  updateProfileRole,
  postProject,
  deleteProject
} = require("../controllers/user.profile.conroller");


const {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
  RemoveStatusFromApplication,
} = require("../controllers/user.controller");

router
  .route("/application")
  .post(postApplication)
  .get(getAllApplications)
  .put(AddStatusToApplication);

router.get("/profile", getUserInfo);

router.route("/profile/education").post(postEducation);


router.delete("/profile/education/:id", deleteEducation);

// ------
router.route("/profile/skill/").post(postSkill);

// Request
router.delete("/profile/skill/:id", deleteSkill);

// -------------------
router.put("/profile/status/", updateStatus);

//--------
router.put("/profile/profilerole/", updateProfileRole);
//------------
router.post("/profile/projects/", postProject);

//------------

router.delete("/profile/projects/:id", deleteProject);

router.post("/application/removestatus", RemoveStatusFromApplication);

module.exports = router;

