const accountSid = process.env.TWILLO_SID;
const authToken = process.env.TWILLO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);
function SendSMS(code, to = "+919751759478") {
  client.messages
    .create({
      body: `Your Hire-Up Verfication code is ${code} `,
      from: process.env.TWILLO_NUMBER,
      to: to,
    })
    .catch((e) => console.log("Error @ twillo"));
}
module.exports = SendSMS;
