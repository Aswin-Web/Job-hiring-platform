const jwt = require("jsonwebtoken");

async function generateToken(_id, code) {
  return await jwt.sign({ _id, code }, process.env.JWT_KEY);
}
module.exports = generateToken;
