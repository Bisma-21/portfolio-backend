const express = require("express");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const app = express();
app.use(express.json());

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

    // Create a transporter using SMTP
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
