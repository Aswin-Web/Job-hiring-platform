const express=require("express")
const {getAllCollegeList}=require("../controllers/collegeList.controller")

const router=express.Router()

router.route("/").get(getAllCollegeList)

module.exports=router