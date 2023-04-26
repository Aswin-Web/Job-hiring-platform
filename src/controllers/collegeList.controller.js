const collegeList=require("../models/collegeList.models")

const getAllCollegeList=async(req,res)=>{

    let list;
    try {
        list=await collegeList.find()
        
    } catch (error) {
        console.log(error)
    }
    res.status(200).json(list)
}

module.exports={getAllCollegeList}  