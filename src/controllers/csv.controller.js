const fastcsv = require("fast-csv");
const fs = require("fs");

// Models
const LoginHistory = require("../models/login.history.model");
const User = require("../models/user.models");
const Application = require("../models/application.models");

const createCSVLoginHistory = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("LoginHistory.csv");
    const data = await LoginHistory.find({})
      .select("user_id createdAt")
      .sort({ createdAt: -1 })
      .populate({
        path: "user_id",
        select: "_id email name role  ",
      });
    console.log("item", data);
    // To Eliminate [object:object] we are explictively writing
    const modify = await data.map((item) => {
      if (item.user_id !== null) {
        return {
          ...item._id,
          createAt: new Date(item.createdAt).toLocaleDateString().toString(),

          ...item.user_id.toObject(),
        };
      }
    });

    // console.log(modify)
    fastcsv
      .write(modify, { headers: true })
      .on("finish", function () {
        console.log("LoginHistory CSV Created");
      })
      .pipe(ws);
    console.log(data.length);
    return res.send("LoginHistory CSV Created");
  } catch (error) {
    console.log(error);
    return next();
  }
};

const createCSVUsers = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("Users.csv");
    const data = await User.find({})
      .select("name email role education skill")
      .sort({ createdAt: -1 })
      .populate({
        path: "education",
        select: "collegeName degree graduationYear registerNumber",
      })
      .populate({
        path: "skill",
        select: "skill",
      });

    const UserArray = await data.map((item) => {
      let arraySkill;
      console.log(item.skill);

      if (item.skill !== 0 && item.skill !== undefined) {
        arraySkill = item.skill.map((skill) => skill.skill);
      }

      return {
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        ...item.education.toObject(),
        skill: arraySkill,
      };
    });

    fastcsv
      .write(UserArray, { headers: true })
      .on("finish", function () {
        console.log("User List");
      })
      .pipe(ws);
    console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};

const createApplicationByUser = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("Applications.csv");

    const data = await Application.aggregate([
      { $match: {} },
      { $group: { _id: { createdUser: "$author" }, application: { $sum: 1 } } },

      {
        $lookup: {
          from: "users",
          localField: "_id.createdUser",
          foreignField: "_id",
          as: "user_info",
        },
      },
    ]);
    const ApplicantArray = await data.map((item) => {
      return {
        _id: item.user_info[0]._id,
        email: item.user_info[0].email,
        name: item.user_info[0].name,
        TotalApplication: item.application,
      };
    });
    fastcsv
      .write(ApplicantArray, { headers: true })
      .on("finish", function () {
        console.log("Number of applicant and applicant are generated");
      })
      .pipe(ws);
    console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};

const RoundsOfApplication = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("ApplicationbyRound.csv");

    const data = await Application.aggregate([
      { $match: {} },
      // { $group: { _id: { createdUser: "$author" }, application: { $sum: 1 },company:'$company' } },

      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "user_info",
        },
      },
      { $sort: { status: -1 } },
      {
        $project: {
          company: 1,
          createdAt: 1,
          updatedAt: 1,
          "user_info._id": 1,
          "user_info.name": 1,
          "user_info.email": 1,
          applicationStatus: { $slice: ["$status", -1] },
          status: 1,
        },
      },
    ]);
    // const num = data[0].status.length;

    // for (let index = 0; index < num; index++) {
    //   let round_number = `Round_${index}`;

    // }

    const ApplicationArray = await data.map((item) => {
      const num = item.status.length;
      let roundInfo = { };
      const roundDates = item.status.map((x, index) => {
        // console.log(x.date)
        let news=`{"Round_${Object.values(x.round)}" : "${new Date(x.date).toLocaleDateString()}"}`;
        // console.log(news)

        roundInfo={...roundInfo,...JSON.parse(news)}
      });
      // console.log(roundInfo)

      if (
        item.applicationStatus !== 0 &&
        item.applicationStatus[0] !== undefined
      ) {
        return {
          _id: item.user_info[0]._id,
          name: item.user_info[0].name,
          email: item.user_info[0].email,
          company: item.company,
          createdAt: new Date(item.createdAt).toLocaleDateString(),
          updatedAt: new Date(item.updatedAt).toLocaleDateString(),
          ...roundInfo,
          round: item.applicationStatus[0].round,
          status: item.applicationStatus[0].status,
        };
      }
    });
     console.log(ApplicationArray);
    fastcsv
      .write(ApplicationArray, { headers: true })
      .on("finish", function () {
        console.log("User List");
      })
      .pipe(ws);
    // console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};
const CollegeUsers = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("CollegeUsers.csv");

    const data = await User.find({ role: "collegeadmin" });

    console.log(data);

    const ApplicationArray = await data.map((item) => {
      return {
        name: item.name,
        email: item.email,
        company: item.college,
        verification: item.verification,
      };
    });
    console.log(ApplicationArray);
    fastcsv
      .write(ApplicationArray, { headers: true })
      .on("finish", function () {
        console.log("User List");
      })
      .pipe(ws);
    console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};
// No needed
const UsersBySkill = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("UsersBySkill.csv");

    const data = await User.find({ role: "collegeadmin" });

    console.log(data);

    const ApplicationArray = await data.map((item) => {
      return {
        name: item.name,
        email: item.email,
        company: item.college,
        verification: item.verification,
      };
    });
    console.log(ApplicationArray);
    fastcsv
      .write(ApplicationArray, { headers: true })
      .on("finish", function () {
        console.log("User List");
      })
      .pipe(ws);
    console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};

const UsersByCollegeDegreeGraduationYear = async (req, res, next) => {
  try {
    const ws = fs.createWriteStream("UsersByCollegeDegreeGraduationYear.csv");

    const data = await User.find({ role: "user" })
      .populate({
        path: "education",
        select:
          "collegeName graduated graduationYear registerNumber degree stream",
      })
      .populate({
        path: "skill",
        select: "skill",
      })
      .select("_id education skill name email");

    console.log(data[3]);

    const ApplicationArray = await data.map((item) => {
      let skills = "";
      if (item.skill !== 0) {
        item.skill.map((skill) => {
          skills = skills + " " + skill.skill;
        });
      }

      return {
        _id: item._id,
        name: item.name,
        email: item.email,
        education: item.education[item.education.length - 1]
          ? item.education[item.education.length - 1].collegeName
          : "None",
        graduatedAt: item.education[item.education.length - 1]
          ? item.education[item.education.length - 1].graduationYear
          : "None",
        registerNumber: item.education[item.education.length - 1]
          ? item.education[item.education.length - 1].registerNumber
          : "None",
        stream: item.education[item.education.length - 1]
          ? item.education[item.education.length - 1].stream
          : "None",
        degree: item.education[item.education.length - 1]
          ? item.education[item.education.length - 1].degree
          : "None",
        skill: item.skill[item.skill.length - 1] ? skills : "None",
      };
    });
    console.log(ApplicationArray);
    fastcsv
      .write(ApplicationArray, { headers: true })
      .on("finish", function () {
        console.log("User List");
      })
      .pipe(ws);
    // console.log(data.length);
    return res.send("User List");
  } catch (error) {
    console.log(error);
    return next();
  }
};
module.exports = {
  createCSVLoginHistory,
  createCSVUsers,
  createApplicationByUser,
  RoundsOfApplication,
  CollegeUsers,
  UsersBySkill,
  UsersByCollegeDegreeGraduationYear,
};
