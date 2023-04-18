const express=require('express');
const router = express.Router()
const {
   createCSVLoginHistory,
  createCSVUsers,
} = require("../controllers/csv.controller");

router.get("/loginHistory", createCSVLoginHistory);
router.get("/users", createCSVUsers);

module.exports=router;