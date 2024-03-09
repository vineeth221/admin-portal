// server/routes/router.js

const express = require("express");
const router = new express.Router();
const nodemailer = require("nodemailer");
const Email = require("../models/Email");

// send mail to admin portal
router.post("/register", async (req, res) => {
  const { email, name, mobile, subject } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email, // Update this with the admin portal email address
      subject: subject || "Sending Email With React And Nodejs",
      html: `<h1>Congratulations ${name}!</h1>
             <p>You successfully sent an email. Your mobile number is ${mobile}.</p>`,
    };

    // Store the email in MongoDB
    const newEmail = new Email({
      email,
      name,
      mobile,
      subject,
    });
    await newEmail.save();

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with a 204 status code for success without a response body
    res.status(204).send();
  } catch (error) {
    console.error("Error" + error);
    res.status(500).json({ status: 500, error });
  }
});

module.exports = router;
