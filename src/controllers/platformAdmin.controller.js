// MONGODB Models
const User = require("../models/user.models");
const generateToken = require("../utils/jwt.token")

const GetAllCollegeAdmin = async (req, res, next) => {
  try {
    console.log('Asking')
    const Userlist = await User.find({
      role: "collegeadmin",
      verification: true,
    }).select({
      _id: 1,
      name: 1,
      email: 1,
      displayPicture: 1,
      collegeVerification: 1,
      contact:1,
      collegeName:1
       }).sort({"createdAt":-1})
    console.log(await Userlist);
    return res.json({user:Userlist})
  } catch (error) {
    console.log(error.message);
    return next();
  }
};

const UpdateAdminVerification=async(req,res,next)=>{
    try {
        const {user_id,userVerification}=req.body
        console.log(user_id, userVerification);
        if (user_id ){
            const user = await User.update(
              { _id: user_id, collegeVerification: !userVerification },
              { collegeVerification: userVerification }
            );
            console.log(user)
            res.status(200).json({msg:'account updated successfully'})
           
            
        }else{
            res.status(404).json({msg:'please do provide the input fields'})
        }
    } catch (error) {
        console.log(error)
        return next()
    }
}
const ADMIN_NAME=process.env.ADMIN_NAME || 'admin'
const ADMIN_PWD=process.env.ADMIN_PWD|| '123456789'
const AuthenticatePlatformAdmin=async (req,res,next)=>{
  try {
    const {adminName,adminPassword}=req.body
    
     if (adminName !== '' && adminPassword !==''){
      if (adminName ===ADMIN_NAME && adminPassword===ADMIN_PWD ){
        // Create an JWT
        
        const token=await generateToken("admin@gmail.com")
        return res.status(200).json({token:await token})
      }else{
        return res.status(403).json({msg:'Invalid Credentials'})
      }
     }else{
      return res.status(400).json({msg:'Invalid input fields'})
     }



  } catch (error) {
    console.log(error)
    return next()
  }
}

module.exports = {
  GetAllCollegeAdmin,
  UpdateAdminVerification,
  AuthenticatePlatformAdmin,
};