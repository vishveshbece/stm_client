const SibApiV3Sdk = require('sib-api-v3-sdk');

// 1. Setup the Client (Using the exact format from Brevo's docs)
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Ensure this is set in Render

// 2. Instantiate the Transactional Email API (Correct for receipts/confirmations)
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

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

async function sendViaApi(options) {
  // Use the specific transactional email object
  let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  sendSmtpEmail.sender = { 
    "name": "STM32 Workshop", 
    "email": process.env.EMAIL_FROM || "vishveshbece@gmail.com" 
  };
  sendSmtpEmail.to = [{ "email": options.to }];

  if (options.attachments) {
    sendSmtpEmail.attachment = options.attachments;
  }

  try {
    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Message ID: ' + data.messageId);
    return data;
  } catch (error) {
    console.error('Brevo API Error:', error.response ? error.response.body : error);
    throw error;
  }
}

async function sendProcessingEmail(reg) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #4f46e5, #7c3aed); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#818cf8; margin-top:0;">Registration Received! 🎉</h2>
        <p style="color:#cbd5e1;">Dear ${reg.firstName}, your registration is being processed.</p>
        <p style="color:#94a3b8;">Transaction ID: ${reg.transactionId}</p>
      </div>
    </div>
  </div>`;

  await sendViaApi({ to: reg.email, subject: '✅ Registration Received – STM32 Workshop', html });
}

async function sendConfirmationEmail(reg, qrBuffer) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#34d399;">Congratulations! ✨</h2>
        <p style="color:#cbd5e1;">Your spot is confirmed. QR code attached.</p>
      </div>
    </div>
  </div>`;

  const attachments = [];
  if (qrBuffer) {
    // Brevo API requires base64 string for attachments
    attachments.push({
      "content": qrBuffer.toString('base64'),
      "name": "entry-qrcode.png"
    });
  }

  await sendViaApi({ 
    to: reg.email, 
    subject: '🎉 Confirmed! STM32 Workshop – Entry QR Code', 
    html, 
    attachments 
  });
}

async function sendRejectionEmail(reg, reason) {
  const html = `<div style="${baseStyle}"><div style="${cardStyle}"><p>${reason}</p></div></div>`;
  await sendViaApi({ to: reg.email, subject: 'Registration Status Update', html });
}

module.exports = { sendProcessingEmail, sendConfirmationEmail, sendRejectionEmail };