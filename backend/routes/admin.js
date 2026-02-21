const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
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
        { firstName:     { $regex: search, $options: 'i' } },
        { lastName:      { $regex: search, $options: 'i' } },
        { email:         { $regex: search, $options: 'i' } },
        { transactionId: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Registration.countDocuments(filter);
    const regs = await Registration.find(filter)
      .select('-resume.data -paymentProof.data -qrCode.data') // ← exclude binary data from list
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
    const reg = await Registration.findById(req.params.id)
      .select('-resume.data -paymentProof.data -qrCode.data'); // ← exclude binary data
    if (!reg) return res.status(404).json({ message: 'Not found' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Confirm registration
router.post('/registrations/:id/confirm', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id);
    if (!reg) return res.status(404).json({ message: 'Not found' });

    const qrData = JSON.stringify({
      id: reg._id.toString(),
      token: reg.uniqueToken,
      name: `${reg.firstName} ${reg.lastName}`,
    });

    const qrBuffer = await QRCode.toBuffer(qrData, {
      color: { dark: '#1e1b4b', light: '#ffffff' },
      width: 300,
      margin: 2,
    });

    reg.status = 'confirmed';
    reg.qrCode = {
      data: qrBuffer,
      contentType: 'image/png',
    };
    await reg.save();

    sendConfirmationEmail(reg, qrBuffer).catch(e => console.error('Email error:', e));

    res.json({ message: 'Registration confirmed and email sent' });
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

// Serve resume
router.get('/registrations/:id/resume', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).select('resume');
    if (!reg?.resume?.data)
      return res.status(404).json({ message: 'File not found' });
    res.set('Content-Type', reg.resume.contentType);
    res.set('Content-Disposition', `inline; filename="${reg.resume.filename}"`);
    res.send(Buffer.from(reg.resume.data)); // ← Buffer.from() fix
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve payment proof
router.get('/registrations/:id/payment-proof', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).select('paymentProof');
    if (!reg?.paymentProof?.data)
      return res.status(404).json({ message: 'File not found' });
    res.set('Content-Type', reg.paymentProof.contentType);
    res.set('Content-Disposition', `inline; filename="payment-proof"`);
    res.send(Buffer.from(reg.paymentProof.data)); // ← Buffer.from() fix
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Serve QR code
router.get('/registrations/:id/qrcode', authMiddleware, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.id).select('qrCode');
    if (!reg?.qrCode?.data)
      return res.status(404).json({ message: 'QR code not found' });
    res.set('Content-Type', 'image/png');
    res.send(Buffer.from(reg.qrCode.data)); // ← Buffer.from() fix
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;