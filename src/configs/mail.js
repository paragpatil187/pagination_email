
const nodemailer=require("nodemailer")
module.exports=nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "555a1f8ab71c81",
    pass: "cbd25258c2cb62",
  },
});
