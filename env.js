// MONGO_URI=mongodb+srv://admin:admin@cluster0.zwu7ec2.mongodb.net/pathseekerDB
// PORT=5000
// JWT_SECRET=pathseeker


const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Schema
const ContactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
});
const Contact = mongoose.model("Contact", ContactSchema);

// ✅ Nodemailer transporter (ek hi baar banalo)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "rehmangujjar440@gmail.com",  // apna Gmail
        pass: ""         // Gmail app password
    },
});

// Route
app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body;

    try {
        // Save to DB
        const newContact = new Contact({ name, email, message });
        await newContact.save();

        // Send mail
        await transporter.sendMail({
            from: "rehmangujjar440@gmail.com",
            to: email,
            subject: "Thanks for contacting us!",
            text: `Hello ${name},\n\nThanks for contacting us. We will get back to you soon!\n\nYour Message: ${message}`,
        });

        res.json({ message: "✅ Form submitted successfully and email sent!" });

    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ message: "Error occurred while processing your request." });
    }
});

app.listen(5000, () => {
    console.log("🚀 Server running on http://localhost:5000");
});