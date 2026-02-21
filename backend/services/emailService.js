const Brevo = require('@getbrevo/brevo');

// 1. Initialize the API Instance
const apiInstance = new Brevo.TransactionalEmailsApi();

// 2. Set the API Key (Ensure BREVO_API_KEY is set in Render environment variables)
apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys.apiKey, process.env.BREVO_API_KEY);

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

/**
 * Core helper function to send emails via Brevo API
 */
async function sendViaApi(options) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  
  // Uses the verified sender email from your Brevo dashboard
  sendSmtpEmail.sender = { 
    name: "STM32 Workshop", 
    email: process.env.EMAIL_FROM || "vishveshbece@gmail.com" 
  };
  
  sendSmtpEmail.to = [{ email: options.to }];
  
  if (options.attachments) {
    sendSmtpEmail.attachment = options.attachments;
  }

  try {
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Brevo Email Sent Successfully:', result.body);
    return result;
  } catch (error) {
    // Crucial for debugging: log the actual error message from Brevo
    console.error("Brevo API Error:", error.response ? error.response.body : error);
    throw error;
  }
}

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
            <tr><td style="color:#94a3b8; padding:4px 0;">Dates:</td><td style="color:#e2e8f0;">March 5 & 6, 2026</td></tr>
          </table>
        </div>
      </div>
      <div style="background:#0f172a; padding:16px 32px; text-align:center; border-top: 1px solid #1e293b;">
        <p style="margin:0; color:#475569; font-size:12px;">IoT Centers of Excellence | Chennai Institute of Technology</p>
      </div>
    </div>
  </div>`;

  await sendViaApi({ 
    to: reg.email, 
    subject: '✅ Registration Received – STM32 Mastering Workshop', 
    html 
  });
}

async function sendConfirmationEmail(reg, qrBuffer) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#34d399; margin-top:0;">Congratulations! Spot Confirmed ✨</h2>
        <p style="color:#cbd5e1;">Dear <strong style="color:#e2e8f0;">${reg.firstName}</strong>,</p>
        <p style="color:#94a3b8; line-height:1.7;">
          Your registration has been <strong style="color:#34d399;">confirmed</strong>! 
          Please find your unique entry QR code attached to this email.
        </p>
      </div>
      <div style="background:#0f172a; padding:16px 32px; text-align:center; border-top: 1px solid #1e293b;">
        <p style="margin:0; color:#475569; font-size:12px;">IoT Centers of Excellence | CIT</p>
      </div>
    </div>
  </div>`;

  const attachments = [];
  if (qrBuffer) {
    // The Brevo API requires the buffer to be converted to a base64 string
    attachments.push({
      content: qrBuffer.toString('base64'),
      name: 'entry-qrcode.png'
    });
  }

  await sendViaApi({ 
    to: reg.email, 
    subject: '🎉 Confirmed! STM32 Mastering Workshop – Entry QR Code', 
    html, 
    attachments 
  });
}

async function sendRejectionEmail(reg, reason) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #dc2626, #9f1239); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#f87171; margin-top:0;">Registration Status Update</h2>
        <p style="color:#cbd5e1;">Dear ${reg.firstName},</p>
        <div style="background:#1e293b; border-radius:12px; padding:20px; margin:24px 0; border-left: 4px solid #dc2626;">
          <p style="margin:0; color:#fca5a5;">${reason}</p>
        </div>
      </div>
    </div>
  </div>`;

  await sendViaApi({ 
    to: reg.email, 
    subject: 'STM32 Workshop – Registration Status Update', 
    html 
  });
}

module.exports = { sendProcessingEmail, sendConfirmationEmail, sendRejectionEmail };