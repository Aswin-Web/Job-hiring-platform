const express=require("express");
const router=express.Router()
const {getUsers,addCollege,getUserById}=require("../controllers/college.controller")

// getUsers
router.get("/",getUsers)
router.post("/selectcollege",addCollege)
router.get("/:id",getUserById)


module.exports=router