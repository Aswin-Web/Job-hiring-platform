const jwt = require("jsonwebtoken");

async function generateToken(_id) {
  return await jwt.sign({ _id  }, process.env.JWT_KEY);
}
module.exports = generateToken;
