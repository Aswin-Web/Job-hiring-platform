const Application = require("../models/application.models");
const postApplication = async (req, res, next) => {
  try {
    const {
      company,
      designation,
      whereApply,
      joblink,
      applicationDate,
      location,
    } = req.body;
    if (
      (company &&
        designation &&
        whereApply &&
        joblink &&
        applicationDate &&
        location) !== ""
    ) {
      const save = await Application.create({
        author: req.user._id,
        company,
        designation,
        whereApply,
        joblink,
        applicationDate,
        location,
      });

      return res.status(201).json(save);
    } else {
      return res
        .status(400)
        .json({ msg: "No sufficient data are transmitted" });
    }
  } catch (error) {
    console.log(error);
    return next();
  }
};

const getAllApplications = async (req, res, next) => {
  try {
    const application = await Application.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(application);
  } catch (error) {
    console.log(error);
    return next();
  }
};

const AddStatusToApplication = async (req, res, next) => {
  try {
    const {
      round,
      interviewType,
      status,
      date,
      notes,
      postID,
      author,
      interviewerName,
      interviewMode,
      interviewerContact,
    } = req.body;
    if (
      (round &&
        interviewType &&
        status &&
        date &&
        notes &&
        postID &&
        author &&
        interviewerName &&
        interviewMode &&
        interviewerContact) !== ""
    ) {
      if (req.user._id.toString() === author) {
        const updated = await Application.updateOne(
          { _id: postID, author: author },
          {
            $push: {
              status: {
                round,
                interviewType,
                status,
                date,
                notes,
                interviewerName,
                interviewMode,
                interviewerContact,
              },
            },
          },
          {
            new: true,
          }
        );

        return res.status(201).json({ msg: "success" });
      }
    }
    return res.status(401).json({ msg: "unauthorized" });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const RemoveStatusFromApplication=async (req,res,next)=>{
  try {
    
    const {post_id,roundIndex}=req.body
    const application=await Application.findOne({_id:post_id,author:req.user._id.toString()})
    // console.log(application)
    if (application.status.length !==0){
    //  const newStatus=await application.status.filter((val,index)=>index !== roundIndex)
    
    const newStatus =await application.status.filter((val, index) => {
      
        if (index !== roundIndex && roundIndex < index) {
         val.round = index 
          return val
        }
        if (index !== roundIndex && roundIndex >= index) {
          val.round = index + 1;
          return val
        }
        
    });
    application.status=newStatus
    const modify=application.save()
    return res.status(200).json({modify:application})
    }else{
      return res.status(400).json({msg:'No status available'})}
    } catch (error) {
    
  }

}

module.exports = {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
  RemoveStatusFromApplication,
};
