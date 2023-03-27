const bcrypt = require("bcrypt");
const saltRounds = 10;

async function hashPassword(myPlaintextPassword) {
  return await bcrypt
    .hash(myPlaintextPassword, saltRounds)
    .then(function (hash) {
      return hash;
    });
}

async function compareHash(myPlaintextPassword, hash) {
  return await bcrypt
    .compare(myPlaintextPassword, hash)
    .then(function (result) {
      // result == true
      return result;
    });
}

module.exports = {
  hashPassword,
  compareHash,
};
