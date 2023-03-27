const jwt =require('jsonwebtoken')
const verifyToken = async (token) => {
  const _id = await jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
    try {
      console.log(decoded,err)
      return decoded._id; // bar
      
    } catch (error) {
      console.log(err);
      return null
    }
  });
  return _id;
};

module.exports = { verifyToken };
