const express=require("express");
const router=express.Router()
const {getUsers,addCollege}=require("../controllers/college.controller")

// getUsers
router.get("/",getUsers)
router.post("/selectcollege",addCollege)


module.exports=router