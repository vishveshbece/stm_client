const express = require('express');
const router = express.Router();
const Registration = require('../models/Registration');
const { upload } = require('../middleware/upload');
const { sendProcessingEmail } = require('../services/emailService');

// Check duplicate transaction ID
router.get('/check-transaction/:txId', async (req, res) => {
  try {
    const existing = await Registration.findOne({ transactionId: req.params.txId });
    res.json({ exists: !!existing });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit registration with payment
router.post('/', (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(400).json({ message: err.message });

    try {
      const {
        firstName, lastName, email, mobile, college,
        specialization, course, kitOption, transactionId,
      } = req.body;

      if (!req.files?.resume?.[0])
        return res.status(400).json({ message: 'Resume is required' });
      if (!req.files?.paymentProof?.[0])
        return res.status(400).json({ message: 'Payment proof is required' });

      const dupTx = await Registration.findOne({ transactionId });
      if (dupTx)
        return res.status(409).json({ message: 'This Transaction ID is already used.' });

      const amount = kitOption === 'with-kit' ? 1200 : 699;

      const reg = new Registration({
        firstName, lastName, email, mobile, college,
        specialization, course, kitOption, amount, transactionId,
        status: 'processing',
        resume: {
          data: req.files.resume[0].buffer,
          contentType: req.files.resume[0].mimetype,
          filename: req.files.resume[0].originalname,
        },
        paymentProof: {
          data: req.files.paymentProof[0].buffer,
          contentType: req.files.paymentProof[0].mimetype,
          filename: req.files.paymentProof[0].originalname,
        },
      });

      await reg.save();
      sendProcessingEmail(reg).catch(e => console.error('Email error:', e));

      res.status(201).json({
        message: 'Registration submitted successfully. Your application is being processed.',
        id: reg._id,
      });
    } catch (err) {
      if (err.code === 11000)
        return res.status(409).json({ message: 'Transaction ID already used.' });
      res.status(500).json({ message: err.message });
    }
  });
});

module.exports = router;