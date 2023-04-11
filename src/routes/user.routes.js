const express = require("express");
const router = express.Router();

const {
  postApplication,
  getAllApplications,
  AddStatusToApplication,
} = require("../controllers/user.controller");

router
  .route("/application")
  .post(postApplication)
  .get(getAllApplications)
  .put(AddStatusToApplication);

router
  .route("/profile/education")
  .get(async (req, res) => {
    let educations;
    try {
      educations = await Education.findOne();
      console.log(education);
    } catch (error) {
      console.log(error);
    }
    res.status(201).json({ message: "Education", educations });
  })
  .post(async (req, res) => {
    const { college, degree, graduated, graduationYear, user, registerNumber } =
      req.body;
    console.log(req.body, "@bodyyy");
    console.log(
      college,
      "@11111111111111111111111111111111111111111111111111111"
    );
    let existingUser;
    try {
      existingUser = await JobSeeker.findById(user);
      console.log("@user", existingUser);
    } catch (error) {
      console.log(error);
    }
    if (!existingUser) {
      return res.status(400).json({ message: "Unable to find the user" });
    }
    const edu = new Education({
      collegeName: college,
      graduated,
      graduationYear,
      degree,
      registerNumber,
      user,
    });
    try {
      console.log(edu, "@edu");
      const session = await mongoose.startSession();
      session.startTransaction();
      await edu.save({ session });
      existingUser.education.push(edu);
      await existingUser.save({ session });
      session.commitTransaction();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ message: "education added", edu });
  })
  .delete("/:id", async (req, res) => {
    const id = req.params.id;
    console.log(id, "deletet");
    let edu;
    try {
      edu = await Education.findByIdAndRemove(id).populate("user");
      await edu.user.education.pull(edu);
      await edu.user.save();
    } catch (error) {
      console.log(error);
    }
    console.log(edu, "###########################");
    if (!edu) {
      return res.status(500).json({ message: "Unable to delete" });
    }
    return res.status(200).json({ message: "succeffully deleted", edu });
  });

  // ------
  router
    .route("/profile/skill/")
    .post(async (req, res) => {
      console.log(req.body);
      const { skill, user } = req.body;
      console.log(skill, user);
      let existingUser;
      try {
        existingUser = await JobSeeker.findById(user);
        console.log(existingUser, "@skilllls");
      } catch (error) {
        console.log(error);
      }
      if (!existingUser) {
        return res.status(400).json({ message: "could not find the user" });
      }
      const newSkill = new Skill({ skill, user });

      try {
        console.log(newSkill, "@new skill");
        const session = await mongoose.startSession();
        session.startTransaction();
        await newSkill.save({ session });
        existingUser.skill.push(newSkill);
        await existingUser.save({ session });
        session.commitTransaction();
      } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error });
      }

      return res.status(200).json({ message: "skill added", newSkill });
    })
    .delete("/:id", async (req, res) => {
      const skillId = req.params.id;
      console.log(skillId, "skilllIDDD");
      let existingSkill;
      try {
        existingSkill = await Skill.findByIdAndRemove(skillId).populate("user");
        await existingSkill.user.skill.pull(existingSkill);
        await existingSkill.user.save();
        console.log("exisiting skill", existingSkill);
      } catch (error) {
        console.log(error);
      }
      if (!existingSkill) {
        return res.status(500).json({ message: "Unable to delete" });
      }
      return res
        .status(200)
        .json({ message: "succeffully deleted", existingSkill });
    });

    // -------------------
    router.route("/profile/status/").put("/:id", async (req, res) => {
      const { status } = req.body;
      const user = req.params.id;
      console.log(status, user, "statussss");
      if (status === "") {
        return res.status(422).json({ message: "Invalid Inputs" });
      }
      let existingUser;
      try {
        existingUser = await JobSeeker.findById(user);
        console.log(existingUser, "@statusssssssssssUser");
        await JobSeeker.updateOne({ _id: user }, { $set: { status: status } });
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({ message: "status updated", status });
    });


module.exports = router;
