const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: "pathseeker999@gmail.com",  // apna Gmail
        pass: "onwl pzct awpt ivcl"         // Gmail app password
    },
});

module.exports = transporter