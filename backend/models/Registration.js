const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const registrationSchema = new mongoose.Schema({
  // Personal Details
  firstName: { type: String, required: true, trim: true },
  lastName:  { type: String, required: true, trim: true },
  email:     { type: String, required: true, trim: true, lowercase: true },
  mobile:    { type: String, required: true, trim: true },
  college:   { type: String, required: true, trim: true },
  specialization: { type: String, required: true, trim: true },
  course:    { type: String, required: true, trim: true },

  // Files
  resume: {
    data: Buffer,
    contentType: String,
    filename: String,
  },
  paymentProof: {
    data: Buffer,
    contentType: String,
    filename: String,
  },
  qrCode: {
    data: Buffer,
    contentType: String,
  },
  // Payment
  kitOption:     { type: String, enum: ['with-kit', 'without-kit'], required: true },
  amount:        { type: Number, required: true },
  transactionId: { type: String, unique: true, sparse: true },

  // Status
  status: {
    type: String,
    enum: ['processing', 'confirmed', 'rejected'],
    default: 'processing',
  },
  rejectionReason: { type: String },

  // QR Code
  uniqueToken: { type: String, default: () => uuidv4() },

  // Attendance
  attendedDay1: { type: Boolean, default: false },
  attendedDay2: { type: Boolean, default: false },

}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);
