const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_API_KEY,
  },
});

const SendMail = (to, subject, text, html) => {
  transporter.sendMail(
    {
      from: process.env.MAIL_ID,
      to,
      subject,
      text,
      html,
    },
    (err, info) => {
      if (err) console.log(err);
      else console.log("Mail Sent: " + info.response);
    }
  );
};

module.exports = SendMail;
