const nodemailer = require("nodemailer");

const email = (to, subject, html) => {
  return new Promise((res, rej) => {
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.NODEMAILER_USERNAME,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });
    const mailOption = {
      from: `CareerSheets ${process.env.NODEMAILER_USERNAME}`,
      to: to,
      subject: subject,
      html: html,
    };
    transporter.sendMail(mailOption, function (err, info) {
      if (err) {
        return rej({ msg: "Error" });
      } else {
        resolve({ msg: "email send" });
      }
    });
  });
};
module.exports = email;
