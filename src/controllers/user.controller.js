const Application = require("../models/application.models");
const ejs = require("ejs");
const sendEmail = require("../utils/nodemailer.email");
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


        if (status === "Selected") {
          const message = `<div>
    <div>
      <h3>Congratulations ${req.user.name}...😎🤩</h3>
    </div>
    <div>
      <p>
        &nbsp; Wishing you infinite success with your new Job...! We know you will do
        justice to your skills and talent and turn your business into a
        phenomenal success! May you always get what you wish for and keep doing
        good👍.
      </p>
      <br/>
      <br/>
      <h3>Thanks</h3>
      <p>Team CareerSheets</p>
    </div>
  </div>`;
          sendEmail(req.user.email, "Congratulations", message);
        }
        if (status === "Rejected") {
          const message = `<div>
    <div>
      <h3>Hello ${req.user.name}...😎</h3>
    </div>
    <div>
      <p>
        &nbsp; &nbsp;&nbsp;It is impossible to live without failing at something unless you live so cautiously that
         you might as well not have lived at all, in which case you have failed by default.
      </p>
       <br/>
      <br/>
      <p> &nbsp;&nbsp;&nbsp;Your hardwork will not make you fail, Improve the things where you find you are weak. </p>
      <br/>
      <br/>
      <h3>Thanks</h3>
      <p>Team CareerSheets</p>
    </div>
  </div>`;
          sendEmail(req.user.email, "CareerSheets", message);
        }

        return res.status(201).json({ msg: "sucess" });

      }
    }
    return res.status(401).json({ msg: "unauthorized" });
  } catch (error) {
    console.log(error);
    return next();
  }
};

const RemoveStatusFromApplication = async (req, res, next) => {
  try {
    const { post_id, roundIndex } = req.body;
    const application = await Application.findOne({
      _id: post_id,
      author: req.user._id.toString(),
    });
    // console.log(application)
    if (application.status.length !== 0) {
      //  const newStatus=await application.status.filter((val,index)=>index !== roundIndex)

      const newStatus = await application.status.filter((val, index) => {
        if (index !== roundIndex && roundIndex < index) {
          val.round = index;
          return val;
        }
        if (index !== roundIndex && roundIndex >= index) {
          val.round = index + 1;
          return val;
        }
      });
      application.status = newStatus;
      const modify = application.save();
      return res.status(200).json({ modify: application });
    } else {
      return res.status(400).json({ msg: "No status available" });
    }
  } catch (error) {}
};

module.exports = {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
  RemoveStatusFromApplication,
};
