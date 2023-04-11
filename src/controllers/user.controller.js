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
        interviewMode) !== ""
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
              },
            },
          },
          {
            new: true,
          }
        );

        return res.status(201).json({ msg: "sucess" });
      }
    }
    return res.status(401).json({ msg: "unauthorized" });
  } catch (error) {
    console.log(error);
    return next();
  }
};

module.exports = {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
};
