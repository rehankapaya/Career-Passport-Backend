const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,  // apna Gmail
        pass: process.env.GMAIL_APP_PASSWORD         // Gmail app password
    },
});

module.exports = transporter