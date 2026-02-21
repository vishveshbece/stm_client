# STM32 Mastering Workshop – Full Stack Application

> **STM32 MASTERING WORKSHOP: Roadmap to Secure an Embedded Placement**  
> March 5 & 6 | 9:00 AM – 3:00 PM | Chennai Institute of Technology

---

## 🏗️ Project Structure

```
stm32-workshop/
├── backend/          # Node.js + Express + MongoDB API (Port 5000)
├── client/           # React Workshop Website (Port 3000)
├── admin/            # React Admin Portal (Port 3001)
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn
- Gmail account (for Nodemailer email sending)

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your MongoDB URI, email credentials, etc.

npm start          # Production
npm run dev        # Development with nodemon
```

### 2. Client (Workshop Website) Setup

```bash
cd client
npm install
npm start          # Runs on http://localhost:3000
```

### 3. Admin Portal Setup

```bash
cd admin
npm install
npm start          # Runs on http://localhost:3001
```

---

## 🔧 Environment Variables (Backend `.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/stm32-workshop

# JWT - Change this in production!
JWT_SECRET=your_super_secret_jwt_key_here

# URLs for CORS
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001

# Nodemailer - Gmail SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password    # Use App Password, not regular password
EMAIL_FROM=STM32 Workshop <your_email@gmail.com>

# Admin login credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@STM32#2025
```

### Gmail App Password Setup
1. Go to Google Account → Security → 2-Step Verification (enable if needed)
2. Go to Security → App passwords
3. Generate a new app password for "Mail"
4. Use that 16-character password as `EMAIL_PASS`

---

## 🌐 Client App (`localhost:3000`)

### Features
- **Hero Section** – Floating animated STM32 Nucleo-64 board SVG with particle effects
- **Program Highlights** – 6-card grid showing all curriculum topics
- **Pricing Section** – Side-by-side ₹699 (No Kit) / ₹1200 (With Kit) cards
- **3-Step Registration Modal**:
  - **Step 1**: Personal details form + Resume upload (max 1MB)
  - **Step 2**: Kit selection + Static payment QR code
  - **Step 3**: Transaction ID entry + Payment proof upload (max 1MB)
- **Duplicate Transaction ID Check** – Live validation against DB before submission
- **Processing Email** – Sent automatically on successful submission

### Registration Flow
```
Step 1 (Details) → Step 2 (Payment) → Step 3 (Verify + Submit)
                                              ↓
                                    MongoDB Save + Email Sent
```

---

## 🔐 Admin Portal (`localhost:3001`)

### Login
- Default: `admin` / `Admin@STM32#2025`
- JWT token stored in localStorage (8h expiry)

### Dashboard Features

#### Registrations Table
- View all registrants with status badges
- Search by name, email, or transaction ID
- Filter by status (Processing / Confirmed / Rejected)
- **View Details** – Full applicant profile with clickable Resume & Payment Proof links
- **Confirm Button** → Generates QR code → Sends confirmation email with QR attached
- **Reject Button** → Prompts for reason → Sends rejection email with reason

#### Attendance Scanner
- Integrated `html5-qrcode` camera scanner
- Day 1 (March 5) / Day 2 (March 6) selector
- Prevents duplicate attendance marking per day
- Real-time visual feedback (success / duplicate / error)
- Manual QR JSON input for testing

#### Stats Dashboard
- Total / Processing / Confirmed / Rejected counts
- With Kit vs Without Kit breakdown
- Day 1 & Day 2 attendance counts

---

## 📧 Email System

| Event | Trigger | Content |
|-------|---------|---------|
| Processing | On registration submit | Registration details, transaction ID |
| Confirmation | Admin clicks Confirm | Event details + QR code image attached |
| Rejection | Admin clicks Reject + enters reason | Admin's specific reason |

---

## 🗄️ Database Schema

```javascript
Registration {
  // Personal
  firstName, lastName, email, mobile,
  college, specialization, course,
  
  // Files
  resumePath,          // /uploads/resumes/...
  paymentProofPath,    // /uploads/payments/...
  
  // Payment
  kitOption,           // 'with-kit' | 'without-kit'
  amount,              // 699 | 1200
  transactionId,       // Unique index
  
  // Status
  status,              // 'processing' | 'confirmed' | 'rejected'
  rejectionReason,
  
  // QR Code
  uniqueToken,         // UUID for QR
  qrCodePath,          // /qrcodes/qr-{uuid}.png
  
  // Attendance
  attendedDay1,        // Boolean
  attendedDay2,        // Boolean
  
  createdAt, updatedAt
}
```

---

## 📡 API Endpoints

### Public (Client)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/registrations/check-transaction/:txId` | Check if transaction ID exists |
| `POST` | `/api/registrations` | Submit registration (multipart/form-data) |

### Admin (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/login` | Admin login |
| `GET` | `/api/admin/registrations` | List all registrations |
| `GET` | `/api/admin/registrations/:id` | Get single registration |
| `POST` | `/api/admin/registrations/:id/confirm` | Confirm & send QR |
| `POST` | `/api/admin/registrations/:id/reject` | Reject with reason |
| `GET` | `/api/admin/stats` | Dashboard statistics |
| `POST` | `/api/attendance/scan` | Mark attendance via QR scan |

---

## 🔒 Security

- JWT authentication for all admin routes (8h expiry)
- CORS restricted to client + admin origins only
- File size hard limit: 1MB per file (Multer)
- Transaction ID uniqueness enforced at DB level (unique sparse index)
- Admin credentials stored in environment variables

---

## 🎨 Design System

| Item | Value |
|------|-------|
| Display Font | Orbitron (tech/embedded aesthetic) |
| Body Font | Exo 2 |
| Monospace | JetBrains Mono |
| Primary | Indigo 500–600 (`#4f46e5`) |
| Accent | Violet 500–600 (`#7c3aed`) |
| Background | `#030712` (near-black space) |
| Glass effect | `backdrop-filter: blur(20px)` |

---

## 📁 File Storage

```
backend/
├── uploads/
│   ├── resumes/     # Resume files (PDF/images)
│   └── payments/    # Payment proof images
└── qrcodes/         # Generated QR code PNGs
```

Served statically at:
- `http://localhost:5000/uploads/...`
- `http://localhost:5000/qrcodes/...`

---

## 🔄 Updating the Payment QR Code

In `client/src/components/RegistrationSection.jsx`, find the `PaymentQR` component.
Replace the SVG placeholder with your actual UPI QR code image:

```jsx
function PaymentQR() {
  return (
    <img 
      src="/your-actual-qr-code.png" 
      alt="Payment QR"
      style={{ width: 200, height: 200 }}
    />
  );
}
```

Or use a base64-encoded image directly for no external dependencies.

---

## 📞 Support

**Coordinator:** Edward Paul Raj – 9894923662  
**Organizers:** IoT Centers of Excellence, Chennai Institute of Technology
