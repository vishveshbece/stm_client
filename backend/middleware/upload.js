const multer = require('multer');
const path = require('path');

// Store in memory (buffer) instead of disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|pdf/;
  const ext = allowed.test(path.extname(file.originalname).toLowerCase());
  if (ext) cb(null, true);
  else cb(new Error('Only images (JPEG/PNG) and PDF allowed'));
};

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter,
}).fields([
  { name: 'resume', maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 },
]);

module.exports = { upload };