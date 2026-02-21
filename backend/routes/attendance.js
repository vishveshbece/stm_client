const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const authMiddleware = require('../middleware/auth');

// Scan QR and mark attendance
router.post('/scan', authMiddleware, async (req, res) => {
  try {
    const { qrData, day } = req.body;

    if (!day || !['1', '2', 1, 2].includes(day)) {
      return res.status(400).json({ message: 'Invalid day. Must be 1 or 2.' });
    }

    let parsed;
    try {
      parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch {
      return res.status(400).json({ message: 'Invalid QR code format' });
    }

    const { id, token } = parsed;
    if (!id || !token) {
      return res.status(400).json({ message: 'Invalid QR code data' });
    }

    const reg = await Registration.findById(id);
    if (!reg) return res.status(404).json({ message: 'Registration not found' });
    if (reg.uniqueToken !== token) return res.status(400).json({ message: 'Invalid QR token' });
    if (reg.status !== 'confirmed') {
      return res.status(403).json({ message: `Registration is ${reg.status}. Only confirmed attendees can enter.` });
    }

    const dayField = `attendedDay${day}`;
    if (reg[dayField]) {
      return res.status(409).json({
        message: `${reg.firstName} ${reg.lastName} has already been marked present for Day ${day}.`,
        alreadyScanned: true,
        name: `${reg.firstName} ${reg.lastName}`,
      });
    }

    reg[dayField] = true;
    await reg.save();

    res.json({
      success: true,
      message: `✅ Welcome! ${reg.firstName} ${reg.lastName} marked present for Day ${day}.`,
      name: `${reg.firstName} ${reg.lastName}`,
      college: reg.college,
      kitOption: reg.kitOption,
      day,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
