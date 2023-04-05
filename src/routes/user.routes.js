const express = require("express");
const router = express.Router();

const {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
} = require("../controllers/user.controller");

router
  .route("/application")
  .post(postApplication)
  .get(getAllApplications)
  .put(AddStatusToApplication);

module.exports = router;
