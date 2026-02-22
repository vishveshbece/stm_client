import qrGpay    from './assets/pack1.png';   // Google Pay QR  (Without Kit — ₹699)
import qrPhonePe from './assets/pack2.png';   // PhonePe QR     (With Kit   — ₹1200)

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ChevronRight, ChevronLeft, Upload, Check, Loader2,
  AlertTriangle, Cpu, CheckCircle2, XCircle, Info, Smartphone,
} from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

/* ─── UPI Configuration ──────────────────────────────────────── */
const UPI_ID_GPAY    = 'paulgracehannah@okaxis';
const UPI_ID_PHONEPE = '9840837564@ybl';

/* ─── File constraints ──────────────────────────────────────── */
const RESUME_MAX_BYTES    = 1 * 1024 * 1024;
const PROOF_MAX_BYTES     = 1 * 1024 * 1024;
const RESUME_ACCEPT       = ['application/pdf', 'image/jpeg', 'image/png'];
const RESUME_ACCEPT_LABEL = 'PDF, JPG or PNG';
const PROOF_ACCEPT        = ['image/jpeg', 'image/png'];
const PROOF_ACCEPT_LABEL  = 'JPG or PNG';

/* ─── Kit options ────────────────────────────────────────────── */
const KIT_OPTIONS = [
  {
    value:   'without-kit',
    label:   'Without Kit',
    price:   699,
    display: '₹699',
    desc:    'Workshop access only',
    qrImg:   qrGpay,
    qrLabel: 'Google Pay QR',
    upiId:   UPI_ID_GPAY,
    upiApp:  'Google Pay',
  },
  {
    value:   'with-kit',
    label:   'With Kit',
    price:   1200,
    display: '₹1200',
    desc:    'Board + peripherals',
    qrImg:   qrPhonePe,
    qrLabel: 'PhonePe QR',
    upiId:   UPI_ID_PHONEPE,
    upiApp:  'PhonePe',
  },
];

/* ─── Course / Year options ───────────────────────────────────── */
const DEGREE_OPTIONS = ['B.E.', 'B.Tech', 'M.E.', 'M.Tech', 'BCA', 'MCA', 'B.Sc', 'M.Sc', 'Diploma'];
const YEAR_OPTIONS   = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduated'];

/* ─── Client-side file validator ─────────────────────────────── */
function validateFile(file, allowedTypes, maxBytes, friendlyLabel) {
  if (!file) return null;
  if (!allowedTypes.includes(file.type))
    return `Invalid file type — only ${friendlyLabel} allowed. You selected: .${file.name.split('.').pop().toUpperCase()}`;
  if (file.size > maxBytes)
    return `File too large — max ${maxBytes / 1024 / 1024} MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)} MB`;
  return null;
}

/* ─── Server error → friendly copy ──────────────────────────── */
function friendlyServerError(msg = '') {
  const m = msg.toLowerCase();
  if (m.includes('file too large'))
    return 'One of your files exceeds the 1 MB size limit. Please compress or resize it and re-upload.';
  if (m.includes('only images') || m.includes('jpeg/png') || m.includes('pdf allowed'))
    return 'Unsupported file format. Resume accepts PDF, JPG, or PNG. Payment screenshot must be JPG or PNG.';
  if (m.includes('resume is required'))
    return 'Your resume was not received. Please go back to Step 1, re-upload your resume, and try again.';
  if (m.includes('payment proof is required'))
    return 'Your payment screenshot was not received. Please re-upload it and try again.';
  if (m.includes('transaction id already used') || m.includes('already registered'))
    return 'This Transaction ID is already linked to a registration. Double-check your UPI app history and enter the correct one.';
  if (m.includes('network') || m.includes('econnrefused') || m.includes('etimedout'))
    return 'Could not reach the server. Check your internet connection and try again.';
  if (msg) return msg;
  return 'Something went wrong on our end. Please try again in a moment.';
}

/* ─── Payment QR Panel ────────────────────────────────────────── */
function PaymentQRPanel({ kitOption }) {
  const opt = KIT_OPTIONS.find(o => o.value === kitOption);
  const [copied, setCopied] = React.useState(false);

  const copyUpiId = () => {
    navigator.clipboard.writeText(opt.upiId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const el = document.createElement('input');
      el.value = opt.upiId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">

      {/* ── How to pay instructions ── */}
      <div className="w-full glass border border-indigo-500/20 bg-indigo-950/10 rounded-xl p-4">
        <p className="font-display text-xs text-indigo-400 tracking-widest mb-3">HOW TO PAY</p>
        <div className="space-y-2">
          {[
            { n: '1', text: `Open ${opt.upiApp} on your phone` },
            { n: '2', text: 'Tap "Scan QR" and scan the code below' },
            { n: '3', text: `Manually enter the amount — ` },
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="font-mono text-xs text-indigo-500 flex-shrink-0 mt-0.5">{step.n}.</span>
              <p className="font-body text-xs text-slate-400">
                {step.text}
                {i === 2 && <span className="text-indigo-300 font-bold">{opt.display}</span>}
                {i === 2 && ' if not pre-filled'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── QR image ── */}
      <div className="w-56 h-56 bg-white rounded-2xl p-2 flex items-center justify-center shadow-xl overflow-hidden flex-shrink-0">
        <img
          src={opt.qrImg}
          alt={opt.qrLabel}
          className="w-full h-full object-contain rounded-xl"
        />
      </div>

      {/* ── Amount badge ── */}
      <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/40">
        <span className="font-display text-xs text-slate-400 tracking-widest">PAY EXACTLY</span>
        <span className="font-display text-xl font-black text-indigo-300">{opt.display}</span>
      </div>

      {/* ── Copy UPI ID (per-kit) ── */}
      <div className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-800/60 border border-slate-700">
        <div className="flex-1 min-w-0">
          <p className="font-body text-xs text-slate-500 mb-0.5">UPI ID ({opt.upiApp})</p>
          <p className="font-mono text-sm text-indigo-300 select-all truncate">{opt.upiId}</p>
        </div>
        <button
          type="button"
          onClick={copyUpiId}
          className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-display font-bold tracking-wide transition-all ${
            copied
              ? 'bg-green-500/20 border border-green-500/40 text-green-400'
              : 'bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/30'
          }`}
        >
          {copied ? <><CheckCircle2 size={13} /> COPIED!</> : <><Smartphone size={13} /> COPY</>}
        </button>
      </div>

      {/* ── Warning: amount may not pre-fill ── */}
      <div className="w-full flex items-start gap-2 px-3 py-2.5 rounded-lg bg-amber-950/20 border border-amber-500/20">
        <AlertTriangle size={13} className="text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="font-body text-xs text-amber-300/80">
          The amount may not pre-fill automatically — always confirm you're paying{' '}
          <strong className="text-amber-300">{opt.display}</strong> before approving.
        </p>
      </div>

    </div>
  );
}

/* ─── Reusable FileUploadZone ─────────────────────────────────── */
function FileUploadZone({ inputRef, file, fileError, accept, acceptLabel, maxMB, prompt, onChange, onRemove }) {
  const isOk    = file && !fileError;
  const isError = !!fileError;
  return (
    <div>
      <div
        onClick={() => !isOk && inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-5 transition-all
          ${isError  ? 'border-red-500/60 bg-red-950/10 cursor-pointer' :
            isOk     ? 'border-green-500/40 bg-green-950/10 cursor-default' :
                       'border-indigo-500/30 hover:border-indigo-500/60 hover:bg-indigo-950/20 cursor-pointer'}
        `}
      >
        {isOk ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={20} className="text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-green-300 font-medium truncate">{file.name}</p>
              <p className="font-mono text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB · ready to upload</p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); onRemove(); }}
              className="w-7 h-7 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center justify-center text-slate-400 hover:text-white transition-colors flex-shrink-0">
              <X size={13} />
            </button>
          </div>
        ) : isError ? (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <XCircle size={20} className="text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-body text-sm text-red-300 font-medium truncate">{file.name}</p>
              <p className="font-mono text-xs text-red-400/80">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
            <button type="button" onClick={e => { e.stopPropagation(); inputRef.current.click(); }}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-xs font-display font-bold text-red-300 tracking-wide hover:bg-red-500/30 transition-colors">
              REPLACE
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-1">
            <Upload size={20} className="text-indigo-400" />
            <p className="font-body text-sm text-slate-400">{prompt}</p>
            <p className="font-body text-xs text-slate-600">{acceptLabel} · max {maxMB} MB</p>
          </div>
        )}
        <input ref={inputRef} type="file" accept={accept} className="hidden" onChange={onChange} />
      </div>
      {isError && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
          className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/20">
          <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="font-body text-xs text-red-300">{fileError}</p>
        </motion.div>
      )}
    </div>
  );
}

/* ─── Styled Select ───────────────────────────────────────────── */
function StyledSelect({ value, onChange, options, placeholder, error }) {
  return (
    <select
      value={value} onChange={onChange}
      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm bg-slate-900 appearance-none cursor-pointer
        ${error ? 'border-red-500/60' : ''}
        ${!value ? 'text-slate-500' : 'text-white'}`}
    >
      <option value="" disabled hidden>{placeholder}</option>
      {options.map(opt => (
        <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
      ))}
    </select>
  );
}

/* ════════════════════════════════════════════════════════════════
   Main Component
════════════════════════════════════════════════════════════════ */
export default function RegistrationSection({ onClose }) {
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    college: '', specialization: '', degree: '', year: '',
  });
  const [errors, setErrors]   = useState({});
  const [kitOption, setKitOption] = useState('without-kit');

  const [resume, setResume]           = useState(null);
  const [resumeError, setResumeError] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [proofError, setProofError]   = useState('');

  const [transactionId, setTransactionId] = useState('');
  const [txError, setTxError]   = useState('');
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);
  const [submitError, setSubmitError] = useState('');

  const resumeRef = useRef();
  const proofRef  = useRef();

  const setField = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const handleResumeChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setResume(f);
    setResumeError(validateFile(f, RESUME_ACCEPT, RESUME_MAX_BYTES, RESUME_ACCEPT_LABEL) || '');
    setErrors(p => ({ ...p, resume: '' }));
  };

  const handleProofChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setPaymentProof(f);
    setProofError(validateFile(f, PROOF_ACCEPT, PROOF_MAX_BYTES, PROOF_ACCEPT_LABEL) || '');
    setSubmitError('');
  };

  const FIELD_META = {
    firstName: 'First Name', lastName: 'Last Name', email: 'Email',
    mobile: 'Mobile Number', college: 'College Name',
    specialization: 'Specialization', degree: 'Course / Degree', year: 'Year',
  };

  const validate1 = () => {
    const errs = {};
    Object.entries(FIELD_META).forEach(([key, label]) => {
      if (!form[key]?.trim()) errs[key] = `${label} is required`;
    });
    if (!resume)          errs.resume = 'Please upload your resume';
    else if (resumeError) errs.resume = resumeError;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const step1Complete =
    Object.keys(FIELD_META).every(k => form[k]?.trim()) &&
    resume &&
    !resumeError;

  const handleStep1 = () => { if (validate1()) setStep(2); };

  const checkTransactionId = async () => {
    if (!transactionId.trim()) {
      setTxError('Transaction ID is required — copy it from your UPI app');
      return false;
    }
    if (transactionId.trim().length < 6) {
      setTxError('This looks too short — UPI Transaction IDs are usually 15–20 characters');
      return false;
    }
    try {
      const r = await axios.get(`${API}/api/registrations/check-transaction/${transactionId.trim()}`);
      if (r.data.exists) {
        setTxError('This Transaction ID is already linked to a registration. Please verify you entered the correct ID.');
        return false;
      }
      setTxError('');
      return true;
    } catch {
      setTxError('Could not verify the Transaction ID right now. Check your connection and try again.');
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    let hasFileError = false;
    if (!paymentProof) { setProofError('Payment screenshot is required'); hasFileError = true; }
    else if (proofError) hasFileError = true;
    if (!resume) { setErrors(p => ({ ...p, resume: 'Resume is required' })); hasFileError = true; }
    else if (resumeError) hasFileError = true;
    if (hasFileError) {
      setSubmitError('Please fix the file issues highlighted above before submitting.');
      return;
    }
    const txOk = await checkTransactionId();
    if (!txOk) return;
    setLoading(true);
    try {
      const fd = new FormData();
      const courseValue = `${form.degree} – ${form.year}`;
      Object.entries(form).forEach(([k, v]) => {
        if (k !== 'degree' && k !== 'year') fd.append(k, v);
      });
      fd.append('course', courseValue);
      fd.append('kitOption', kitOption);
      fd.append('transactionId', transactionId.trim());
      fd.append('resume', resume);
      fd.append('paymentProof', paymentProof);
      await axios.post(`${API}/api/registrations`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err) {
      const raw = err.response?.data?.message || err.message || '';
      setSubmitError(friendlyServerError(raw));
    } finally {
      setLoading(false);
    }
  };

  const selectedKit = KIT_OPTIONS.find(o => o.value === kitOption);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 30 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass border-glow rounded-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 glass border-b border-indigo-500/20 px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
              <Cpu size={16} className="text-white" />
            </div>
            <div>
              <h2 className="font-display text-sm font-bold text-white tracking-wider">REGISTRATION</h2>
              <p className="font-body text-xs text-slate-500">STM32 Mastering Workshop</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* Step indicator */}
        {!success && (
          <div className="px-8 pt-6 pb-2 flex items-center gap-4">
            {['Details', 'Payment', 'Verify'].map((s, i) => (
              <React.Fragment key={s}>
                <div className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all ${
                    step > i + 1 ? 'bg-green-500 text-white' :
                    step === i + 1 ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white glow-indigo' :
                    'bg-slate-800 text-slate-500'
                  }`}>
                    {step > i + 1 ? <Check size={13} /> : i + 1}
                  </div>
                  <span className={`font-display text-xs tracking-wider ${step === i + 1 ? 'text-indigo-400' : 'text-slate-600'}`}>{s}</span>
                </div>
                {i < 2 && <div className={`flex-1 h-px ${step > i + 1 ? 'bg-green-500/50' : 'bg-slate-700'}`} />}
              </React.Fragment>
            ))}
          </div>
        )}

        <div className="px-8 pb-8 pt-4">
          <AnimatePresence mode="wait">

            {/* ── Success ── */}
            {success && (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-green-400" />
                </div>
                <h3 className="font-display text-xl font-black text-white mb-3 tracking-wider">REGISTRATION SUBMITTED!</h3>
                <p className="font-body text-slate-300 text-base mb-2">Thank you for registering!</p>
                <p className="font-body text-slate-400 text-sm mb-8 max-w-sm mx-auto">
                  Your application is being processed. You'll receive a confirmation email once your payment is verified.
                </p>
                <div className="glass border border-green-500/20 rounded-xl p-4 mb-6 text-left max-w-xs mx-auto">
                  <p className="font-mono text-xs text-green-400 tracking-widest mb-2">NEXT STEPS</p>
                  <p className="font-body text-xs text-slate-400">✓ Check your email for a processing confirmation</p>
                  <p className="font-body text-xs text-slate-400 mt-1">✓ Await approval & QR code for entry</p>
                  <p className="font-body text-xs text-slate-400 mt-1">✓ Arrive at CIT on March 5 by 9:00 AM</p>
                </div>
                <button onClick={onClose} className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white">
                  CLOSE
                </button>
              </motion.div>
            )}

            {/* ── Step 1: Details ── */}
            {!success && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PERSONAL DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">First Name <span className="text-indigo-400">*</span></label>
                    <input type="text" placeholder="John" value={form.firstName} onChange={e => setField('firstName', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.firstName ? 'border-red-500/60' : ''}`} />
                    {errors.firstName && <p className="font-body text-xs text-red-400 mt-1">{errors.firstName}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Last Name <span className="text-indigo-400">*</span></label>
                    <input type="text" placeholder="Doe" value={form.lastName} onChange={e => setField('lastName', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.lastName ? 'border-red-500/60' : ''}`} />
                    {errors.lastName && <p className="font-body text-xs text-red-400 mt-1">{errors.lastName}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Email <span className="text-indigo-400">*</span></label>
                    <input type="email" placeholder="john@example.com" value={form.email} onChange={e => setField('email', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.email ? 'border-red-500/60' : ''}`} />
                    {errors.email && <p className="font-body text-xs text-red-400 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Mobile Number <span className="text-indigo-400">*</span></label>
                    <input type="tel" placeholder="+91 9XXXXXXXXX" value={form.mobile} onChange={e => setField('mobile', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.mobile ? 'border-red-500/60' : ''}`} />
                    {errors.mobile && <p className="font-body text-xs text-red-400 mt-1">{errors.mobile}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">College Name <span className="text-indigo-400">*</span></label>
                    <input type="text" placeholder="Chennai Institute of Technology" value={form.college} onChange={e => setField('college', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.college ? 'border-red-500/60' : ''}`} />
                    {errors.college && <p className="font-body text-xs text-red-400 mt-1">{errors.college}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Specialization <span className="text-indigo-400">*</span></label>
                    <input type="text" placeholder="Electronics & Communication" value={form.specialization} onChange={e => setField('specialization', e.target.value)}
                      className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors.specialization ? 'border-red-500/60' : ''}`} />
                    {errors.specialization && <p className="font-body text-xs text-red-400 mt-1">{errors.specialization}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Course / Degree <span className="text-indigo-400">*</span></label>
                    <div className="relative">
                      <StyledSelect value={form.degree} onChange={e => setField('degree', e.target.value)}
                        options={DEGREE_OPTIONS} placeholder="Select degree…" error={errors.degree} />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronRight size={14} className="text-slate-500 rotate-90" />
                      </div>
                    </div>
                    {errors.degree && <p className="font-body text-xs text-red-400 mt-1">{errors.degree}</p>}
                  </div>

                  <div>
                    <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Year <span className="text-indigo-400">*</span></label>
                    <div className="relative">
                      <StyledSelect value={form.year} onChange={e => setField('year', e.target.value)}
                        options={YEAR_OPTIONS} placeholder="Select year…" error={errors.year} />
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <ChevronRight size={14} className="text-slate-500 rotate-90" />
                      </div>
                    </div>
                    {errors.year && <p className="font-body text-xs text-red-400 mt-1">{errors.year}</p>}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Resume <span className="text-indigo-400">*</span></label>
                  <FileUploadZone
                    inputRef={resumeRef} file={resume} fileError={resumeError || errors.resume}
                    accept=".pdf,.jpg,.jpeg,.png" acceptLabel={RESUME_ACCEPT_LABEL} maxMB={1}
                    prompt="Click to upload your resume" onChange={handleResumeChange}
                    onRemove={() => { setResume(null); setResumeError(''); resumeRef.current.value = ''; }}
                  />
                </div>

                {!step1Complete && (
                  <p className="font-body text-xs text-slate-500 text-center mb-3">
                    Fill all fields and upload your resume to continue
                  </p>
                )}

                <button
                  onClick={handleStep1}
                  disabled={!step1Complete}
                  title={!step1Complete ? 'Please fill all fields and upload your resume' : ''}
                  className={`w-full py-3 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 transition-all
                    ${step1Complete
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 glow-indigo hover:from-indigo-500 hover:to-violet-500 cursor-pointer'
                      : 'bg-slate-700 text-slate-400 cursor-not-allowed opacity-60'
                    }`}
                >
                  CONTINUE <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* ── Step 2: Payment ── */}
            {!success && step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PAYMENT DETAILS</h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {KIT_OPTIONS.map(opt => (
                    <button key={opt.value} onClick={() => setKitOption(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        kitOption === opt.value
                          ? 'border-indigo-500 bg-indigo-950/50 glow-indigo'
                          : 'border-slate-700 hover:border-indigo-500/40'
                      }`}>
                      <div className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center ${kitOption === opt.value ? 'border-indigo-400 bg-indigo-600' : 'border-slate-600'}`}>
                        {kitOption === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <p className="font-display text-xs font-bold text-white tracking-wide">{opt.label}</p>
                      <p className="font-display text-2xl font-black text-indigo-400 my-1">{opt.display}</p>
                      <p className="font-body text-xs text-slate-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="glass border-glow rounded-2xl p-6 mb-6">
                  <AnimatePresence mode="wait">
                    <motion.div key={kitOption}
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}>
                      <PaymentQRPanel kitOption={kitOption} />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <div className="glass border border-indigo-500/20 bg-indigo-950/10 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Info size={13} className="text-indigo-400" />
                    <p className="font-display text-xs text-indigo-400 tracking-widest">BEFORE YOU CONTINUE</p>
                  </div>
                  <div className="space-y-1.5">
                    {[
                      'Take a screenshot of the payment confirmation screen',
                      'Note the UPI Transaction ID (e.g. T25030312345678901)',
                      `Confirm you paid exactly ${selectedKit.display} matching your selection above`,
                    ].map((tip, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="font-mono text-xs text-indigo-500 flex-shrink-0">{i + 1}.</span>
                        <p className="font-body text-xs text-slate-400">{tip}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep(1)} className="px-5 py-3 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2 hover:border-slate-600 transition-colors">
                    <ChevronLeft size={16} /> BACK
                  </button>
                  <button onClick={() => setStep(3)} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 glow-indigo">
                    I'VE PAID <ChevronRight size={16} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* ── Step 3: Verification ── */}
            {!success && step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PAYMENT VERIFICATION</h3>

                <div className="glass border border-indigo-500/20 bg-indigo-950/10 rounded-xl p-3 mb-4 flex items-center gap-3">
                  <Info size={14} className="text-indigo-400 flex-shrink-0" />
                  <p className="font-body text-xs text-slate-400">
                    Selected: <span className="text-white font-medium">{selectedKit.label}</span>
                    {' · '}Amount paid: <span className="text-indigo-300 font-bold">{selectedKit.display}</span>
                  </p>
                </div>

                <div className="glass border border-amber-500/20 bg-amber-950/10 rounded-xl p-4 mb-6 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-amber-300">
                    Enter the exact UPI Transaction ID from your payment app. Each Transaction ID can only be used once.
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">
                    UPI Transaction ID <span className="text-indigo-400">*</span>
                  </label>
                  <input type="text" placeholder="e.g. T25030312345678901" value={transactionId}
                    onChange={e => { setTransactionId(e.target.value); setTxError(''); }}
                    className={`form-input w-full rounded-lg px-4 py-2.5 font-mono text-sm tracking-widest ${txError ? 'border-red-500/60' : ''}`}
                  />
                  {txError && (
                    <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                      className="mt-2 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-950/30 border border-red-500/20">
                      <AlertTriangle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="font-body text-xs text-red-300">{txError}</p>
                    </motion.div>
                  )}
                  <p className="font-body text-xs text-slate-600 mt-1.5">
                    Find this in Google Pay / PhonePe / Paytm → Transaction History → tap the payment
                  </p>
                </div>

                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">
                    Payment Screenshot <span className="text-indigo-400">*</span>
                  </label>
                  <FileUploadZone
                    inputRef={proofRef} file={paymentProof} fileError={proofError}
                    accept=".jpg,.jpeg,.png" acceptLabel={PROOF_ACCEPT_LABEL} maxMB={1}
                    prompt="Upload payment screenshot" onChange={handleProofChange}
                    onRemove={() => { setPaymentProof(null); setProofError(''); proofRef.current.value = ''; }}
                  />
                  <p className="font-body text-xs text-slate-600 mt-1.5">
                    Must clearly show the transaction ID, amount paid, and ✓ success status
                  </p>
                </div>

                {submitError && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="glass border border-red-500/30 bg-red-950/15 rounded-xl p-4 mb-5 flex gap-3">
                    <XCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-display text-xs text-red-400 tracking-widest mb-1">SUBMISSION FAILED</p>
                      <p className="font-body text-xs text-red-300">{submitError}</p>
                    </div>
                  </motion.div>
                )}

                {!paymentProof && !proofError && (
                  <p className="font-body text-xs text-slate-500 text-center mb-3">
                    Upload your payment screenshot to enable submission
                  </p>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} disabled={loading}
                    className="px-5 py-3 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2 hover:border-slate-600 transition-colors disabled:opacity-50">
                    <ChevronLeft size={16} /> BACK
                  </button>
                  <button onClick={handleSubmit} disabled={loading || !paymentProof || !!resumeError || !!proofError}
                    className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 glow-indigo disabled:opacity-60 disabled:cursor-not-allowed transition-all">
                    {loading
                      ? <><Loader2 size={16} className="animate-spin" /> SUBMITTING...</>
                      : <>SUBMIT REGISTRATION <ChevronRight size={16} /></>
                    }
                  </button>
                </div>

                {(resumeError || proofError) && !loading && (
                  <p className="font-body text-xs text-slate-500 text-center mt-3">
                    Fix the file issues highlighted above to enable submission
                  </p>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}