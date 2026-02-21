const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');
const Registration = require('../models/Registration');
const authMiddleware = require('../middleware/auth');
const { sendConfirmationEmail, sendRejectionEmail } = require('../services/emailService');

// Admin login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'Admin@STM32#2025';

  if (username !== adminUser || password !== adminPass) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, role: 'admin' },
    process.env.JWT_SECRET || 'secret',
    { expiresIn: '8h' }
  );

  res.json({ token, message: 'Login successful' });
});

// Get all registrations
router.get('/registrations', authMiddleware, async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName:  { $regex: search, $options: 'i' } },
        { email:     { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Registration.countDocuments(filter);
    const regs = await Registration.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ registrations: regs, total, page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single registration
router.get('/registrations/:id', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm/Approve registration
router.post('/registrations/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Not found' });

    // Generate QR code image
    const qrDir = path.join(__dirname, '..', 'qrcodes');
    fs.mkdirSync(qrDir, { recursive: true });
    const qrFilename = `qr-${reg.uniqueToken}.png`;
    const qrPath = path.join(qrDir, qrFilename);

    const qrData = JSON.stringify({
      id: reg._id.toString(),
      token: reg.uniqueToken,
      name: `${reg.firstName} ${reg.lastName}`,
    });

    await QRCode.toFile(qrPath, qrData, {
      color: { dark: '#1e1b4b', light: '#ffffff' },
      width: 300,
      margin: 2,
    });

    reg.status = 'confirmed';
    reg.qrCodePath = `/qrcodes/${qrFilename}`;
    await reg.save();

    sendConfirmationEmail(reg, qrPath).catch(e => console.error('Email error:', e));

    res.json({ message: 'Registration confirmed and email sent', qrCodePath: reg.qrCodePath });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reject registration
router.post('/registrations/:id/reject', authMiddleware, async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || !reason.trim()) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Not found' });

    reg.status = 'rejected';
    reg.rejectionReason = reason.trim();
    await reg.save();

    sendRejectionEmail(reg, reason).catch(e => console.error('Email error:', e));

    res.json({ message: 'Registration rejected and email sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Dashboard stats
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const [total, processing, confirmed, rejected, withKit, withoutKit, day1, day2] = await Promise.all([
      Registration.countDocuments(),
      Registration.countDocuments({ status: 'processing' }),
      Registration.countDocuments({ status: 'confirmed' }),
      Registration.countDocuments({ status: 'rejected' }),
      Registration.countDocuments({ kitOption: 'with-kit' }),
      Registration.countDocuments({ kitOption: 'without-kit' }),
      Registration.countDocuments({ attendedDay1: true }),
      Registration.countDocuments({ attendedDay2: true }),
    ]);
    res.json({ total, processing, confirmed, rejected, withKit, withoutKit, day1, day2 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
