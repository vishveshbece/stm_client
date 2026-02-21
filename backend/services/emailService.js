const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseStyle = `
  font-family: 'Segoe UI', Arial, sans-serif;
  background: #0a0a0f;
  color: #e2e8f0;
  padding: 40px 20px;
`;

const cardStyle = `
  max-width: 600px;
  margin: 0 auto;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%);
  border-radius: 16px;
  border: 1px solid #312e81;
  overflow: hidden;
`;

async function sendProcessingEmail(reg) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
        <p style="margin:8px 0 0; color:#c4b5fd; font-size:13px;">ROADMAP TO SECURE AN EMBEDDED PLACEMENT</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#818cf8; margin-top:0;">Registration Received! 🎉</h2>
        <p style="color:#cbd5e1;">Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,</p>
        <p style="color:#94a3b8; line-height:1.7;">
          Thank you for registering for the STM32 Mastering Workshop. Your application is currently being processed by our team.
          You will receive a confirmation email once your payment is verified.
        </p>
        <div style="background:#1e293b; border-radius:12px; padding:20px; margin:24px 0; border-left: 4px solid #4f46e5;">
          <p style="margin:0; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">REGISTRATION DETAILS</p>
          <table style="margin-top:12px; width:100%; border-collapse:collapse;">
            <tr><td style="color:#94a3b8; padding:4px 0; width:140px;">Package:</td><td style="color:#e2e8f0; font-weight:600;">${reg.kitOption === 'with-kit' ? 'With Kit (₹1200)' : 'Without Kit (₹699)'}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Transaction ID:</td><td style="color:#e2e8f0;">${reg.transactionId}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Dates:</td><td style="color:#e2e8f0;">March 5 & 6, 2025</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Venue:</td><td style="color:#e2e8f0;">Chennai Institute of Technology</td></tr>
          </table>
        </div>
        <p style="color:#64748b; font-size:13px;">For queries, contact: <strong>Edward Paul Raj - 9894923662</strong></p>
      </div>
      <div style="background:#0f172a; padding:16px 32px; text-align:center; border-top: 1px solid #1e293b;">
        <p style="margin:0; color:#475569; font-size:12px;">IoT Centers of Excellence | Chennai Institute of Technology</p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'STM32 Workshop <no-reply@stm32workshop.com>',
    to: reg.email,
    subject: '✅ Registration Received – STM32 Mastering Workshop',
    html,
  });
}

async function sendConfirmationEmail(reg, qrCodePath) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
        <p style="margin:8px 0 0; color:#a7f3d0; font-size:13px;">YOU'RE CONFIRMED! 🎯</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#34d399; margin-top:0;">Congratulations! Your Spot is Confirmed ✨</h2>
        <p style="color:#cbd5e1;">Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,</p>
        <p style="color:#94a3b8; line-height:1.7;">
          Your registration for the STM32 Mastering Workshop has been <strong style="color:#34d399;">confirmed</strong>!
          Please find your unique entry QR code attached below. Present this at the venue for attendance.
        </p>
        <div style="text-align:center; margin: 24px 0; padding:24px; background:#1e293b; border-radius:12px;">
          <p style="color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:2px; margin-bottom:16px;">YOUR ENTRY QR CODE</p>
          <img src="cid:qrcode" alt="Entry QR Code" style="width:200px; height:200px; border-radius:8px;" />
          <p style="color:#475569; font-size:11px; margin-top:12px; font-family:monospace;">${reg.uniqueToken}</p>
        </div>
        <div style="background:#1e293b; border-radius:12px; padding:20px; border-left: 4px solid #059669;">
          <p style="margin:0 0 12px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">EVENT DETAILS</p>
          <p style="margin:4px 0; color:#e2e8f0;">📅 <strong>March 5 & 6, 2025</strong></p>
          <p style="margin:4px 0; color:#e2e8f0;">⏰ <strong>9:00 AM – 3:00 PM</strong></p>
          <p style="margin:4px 0; color:#e2e8f0;">📍 <strong>Chennai Institute of Technology</strong></p>
          <p style="margin:4px 0; color:#e2e8f0;">💼 <strong>Package: ${reg.kitOption === 'with-kit' ? 'With Kit' : 'Without Kit'}</strong></p>
        </div>
      </div>
      <div style="background:#0f172a; padding:16px 32px; text-align:center; border-top: 1px solid #1e293b;">
        <p style="margin:0; color:#475569; font-size:12px;">IoT Centers of Excellence | Chennai Institute of Technology</p>
      </div>
    </div>
  </div>`;

  const attachments = [];
  if (qrCodePath && fs.existsSync(qrCodePath)) {
    attachments.push({ filename: 'entry-qrcode.png', path: qrCodePath, cid: 'qrcode' });
  }

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'STM32 Workshop <no-reply@stm32workshop.com>',
    to: reg.email,
    subject: '🎉 Confirmed! STM32 Mastering Workshop – Entry QR Code',
    html,
    attachments,
  });
}

async function sendRejectionEmail(reg, reason) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #dc2626, #9f1239); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
        <p style="margin:8px 0 0; color:#fca5a5; font-size:13px;">REGISTRATION UPDATE</p>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#f87171; margin-top:0;">Registration Status Update</h2>
        <p style="color:#cbd5e1;">Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,</p>
        <p style="color:#94a3b8; line-height:1.7;">
          We regret to inform you that your registration could not be confirmed at this time.
        </p>
        <div style="background:#1e293b; border-radius:12px; padding:20px; margin:24px 0; border-left: 4px solid #dc2626;">
          <p style="margin:0 0 8px; color:#64748b; font-size:12px; text-transform:uppercase; letter-spacing:1px;">REASON</p>
          <p style="margin:0; color:#fca5a5;">${reason}</p>
        </div>
        <p style="color:#94a3b8; line-height:1.7;">
          If you believe this is an error, please contact our coordinator:
        </p>
        <p style="color:#64748b; font-size:13px;">Edward Paul Raj: <strong>9894923662</strong></p>
      </div>
      <div style="background:#0f172a; padding:16px 32px; text-align:center; border-top: 1px solid #1e293b;">
        <p style="margin:0; color:#475569; font-size:12px;">IoT Centers of Excellence | Chennai Institute of Technology</p>
      </div>
    </div>
  </div>`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'STM32 Workshop <no-reply@stm32workshop.com>',
    to: reg.email,
    subject: 'STM32 Workshop – Registration Status Update',
    html,
  });
}

module.exports = { sendProcessingEmail, sendConfirmationEmail, sendRejectionEmail };
