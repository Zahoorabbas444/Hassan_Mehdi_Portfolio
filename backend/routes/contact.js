/**
 * routes/contact.js
 * POST /api/contact
 *
 * Flow:
 *  1. Validate input
 *  2. Save message to MongoDB
 *  3. Send email notification to Hassan
 *  4. Send auto-reply email to the visitor
 *  5. Return success response
 */

const express    = require('express');
const nodemailer = require('nodemailer');
const Contact    = require('../models/Contact');

const router = express.Router();

/* ── Build the Nodemailer transporter ── */
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

/* ── Email: Notification to Hassan ── */
function buildNotificationEmail (data) {
  return {
    from:    `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
    to:      process.env.EMAIL_RECEIVER,
    subject: `📬 New Message: ${data.subject}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;background:#0c1628;color:#e2e8f0;border-radius:12px;overflow:hidden">
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#0077b6,#00b4d8);padding:28px 32px">
          <h2 style="margin:0;color:#ffffff;font-size:1.3rem">📬 New Portfolio Contact</h2>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:0.85rem">
            Received on ${new Date().toLocaleString('en-PK', { timeZone: 'Asia/Karachi' })} (PKT)
          </p>
        </div>

        <!-- Body -->
        <div style="padding:28px 32px">
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:0.82rem;width:90px">NAME</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);font-weight:bold;color:#fff">${data.name}</td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:0.82rem">EMAIL</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08)">
                <a href="mailto:${data.email}" style="color:#00b4d8">${data.email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-size:0.82rem">SUBJECT</td>
              <td style="padding:10px 0;border-bottom:1px solid rgba(255,255,255,0.08);color:#fff">${data.subject}</td>
            </tr>
          </table>

          <div style="margin-top:22px">
            <p style="color:#94a3b8;font-size:0.82rem;margin-bottom:10px">MESSAGE</p>
            <div style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:18px;line-height:1.75;color:#e2e8f0">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top:24px;text-align:center">
            <a href="mailto:${data.email}?subject=Re: ${data.subject}"
               style="background:#00b4d8;color:#09111f;padding:13px 30px;border-radius:8px;font-weight:bold;text-decoration:none;display:inline-block">
              ↩ Reply to ${data.name}
            </a>
          </div>
        </div>

        <!-- Footer -->
        <div style="padding:18px 32px;background:rgba(0,0,0,0.2);text-align:center;font-size:0.78rem;color:#4e637a">
          Sent via Hassan Mehdi Portfolio Contact Form
        </div>
      </div>
    `,
  };
}

/* ── Email: Auto-reply to visitor ── */
function buildAutoReplyEmail (data) {
  return {
    from:    `"Hassan Mehdi" <${process.env.EMAIL_USER}>`,
    to:      data.email,
    subject: `✅ Got your message, ${data.name.split(' ')[0]}!`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:580px;margin:auto;background:#0c1628;color:#e2e8f0;border-radius:12px;overflow:hidden">
        <div style="background:linear-gradient(135deg,#0077b6,#00b4d8);padding:28px 32px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:1.5rem">&lt;Hassan Mehdi /&gt;</h1>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:0.85rem">Full Stack Web Developer</p>
        </div>
        <div style="padding:32px">
          <h2 style="margin:0 0 16px;color:#00b4d8;font-size:1.1rem">Hey ${data.name.split(' ')[0]}, thanks for reaching out! 👋</h2>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:16px">
            I have received your message and will get back to you within <strong style="color:#e2e8f0">24 hours</strong>.
          </p>
          <div style="background:rgba(255,255,255,0.05);border-left:3px solid #00b4d8;border-radius:4px;padding:14px 18px;margin-bottom:24px">
            <p style="margin:0;font-size:0.85rem;color:#94a3b8">Your subject:</p>
            <p style="margin:4px 0 0;font-weight:bold;color:#fff">${data.subject}</p>
          </div>
          <p style="color:#94a3b8;line-height:1.8;margin-bottom:0">
            While you wait, feel free to check out my work or connect with me:
          </p>
          <div style="margin-top:20px;display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://github.com/hassanmehdi"   style="color:#00b4d8;text-decoration:none">GitHub</a> &nbsp;·&nbsp;
            <a href="https://linkedin.com/in/hassanmehdi" style="color:#00b4d8;text-decoration:none">LinkedIn</a> &nbsp;·&nbsp;
            <a href="https://fiverr.com/hassanmehdi"   style="color:#00b4d8;text-decoration:none">Fiverr</a>
          </div>
        </div>
        <div style="padding:18px 32px;background:rgba(0,0,0,0.2);text-align:center;font-size:0.78rem;color:#4e637a">
          &copy; ${new Date().getFullYear()} Hassan Mehdi — All rights reserved
        </div>
      </div>
    `,
  };
}

/* ── Route: POST /api/contact ── */
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    /* 1. Basic validation */
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address.',
      });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Message must be at least 10 characters.',
      });
    }

    /* 2. Save to MongoDB */
    const contact = await Contact.create({
      name:      name.trim(),
      email:     email.trim().toLowerCase(),
      subject:   subject.trim(),
      message:   message.trim(),
      ipAddress: req.ip,
    });

    /* 3. Send notification email to Hassan */
    await transporter.sendMail(buildNotificationEmail({ name, email, subject, message }));

    /* 4. Send auto-reply to visitor */
    await transporter.sendMail(buildAutoReplyEmail({ name, email, subject }));

    /* 5. Success */
    console.log(`✅ New contact from ${name} <${email}> — saved as ID: ${contact._id}`);

    return res.status(201).json({
      success: true,
      message: 'Message received! Hassan will reply within 24 hours.',
    });

  } catch (err) {
    console.error('❌ Contact route error:', err.message);

    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again or email directly.',
    });
  }
});

module.exports = router;
