const express = require("express");
const router = express.Router();
const {
  createCSVLoginHistory,
  createCSVUsers,
  createApplicationByUser,
  RoundsOfApplication,
  CollegeUsers,
  UsersBySkill,
  UsersByCollegeDegreeGraduationYear,
} = require("../controllers/csv.controller");

router.get("/loginHistory", createCSVLoginHistory);
router.get("/users", createCSVUsers);
router.get("/applications", createApplicationByUser);
router.get("/rounds", RoundsOfApplication);
router.get("/collegeusers", CollegeUsers);
router.get("/skillUser", UsersBySkill);
router.get("/userInfo", UsersByCollegeDegreeGraduationYear);

module.exports = router;
