const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
app.get("/test", (req, res) => {
  res.send("this is test route");
});

app.post("/send-mail", async (req, res) => {
  try {
    const body = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      message: req.body.message,
    };
    console.log(body);
    if (body.name === " ") {
      return res.status(400).json("Name cannot be just a space");
    }
    if (body.name === "") {
      return res.status(400).json("Name cannot be empty");
    }

    if (body.name.trim() === "") {
      return res.status(400).json("Name cannot be empty");
    }
    if (body.name.length < 3) {
      return res.status(400).json("Name must have at least 3 characters");
    }

    if (!/^[A-Za-z]+$/.test(body.name)) {
      return res
        .status(400)
        .json("Name must contain only alphabetic characters");
    }
    const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
    if (!emailPattern.test(body.email)) {
      return res.status(400).json("Invalid email format");
    }
    const phonePattern = /^[0-9]{10}$/; // Assuming a 10-digit phone number format
    if (!phonePattern.test(body.phone)) {
      return res.status(400).json("Invalid phone number format");
    }
    if (body.message.trim() === "") {
      return res.status(400).json("Message cannot be empty");
    }

    if (body.message.length < 30) {
      return res.status(400).json("Message must have at least 30 characters");
    }
    //  //Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSCODE,
      },
    });

    // // Define email content
    const mailOptions = {
      from: body.email, // Sender's email address
      to: process.env.EMAIL, // Recipient's email address
      subject: `Hi from ${body.name}`,
      text: `This is a plain text email sent using Nodemailer. `,
      html: `<p>Hi, i am ${body.name}</p><br/> <p> I viewed your portfolio, and i am further intrested${body.message}.</p> <br/>
       <p>You can contact me on ${body.phone} and ${body.email}</p> `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({
      message: "Email has been sent",
    });
  } catch (error) {
    console.log(error);
  }
});

app.listen(3001, () => {
  console.log("server is running at port 3001");
});
