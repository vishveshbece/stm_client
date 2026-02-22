const multer = require('multer');
const path   = require('path');

// Store in memory (buffer) instead of disk
const storage = multer.memoryStorage();

/* ── Allowed MIME types (checked against the actual Content-Type
   header the browser sends, NOT just the file extension).
   This closes the gap where someone renames a .exe to .jpg.
   Note: multer receives the browser-reported MIME type, which
   can still be spoofed by a determined attacker — for strong
   security, add a magic-byte check (e.g. 'file-type' npm pkg)
   in the route handler after upload. ───────────────────────── */
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/jpg',   // some older browsers send this
  'image/png',
  'application/pdf',
]);

const ALLOWED_EXTENSIONS = /\.(jpeg|jpg|png|pdf)$/i;

const fileFilter = (req, file, cb) => {
  const extOk  = ALLOWED_EXTENSIONS.test(path.extname(file.originalname));
  const mimeOk = ALLOWED_MIME_TYPES.has(file.mimetype);

  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    // ── CHANGED: previous filter only checked extension.
    // Now we also validate the MIME type reported by the browser.
    cb(new Error('Only images (JPEG/PNG) and PDF allowed'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1 MB hard cap
  fileFilter,
}).fields([
  { name: 'resume',       maxCount: 1 },
  { name: 'paymentProof', maxCount: 1 },
]);

module.exports = { upload };