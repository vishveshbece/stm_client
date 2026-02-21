const Brevo = require('@getbrevo/brevo');

// Initialize Brevo API client
const defaultClient = Brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY; // Use the xkeysib-... key

const apiInstance = new Brevo.TransactionalEmailsApi();

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

// Helper to handle the API sending logic
async function sendViaApi(options) {
  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = options.html;
  sendSmtpEmail.sender = { 
    name: "STM32 Workshop", 
    email: process.env.EMAIL_FROM || "vishveshbece@gmail.com" 
  };
  sendSmtpEmail.to = [{ email: options.to }];
  
  if (options.attachments) {
    sendSmtpEmail.attachment = options.attachments;
  }

  try {
    return await apiInstance.sendTransacEmail(sendSmtpEmail);
  } catch (error) {
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
        </p>
        <div style="background:#1e293b; border-radius:12px; padding:20px; margin:24px 0; border-left: 4px solid #4f46e5;">
          <table style="width:100%; border-collapse:collapse;">
            <tr><td style="color:#94a3b8; padding:4px 0;">Package:</td><td style="color:#e2e8f0;">${reg.kitOption === 'with-kit' ? 'With Kit (₹1200)' : 'Without Kit (₹699)'}</td></tr>
            <tr><td style="color:#94a3b8; padding:4px 0;">Transaction ID:</td><td style="color:#e2e8f0;">${reg.transactionId}</td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>`;

  await sendViaApi({ to: reg.email, subject: '✅ Registration Received – STM32 Mastering Workshop', html });
}

async function sendConfirmationEmail(reg, qrBuffer) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: linear-gradient(135deg, #059669, #0d9488); padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px; letter-spacing:2px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#34d399; margin-top:0;">Congratulations! ✨</h2>
        <p style="color:#cbd5e1;">Dear ${reg.firstName}, your spot is confirmed.</p>
        <p style="color:#94a3b8;">Please see the attached QR code for entry.</p>
      </div>
    </div>
  </div>`;

  const attachments = [];
  if (qrBuffer) {
    attachments.push({
      content: qrBuffer.toString('base64'), // API requires base64 string
      name: 'entry-qrcode.png'
    });
  }

  await sendViaApi({ 
    to: reg.email, 
    subject: '🎉 Confirmed! STM32 Mastering Workshop', 
    html, 
    attachments 
  });
}

async function sendRejectionEmail(reg, reason) {
  const html = `
  <div style="${baseStyle}">
    <div style="${cardStyle}">
      <div style="background: #dc2626; padding: 32px; text-align: center;">
        <h1 style="margin:0; color:#fff; font-size:24px;">STM32 MASTERING WORKSHOP</h1>
      </div>
      <div style="padding: 32px;">
        <h2 style="color:#f87171;">Status Update</h2>
        <p style="color:#fca5a5;">${reason}</p>
      </div>
    </div>
  </div>`;

  await sendViaApi({ to: reg.email, subject: 'STM32 Workshop – Update', html });
}

module.exports = { sendProcessingEmail, sendConfirmationEmail, sendRejectionEmail };