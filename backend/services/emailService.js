const SibApiV3Sdk = require('sib-api-v3-sdk');

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// ─── Shared Styles ───────────────────────────────────────────────────────────

const base = `font-family:'Segoe UI',Arial,sans-serif;margin:0;padding:0;background:#030712;`;

const wrapper = `max-width:620px;margin:0 auto;background:#030712;padding:32px 16px;`;

const card = `
  background:linear-gradient(135deg,#0f172a 0%,#1a1040 100%);
  border-radius:20px;
  border:1px solid #312e81;
  overflow:hidden;
  box-shadow:0 0 60px rgba(99,102,241,0.15);
`;

const sectionPad = `padding:32px;`;

const infoBox = `
  background:rgba(30,27,75,0.6);
  border-radius:12px;
  padding:20px 24px;
  margin:20px 0;
  border-left:4px solid #4f46e5;
`;

const tag = `
  display:inline-block;
  background:rgba(79,70,229,0.2);
  border:1px solid rgba(99,102,241,0.4);
  border-radius:20px;
  padding:4px 14px;
  font-size:11px;
  color:#a5b4fc;
  letter-spacing:1.5px;
  font-weight:600;
  margin-bottom:16px;
`;

const divider = `border:none;border-top:1px solid rgba(99,102,241,0.2);margin:24px 0;`;

const highlight = `
  display:flex;
  align-items:center;
  gap:10px;
  padding:8px 0;
  color:#cbd5e1;
  font-size:14px;
`;

const footer = `
  background:#0a0a1a;
  border-top:1px solid rgba(99,102,241,0.2);
  padding:20px 32px;
  text-align:center;
`;

// ─── Event Details Block (shared) ────────────────────────────────────────────

const eventDetailsBlock = `
  <div style="${infoBox}">
    <p style="margin:0 0 12px;color:#6366f1;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">EVENT DETAILS</p>
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;">📅 Date</td>
        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">March 5 & 6, 2025</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#64748b;font-size:13px;">⏰ Time</td>
        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">9:00 AM – 3:00 PM Daily</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#64748b;font-size:13px;">📍 Venue</td>
        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">Chennai Institute of Technology</td>
      </tr>
      <tr>
        <td style="padding:5px 0;color:#64748b;font-size:13px;">🏛️ Organized by</td>
        <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">IoT Centers of Excellence</td>
      </tr>
    </table>
  </div>
`;

const programHighlights = `
  <div style="${infoBox}border-left-color:#7c3aed;">
    <p style="margin:0 0 14px;color:#7c3aed;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">PROGRAM HIGHLIGHTS</p>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>Hands-On Training with STM32 Development Board</span></div>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>Bare Metal Programming Concepts</span></div>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>STM32 HAL Architecture</span></div>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>Communication Protocols – UART | SPI | I2C</span></div>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>Peripheral Interfacing & Debugging</span></div>
    <div style="${highlight}"><span style="color:#6366f1;font-size:16px;">⚡</span><span>Embedded Career Roadmap & Placement Strategy</span></div>
  </div>
`;

const valueAdditions = `
  <div style="display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;">
    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:10px 16px;font-size:12px;color:#6ee7b7;">🏆 Certificate of Participation</div>
    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:10px 16px;font-size:12px;color:#6ee7b7;">☕ Refreshments Included</div>
    <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.3);border-radius:10px;padding:10px 16px;font-size:12px;color:#6ee7b7;">🎁 Performance-Based Awards & Gifts</div>
  </div>
`;

const coordinatorBlock = `
  <div style="background:rgba(15,23,42,0.8);border-radius:10px;padding:16px 20px;margin-top:20px;border:1px solid rgba(99,102,241,0.15);">
    <p style="margin:0 0 6px;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:1.5px;">PROGRAM COORDINATOR</p>
    <p style="margin:0;color:#e2e8f0;font-size:14px;font-weight:600;">Edward Paul Raj</p>
    <p style="margin:4px 0 0;color:#6366f1;font-size:13px;">📞 9894923662</p>
  </div>
`;

const footerBlock = `
  <div style="${footer}">
    <p style="margin:0 0 4px;color:#4f46e5;font-size:12px;font-weight:700;letter-spacing:1px;">IOT CENTERS OF EXCELLENCE</p>
    <p style="margin:0;color:#374151;font-size:12px;">Chennai Institute of Technology · STM32 Mastering Workshop 2025</p>
  </div>
`;

// ─── API Sender ───────────────────────────────────────────────────────────────

async function sendViaApi(options) {
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  sendSmtpEmail.sender = {
    name: 'STM32 Workshop',
    email: process.env.EMAIL_FROM || 'vishveshbece@gmail.com',
  };
  sendSmtpEmail.to = [{ email: options.to }];
  if (options.attachments) {
    sendSmtpEmail.attachment = options.attachments;
  }
  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent. Message ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Brevo API Error:', error.response ? error.response.body : error);
    throw error;
  }
}

// ─── Processing Email ─────────────────────────────────────────────────────────

async function sendProcessingEmail(reg) {
  const html = `
  <div style="${base}">
  <div style="${wrapper}">
  <div style="${card}">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%);padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;color:#c4b5fd;font-size:11px;letter-spacing:3px;font-weight:600;">IOT CENTERS OF EXCELLENCE</p>
      <h1 style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:900;letter-spacing:2px;">STM32 MASTERING</h1>
      <h2 style="margin:0 0 12px;color:#fff;font-size:20px;font-weight:700;letter-spacing:1px;">WORKSHOP</h2>
      <p style="margin:0;color:#a5b4fc;font-size:13px;letter-spacing:1px;">ROADMAP TO SECURE AN EMBEDDED PLACEMENT</p>
    </div>

    <!-- Body -->
    <div style="${sectionPad}">
      <div style="${tag}">REGISTRATION RECEIVED</div>
      <h2 style="margin:0 0 8px;color:#818cf8;font-size:20px;">Your Application is Being Processed 🎉</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,<br/><br/>
        Thank you for registering for the <strong style="color:#a5b4fc;">STM32 Mastering Workshop</strong>. 
        We have received your application and payment details. Our team is currently reviewing your submission.
        You will receive a confirmation email once your payment is verified.
      </p>

      <!-- Registration Summary -->
      <div style="${infoBox}">
        <p style="margin:0 0 12px;color:#6366f1;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">REGISTRATION SUMMARY</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;">👤 Name</td>
            <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${reg.firstName} ${reg.lastName}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">📧 Email</td>
            <td style="padding:5px 0;color:#e2e8f0;font-size:13px;">${reg.email}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">💼 Package</td>
            <td style="padding:5px 0;color:#a5b4fc;font-size:13px;font-weight:600;">${reg.kitOption === 'with-kit' ? 'With Complete Kit (₹1200)' : 'Without Kit (₹699)'}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">🔖 Transaction ID</td>
            <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-family:monospace;">${reg.transactionId}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">📊 Status</td>
            <td style="padding:5px 0;"><span style="background:rgba(245,158,11,0.2);color:#fbbf24;border-radius:20px;padding:2px 12px;font-size:12px;font-weight:700;">PROCESSING</span></td>
          </tr>
        </table>
      </div>

      ${eventDetailsBlock}
      ${programHighlights}
      ${valueAdditions}

      <hr style="${divider}"/>

      <!-- Next Steps -->
      <div style="${infoBox}border-left-color:#0d9488;">
        <p style="margin:0 0 12px;color:#0d9488;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">NEXT STEPS</p>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>Our team will verify your payment within 24 hours</span></div>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>You will receive a confirmation email with your unique entry QR code</span></div>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>Arrive at Chennai Institute of Technology by 9:00 AM on March 5</span></div>
      </div>

      ${coordinatorBlock}
    </div>

    ${footerBlock}
  </div>
  </div>
  </div>`;

  await sendViaApi({
    to: reg.email,
    subject: '✅ Registration Received – STM32 Mastering Workshop',
    html,
  });
}

// ─── Confirmation Email ───────────────────────────────────────────────────────

async function sendConfirmationEmail(reg, qrBuffer) {
  const html = `
  <div style="${base}">
  <div style="${wrapper}">
  <div style="${card}">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#059669 0%,#0d9488 100%);padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;color:#a7f3d0;font-size:11px;letter-spacing:3px;font-weight:600;">IOT CENTERS OF EXCELLENCE</p>
      <h1 style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:900;letter-spacing:2px;">STM32 MASTERING</h1>
      <h2 style="margin:0 0 12px;color:#fff;font-size:20px;font-weight:700;letter-spacing:1px;">WORKSHOP</h2>
      <div style="display:inline-block;background:rgba(255,255,255,0.2);border-radius:20px;padding:6px 20px;margin-top:8px;">
        <p style="margin:0;color:#fff;font-size:13px;font-weight:700;letter-spacing:2px;">🎯 YOU'RE CONFIRMED!</p>
      </div>
    </div>

    <!-- Body -->
    <div style="${sectionPad}">
      <div style="${tag}background:rgba(16,185,129,0.2);border-color:rgba(16,185,129,0.4);color:#6ee7b7;">REGISTRATION CONFIRMED</div>
      <h2 style="margin:0 0 8px;color:#34d399;font-size:20px;">Congratulations! Your Spot is Secured ✨</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,<br/><br/>
        Your registration for the <strong style="color:#6ee7b7;">STM32 Mastering Workshop</strong> has been 
        <strong style="color:#34d399;">confirmed</strong>! 
        Your unique entry QR code is attached to this email. Please present it at the venue entrance for attendance marking.
      </p>

      <!-- QR Code Section -->
      <div style="background:rgba(16,185,129,0.05);border:1px solid rgba(16,185,129,0.2);border-radius:16px;padding:28px;text-align:center;margin:20px 0;">
        <p style="margin:0 0 16px;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">YOUR UNIQUE ENTRY QR CODE</p>
        <img src="cid:qrcode" alt="Entry QR Code" style="width:180px;height:180px;border-radius:12px;border:3px solid rgba(16,185,129,0.3);"/>
        <p style="margin:12px 0 0;color:#374151;font-size:11px;font-family:monospace;letter-spacing:1px;">${reg.uniqueToken}</p>
        <p style="margin:8px 0 0;color:#64748b;font-size:12px;">Present this QR code at the venue entrance</p>
      </div>

      <!-- Registration Summary -->
      <div style="${infoBox}border-left-color:#059669;">
        <p style="margin:0 0 12px;color:#059669;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">YOUR REGISTRATION</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;width:130px;">👤 Name</td>
            <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-weight:600;">${reg.firstName} ${reg.lastName}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">💼 Package</td>
            <td style="padding:5px 0;color:#6ee7b7;font-size:13px;font-weight:600;">${reg.kitOption === 'with-kit' ? 'With Complete Kit (₹1200)' : 'Without Kit (₹699)'}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">🔖 Transaction ID</td>
            <td style="padding:5px 0;color:#e2e8f0;font-size:13px;font-family:monospace;">${reg.transactionId}</td>
          </tr>
          <tr>
            <td style="padding:5px 0;color:#64748b;font-size:13px;">📊 Status</td>
            <td style="padding:5px 0;"><span style="background:rgba(16,185,129,0.2);color:#34d399;border-radius:20px;padding:2px 12px;font-size:12px;font-weight:700;">CONFIRMED ✓</span></td>
          </tr>
        </table>
      </div>

      ${eventDetailsBlock}
      ${programHighlights}
      ${valueAdditions}

      <!-- Kit Info if applicable -->
      ${reg.kitOption === 'with-kit' ? `
      <div style="${infoBox}border-left-color:#7c3aed;">
        <p style="margin:0 0 12px;color:#7c3aed;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">YOUR KIT INCLUDES</p>
        <div style="${highlight}"><span style="color:#a78bfa;">📦</span><span>STM32 Development Board (Nucleo-64)</span></div>
        <div style="${highlight}"><span style="color:#a78bfa;">📦</span><span>Starter Peripheral Modules</span></div>
        <div style="${highlight}"><span style="color:#a78bfa;">📦</span><span>USB Micro-B Cable</span></div>
        <div style="${highlight}"><span style="color:#a78bfa;">📦</span><span>Breadboard & Jump Wires</span></div>
      </div>` : ''}

      <hr style="${divider}"/>

      <!-- Important Reminders -->
      <div style="${infoBox}border-left-color:#f59e0b;background:rgba(245,158,11,0.05);">
        <p style="margin:0 0 12px;color:#f59e0b;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">⚠️ IMPORTANT REMINDERS</p>
        <div style="${highlight}"><span style="color:#fbbf24;">•</span><span>Carry this QR code (digital or printed) for entry</span></div>
        <div style="${highlight}"><span style="color:#fbbf24;">•</span><span>Arrive at least 15 minutes before 9:00 AM</span></div>
        <div style="${highlight}"><span style="color:#fbbf24;">•</span><span>Bring your college ID card</span></div>
        <div style="${highlight}"><span style="color:#fbbf24;">•</span><span>Attendance is mandatory for both days to receive the certificate</span></div>
      </div>

      ${coordinatorBlock}
    </div>

    ${footerBlock}
  </div>
  </div>
  </div>`;

  const attachments = [];
  if (qrBuffer) {
    attachments.push({
      content: qrBuffer.toString('base64'),
      name: 'entry-qrcode.png',
    });
  }

  await sendViaApi({
    to: reg.email,
    subject: '🎉 Confirmed! STM32 Mastering Workshop – Your Entry QR Code Inside',
    html,
    attachments,
  });
}

// ─── Rejection Email ──────────────────────────────────────────────────────────

async function sendRejectionEmail(reg, reason) {
  const html = `
  <div style="${base}">
  <div style="${wrapper}">
  <div style="${card}">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#dc2626 0%,#9f1239 100%);padding:40px 32px;text-align:center;">
      <p style="margin:0 0 8px;color:#fca5a5;font-size:11px;letter-spacing:3px;font-weight:600;">IOT CENTERS OF EXCELLENCE</p>
      <h1 style="margin:0 0 6px;color:#fff;font-size:26px;font-weight:900;letter-spacing:2px;">STM32 MASTERING</h1>
      <h2 style="margin:0 0 12px;color:#fff;font-size:20px;font-weight:700;letter-spacing:1px;">WORKSHOP</h2>
      <p style="margin:0;color:#fca5a5;font-size:13px;letter-spacing:1px;">REGISTRATION STATUS UPDATE</p>
    </div>

    <!-- Body -->
    <div style="${sectionPad}">
      <div style="${tag}background:rgba(239,68,68,0.15);border-color:rgba(239,68,68,0.3);color:#fca5a5;">STATUS UPDATE</div>
      <h2 style="margin:0 0 8px;color:#f87171;font-size:20px;">Registration Could Not Be Confirmed</h2>
      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 20px;">
        Dear <strong style="color:#e2e8f0;">${reg.firstName} ${reg.lastName}</strong>,<br/><br/>
        Thank you for your interest in the <strong style="color:#fca5a5;">STM32 Mastering Workshop</strong>. 
        Unfortunately, we were unable to confirm your registration at this time.
      </p>

      <!-- Reason Box -->
      <div style="${infoBox}border-left-color:#dc2626;background:rgba(220,38,38,0.05);">
        <p style="margin:0 0 8px;color:#dc2626;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">REASON FOR REJECTION</p>
        <p style="margin:0;color:#fca5a5;font-size:14px;line-height:1.6;">${reason}</p>
      </div>

      <!-- What to do next -->
      <div style="${infoBox}border-left-color:#0d9488;background:rgba(13,148,136,0.05);">
        <p style="margin:0 0 12px;color:#0d9488;font-size:11px;text-transform:uppercase;letter-spacing:2px;font-weight:700;">WHAT YOU CAN DO</p>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>Double-check your payment details and transaction ID</span></div>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>Contact our coordinator directly for assistance</span></div>
        <div style="${highlight}"><span style="color:#14b8a6;">✦</span><span>Re-register with correct information if needed</span></div>
      </div>

      ${eventDetailsBlock}

      <hr style="${divider}"/>

      <p style="color:#94a3b8;font-size:14px;line-height:1.7;margin:0 0 16px;">
        If you believe this decision was made in error or need further assistance, 
        please contact our program coordinator directly.
      </p>

      ${coordinatorBlock}
    </div>

    ${footerBlock}
  </div>
  </div>
  </div>`;

  await sendViaApi({
    to: reg.email,
    subject: 'STM32 Mastering Workshop – Registration Status Update',
    html,
  });
}

module.exports = { sendProcessingEmail, sendConfirmationEmail, sendRejectionEmail };