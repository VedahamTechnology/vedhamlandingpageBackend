const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const formatMultiline = (value = "") =>
  escapeHtml(value).replace(/\n/g, "<br>");

const isMissing = (value) => value === undefined || value === null || String(value).trim() === "";

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get("/", (req, res) => {
  res.json({ message: "Vedaham Technology Backend API is running" });
});

// Contact form route
app.post("/api/contact", async (req, res) => {
  const { name, email, phone, subject, projectBudget, message, companyName } =
    req.body;

  // Validation
  if (
    isMissing(name) ||
    isMissing(email) ||
    isMissing(phone) ||
    isMissing(subject) ||
    isMissing(projectBudget) ||
    isMissing(message) ||
    isMissing(companyName)
  ) {
    return res.status(400).json({
      success: false,
      error:
        "All fields are required: name, email, phone, subject, projectBudget, message, and companyName",
    });
  }

  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email to company
    const mailOptionsToCompany = {
      from: process.env.EMAIL_USER,
      to: "gitamediline@gmail.com",
      subject: `🚀 New Project Inquiry: ${subject} - ${companyName}`,

      html: `
<!DOCTYPE html>
<html>
<head>
<style>
body{
font-family:Arial,sans-serif;
background:#f4f7fb;
color:#333;
}
.container{
max-width:650px;
margin:auto;
background:#fff;
border-radius:10px;
overflow:hidden;
box-shadow:0 5px 15px rgba(0,0,0,.1);
}
.header{
background:#0F172A;
color:#fff;
padding:25px;
text-align:center;
}
.content{
padding:30px;
}
.field{
margin-bottom:18px;
}
.label{
font-weight:bold;
color:#2563EB;
margin-bottom:5px;
}
.footer{
background:#f8fafc;
padding:20px;
text-align:center;
font-size:13px;
color:#666;
}
</style>
</head>

<body>

<div class="container">

<div class="header">
<h2>🚀 New Website Inquiry</h2>
<p>Vedaham Technology</p>
</div>

<div class="content">

<p>You have received a new inquiry from your website.</p>

<div class="field">
<div class="label">👤 Name</div>
<div>${escapeHtml(name)}</div>
</div>

<div class="field">
<div class="label">📧 Email</div>
<div>${escapeHtml(email)}</div>
</div>

<div class="field">
<div class="label">📱 Phone</div>
<div>${escapeHtml(phone)}</div>
</div>

<div class="field">
<div class="label">📌 Service Requested</div>
<div>${escapeHtml(subject)}</div>
</div>

<div class="field">
<div class="label">🏢 Company Name</div>
<div>${escapeHtml(companyName)}</div>
</div>

<div class="field">
<div class="label">💰 Project Budget</div>
<div>${escapeHtml(projectBudget)}</div>
</div>

<div class="field">
<div class="label">💬 Project Details</div>
<div>${formatMultiline(message)}</div>
</div>

</div>

<div class="footer">
Submitted through the Vedaham Technology website.
</div>

</div>

</body>
</html>
      `,
    };

    // Email confirmation to user
    const mailOptionsToUser = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank You for Contacting Vedaham Technology",

      html: `
<!DOCTYPE html>

<html>

<head>

<style>

body{
font-family:Arial,sans-serif;
background:#f5f7fb;
color:#333;
}

.container{
max-width:650px;
margin:auto;
background:#fff;
border-radius:10px;
overflow:hidden;
box-shadow:0 5px 15px rgba(0,0,0,.1);
}

.header{
background:linear-gradient(135deg,#2563EB,#06B6D4);
color:#fff;
padding:35px;
text-align:center;
}

.content{
padding:35px;
line-height:1.8;
}

.services{
background:#f8fafc;
padding:20px;
border-radius:10px;
margin-top:25px;
}

.footer{
background:#0F172A;
color:#fff;
padding:20px;
text-align:center;
font-size:14px;
}

.button{
display:inline-block;
padding:14px 30px;
background:#2563EB;
color:white;
text-decoration:none;
border-radius:8px;
margin-top:25px;
}

</style>

</head>

<body>

<div class="container">

<div class="header">

<h1>Thank You, ${name}! 👋</h1>

<p>We've received your inquiry.</p>

</div>

<div class="content">

<p>

Thank you for reaching out to <strong>Vedaham Technology</strong>.

</p>

<p>

Our team has received your inquiry and one of our experts will contact you within the next 24 hours to discuss your project.

</p>

<div class="services">

<h3>Your Details</h3>

<ul>

<li><strong>Company:</strong> ${escapeHtml(companyName)}</li>

<li><strong>Project Budget:</strong> ${escapeHtml(projectBudget)}</li>

<li><strong>Subject:</strong> ${escapeHtml(subject)}</li>

</ul>

</div>

<h3>Your Message</h3>

<p style="background:#f8fafc;padding:15px;border-left:4px solid #2563EB;">

${formatMultiline(message)}

</p>

<div class="services">

<h3>What We Can Build For You</h3>

<ul>

<li>🌐 Website Development</li>

<li>📱 Mobile App Development</li>

<li>⚙️ Custom Software Development</li>

<li>🎨 UI/UX Design</li>

</ul>

</div>

<div class="services">

<h3>Why Choose Vedaham Technology?</h3>

<ul>

<li>✔ Since 2016</li>

<li>✔ 180+ Successful Projects</li>

<li>✔ Clients in 24+ Countries</li>

<li>✔ Scalable & Secure Solutions</li>

<li>✔ ISO 27001 Aligned Development</li>

<li>✔ Dedicated Development Team</li>

</ul>

</div>

<p>

Whether you're building a startup MVP, business website, enterprise software, or mobile application, we're excited to help bring your vision to life.

</p>

<a class="button" href="https://vedahamtechnology.com">

Visit Our Website

</a>

</div>

<div class="footer">

<h3>Vedaham Technology</h3>

<p>

📍 Indore, Madhya Pradesh, India

</p>

<p>

🌐 https://vedahamtechnology.com

</p>

<p>

Building Digital Products That Scale.

</p>

</div>

</div>

</body>

</html>
      `,
    };

    // Send both emails
    await transporter.sendMail(mailOptionsToCompany);
    await transporter.sendMail(mailOptionsToUser);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send email",
      details: error.message,
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`🌐 API endpoint: http://localhost:${PORT}/api/contact`);
});
