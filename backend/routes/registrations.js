const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Registration = require('../models/Registration');
const { uploadResume, uploadPayment } = require('../middleware/upload');
const { sendProcessingEmail } = require('../services/emailService');

// Combined upload: resume + paymentProof
const uploadFields = multer({
  storage: require('../middleware/upload').uploadResume.storage,
  limits: { fileSize: 1 * 1024 * 1024 },
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 },
]);

// Dedicated multer instances
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const dir = path.join(__dirname, '..', 'uploads', 'resumes');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-resume' + path.extname(file.originalname));
  },
});
const paymentStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const fs = require('fs');
    const dir = path.join(__dirname, '..', 'uploads', 'payments');
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-payment' + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const fs = require('fs');
      const folder = file.fieldname === 'resume' ? 'resumes' : 'payments';
      const dir = path.join(__dirname, '..', 'uploads', folder);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const suffix = file.fieldname === 'resume' ? '-resume' : '-payment';
      cb(null, Date.now() + suffix + path.extname(file.originalname));
    },
  }),
  limits: { fileSize: 1 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'resume') {
      const ok = /jpeg|jpg|png|pdf/.test(path.extname(file.originalname).toLowerCase());
      ok ? cb(null, true) : cb(new Error('Resume must be PDF or image'));
    } else {
      const ok = /jpeg|jpg|png/.test(path.extname(file.originalname).toLowerCase());
      ok ? cb(null, true) : cb(new Error('Payment proof must be an image'));
    }
  },
}).fields([{ name: 'resume', maxCount: 1 }, { name: 'paymentProof', maxCount: 1 }]);

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
    if (err) {
      return res.status(400).json({ message: err.message || 'File upload error' });
    }

    try {
      const {
        firstName, lastName, email, mobile, college,
        specialization, course, kitOption, transactionId,
      } = req.body;

      // Validate required fields
      if (!firstName || !lastName || !email || !mobile || !college || !specialization || !course || !kitOption || !transactionId) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check duplicate transaction ID
      const dupTx = await Registration.findOne({ transactionId });
      if (dupTx) {
        return res.status(409).json({ message: 'This Transaction ID has already been used. Please check and try again.' });
      }

      const resumePath = req.files?.resume?.[0]
        ? `/uploads/resumes/${req.files.resume[0].filename}` : null;
      const paymentProofPath = req.files?.paymentProof?.[0]
        ? `/uploads/payments/${req.files.paymentProof[0].filename}` : null;

      if (!resumePath) return res.status(400).json({ message: 'Resume is required' });
      if (!paymentProofPath) return res.status(400).json({ message: 'Payment proof is required' });

      const amount = kitOption === 'with-kit' ? 1200 : 699;

      const reg = new Registration({
        firstName, lastName, email, mobile, college,
        specialization, course, kitOption, amount,
        transactionId, resumePath, paymentProofPath,
        status: 'processing',
      });

      await reg.save();

      // Send processing email (don't block response)
      sendProcessingEmail(reg).catch(e => console.error('Email error:', e));

      res.status(201).json({
        message: 'Registration submitted successfully. Your application is being processed.',
        id: reg._id,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: 'This Transaction ID has already been used.' });
      }
      res.status(500).json({ message: err.message });
    }
  });
});

module.exports = router;
