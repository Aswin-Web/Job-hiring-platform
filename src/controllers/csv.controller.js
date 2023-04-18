const fastcsv = require("fast-csv");
const fs = require("fs");
const LoginHistory = require("../models/login.history.model");
const User = require("../models/user.models");
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
      return {
        ...item._id,
        createAt: item.createdAt,
        ...item.user_id.toObject(),
      };
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
      console.log(item.skill)
      
      if (item.skill !==0 && item.skill !== undefined){
         arraySkill=item.skill.map(skill=>skill.skill)
        
      }
      
      return {
        id: item._id,
        name: item.name,
        email: item.email,
        role: item.role,
        ...item.education.toObject(),
        skill:arraySkill,
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



module.exports = { createCSVLoginHistory, createCSVUsers };
