
const express=require('express')
const {
  GetAllCollegeAdmin,
  UpdateAdminVerification,
  AuthenticatePlatformAdmin,
} = require("../controllers/platformAdmin.controller");
const { authenticateAdmin } = require('../utils/authorisation.header.check');

const router =express.Router()

router.route("/login").post(AuthenticatePlatformAdmin)

router.use(authenticateAdmin);

// Get all CollgeAdmin and Update their Verification 
router.route("/").get(GetAllCollegeAdmin).put(UpdateAdminVerification);

// Platform authentication

module.exports=router