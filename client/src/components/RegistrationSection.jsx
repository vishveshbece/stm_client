import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Upload, Check, Loader2, AlertTriangle, QrCode, Cpu } from 'lucide-react';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Simple QR code SVG placeholder (static PaymentQR)
function PaymentQR() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-48 h-48 bg-white rounded-xl p-3 flex items-center justify-center relative overflow-hidden">
        {/* Placeholder QR pattern */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <rect width="100" height="100" fill="white"/>
          {/* QR corner squares */}
          <rect x="5" y="5" width="25" height="25" rx="2" fill="#1e1b4b"/>
          <rect x="8" y="8" width="19" height="19" rx="1" fill="white"/>
          <rect x="11" y="11" width="13" height="13" rx="1" fill="#1e1b4b"/>
          
          <rect x="70" y="5" width="25" height="25" rx="2" fill="#1e1b4b"/>
          <rect x="73" y="8" width="19" height="19" rx="1" fill="white"/>
          <rect x="76" y="11" width="13" height="13" rx="1" fill="#1e1b4b"/>
          
          <rect x="5" y="70" width="25" height="25" rx="2" fill="#1e1b4b"/>
          <rect x="8" y="73" width="19" height="19" rx="1" fill="white"/>
          <rect x="11" y="76" width="13" height="13" rx="1" fill="#1e1b4b"/>

          {/* Data modules */}
          {[35,40,45,50,55,60].map(x => 
            [10,15,20,25,30,35,40,45].map(y => 
              (x+y) % 13 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1e1b4b"/> : null
            )
          )}
          {[10,15,20,25,30].map(x => 
            [50,55,60,65,70,75,80,85].map(y => 
              (x*y) % 7 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1e1b4b"/> : null
            )
          )}
          {[50,55,60,65,70,75,80].map(x => 
            [50,55,60,65,70,75,80,85].map(y => 
              (x+y*2) % 11 !== 0 ? <rect key={`${x}-${y}`} x={x} y={y} width="4" height="4" fill="#1e1b4b"/> : null
            )
          )}
        </svg>
      </div>
      <div className="text-center">
        <p className="font-display text-xs font-bold text-indigo-400 tracking-widest">SCAN TO PAY</p>
        <p className="font-body text-xs text-slate-500 mt-1">UPI · Google Pay · PhonePe · Paytm</p>
        <p className="font-mono text-xs text-slate-400 mt-1">workshop@upi.handle</p>
      </div>
    </div>
  );
}

const FIELDS = {
  firstName:      { label: 'First Name',      type: 'text',  placeholder: 'John' },
  lastName:       { label: 'Last Name',       type: 'text',  placeholder: 'Doe' },
  email:          { label: 'Email',           type: 'email', placeholder: 'john@example.com' },
  mobile:         { label: 'Mobile Number',   type: 'tel',   placeholder: '+91 9XXXXXXXXX' },
  college:        { label: 'College Name',    type: 'text',  placeholder: 'Chennai Institute of Technology' },
  specialization: { label: 'Specialization',  type: 'text',  placeholder: 'Electronics & Communication' },
  course:         { label: 'Course / Year',   type: 'text',  placeholder: 'B.E. – 3rd Year' },
};

export default function RegistrationSection({ onClose }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', mobile: '',
    college: '', specialization: '', course: '',
  });
  const [errors, setErrors] = useState({});
  const [kitOption, setKitOption] = useState('without-kit');
  const [resume, setResume] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [txError, setTxError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const resumeRef = useRef();
  const proofRef = useRef();

  const validate1 = () => {
    const errs = {};
    Object.entries(FIELDS).forEach(([key, f]) => {
      if (!form[key]?.trim()) errs[key] = `${f.label} is required`;
    });
    if (!resume) errs.resume = 'Resume is required';
    else if (resume.size > 1048576) errs.resume = 'Resume must be under 1MB';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleStep1 = () => { if (validate1()) setStep(2); };

  const checkTransactionId = async () => {
    if (!transactionId.trim()) { setTxError('Transaction ID is required'); return false; }
    try {
      const r = await axios.get(`${API}/api/registrations/check-transaction/${transactionId.trim()}`);
      if (r.data.exists) { setTxError('This Transaction ID is already registered. Please verify.'); return false; }
      setTxError('');
      return true;
    } catch { setTxError('Could not verify transaction. Try again.'); return false; }
  };

  const handleSubmit = async () => {
    setSubmitError('');
    if (!paymentProof) { setSubmitError('Payment proof image is required'); return; }
    if (paymentProof.size > 1048576) { setSubmitError('Payment proof must be under 1MB'); return; }

    const valid = await checkTransactionId();
    if (!valid) return;

    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('kitOption', kitOption);
      fd.append('transactionId', transactionId.trim());
      fd.append('resume', resume);
      fd.append('paymentProof', paymentProof);

      await axios.post(`${API}/api/registrations`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
    } catch (err) {
      setSubmitError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
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
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
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
            {/* Success */}
            {success && (
              <motion.div key="success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="py-12 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center mx-auto mb-6">
                  <Check size={36} className="text-green-400" />
                </div>
                <h3 className="font-display text-xl font-black text-white mb-3 tracking-wider">REGISTRATION SUBMITTED!</h3>
                <p className="font-body text-slate-300 text-base mb-2">
                  Thank you for registering!
                </p>
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

            {/* Step 1: Details */}
            {!success && step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PERSONAL DETAILS</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  {Object.entries(FIELDS).map(([key, f]) => (
                    <div key={key} className={key === 'college' ? 'sm:col-span-2' : ''}>
                      <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">{f.label} <span className="text-indigo-400">*</span></label>
                      <input
                        type={f.type}
                        placeholder={f.placeholder}
                        value={form[key]}
                        onChange={e => { setForm(p => ({ ...p, [key]: e.target.value })); setErrors(p => ({ ...p, [key]: '' })); }}
                        className={`form-input w-full rounded-lg px-4 py-2.5 text-sm ${errors[key] ? 'border-red-500/60' : ''}`}
                      />
                      {errors[key] && <p className="font-body text-xs text-red-400 mt-1">{errors[key]}</p>}
                    </div>
                  ))}
                </div>

                {/* Resume upload */}
                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Resume <span className="text-indigo-400">*</span> <span className="text-slate-600">(PDF/Image, max 1MB)</span></label>
                  <div
                    onClick={() => resumeRef.current.click()}
                    className={`border-2 border-dashed ${errors.resume ? 'border-red-500/50' : 'border-indigo-500/30'} rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-500/60 hover:bg-indigo-950/20 transition-all`}
                  >
                    <Upload size={20} className="text-indigo-400" />
                    {resume ? (
                      <div className="text-center">
                        <p className="font-body text-sm text-indigo-300 font-medium">{resume.name}</p>
                        <p className="font-mono text-xs text-slate-500">{(resume.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <p className="font-body text-sm text-slate-500">Click to upload resume</p>
                    )}
                    <input ref={resumeRef} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={e => { setResume(e.target.files[0]); setErrors(p => ({ ...p, resume: '' })); }} />
                  </div>
                  {errors.resume && <p className="font-body text-xs text-red-400 mt-1">{errors.resume}</p>}
                </div>

                <button onClick={handleStep1} className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 glow-indigo hover:from-indigo-500 hover:to-violet-500 transition-all">
                  CONTINUE <ChevronRight size={16} />
                </button>
              </motion.div>
            )}

            {/* Step 2: Payment */}
            {!success && step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PAYMENT DETAILS</h3>

                {/* Kit selection */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { value: 'without-kit', label: 'Without Kit', price: '₹699', desc: 'Workshop access only' },
                    { value: 'with-kit',    label: 'With Kit',    price: '₹1200', desc: 'Board + peripherals' },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setKitOption(opt.value)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        kitOption === opt.value
                          ? 'border-indigo-500 bg-indigo-950/50 glow-indigo'
                          : 'border-slate-700 hover:border-indigo-500/40'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 mb-3 flex items-center justify-center ${kitOption === opt.value ? 'border-indigo-400 bg-indigo-600' : 'border-slate-600'}`}>
                        {kitOption === opt.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <p className="font-display text-xs font-bold text-white tracking-wide">{opt.label}</p>
                      <p className="font-display text-2xl font-black text-indigo-400 my-1">{opt.price}</p>
                      <p className="font-body text-xs text-slate-500">{opt.desc}</p>
                    </button>
                  ))}
                </div>

                {/* QR code */}
                <div className="glass border-glow rounded-2xl p-6 flex flex-col items-center mb-6">
                  <p className="font-display text-xs text-slate-400 tracking-widest mb-4">PAY EXACTLY <span className="text-indigo-400 font-black text-lg">{kitOption === 'with-kit' ? '₹1200' : '₹699'}</span></p>
                  <PaymentQR />
                  <p className="font-body text-xs text-slate-500 mt-4 text-center max-w-xs">
                    Scan the QR code to complete payment. Save the transaction ID and screenshot after payment.
                  </p>
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

            {/* Step 3: Verification */}
            {!success && step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h3 className="font-display text-xs text-slate-400 tracking-widest mb-6 pt-2">PAYMENT VERIFICATION</h3>

                <div className="glass border border-amber-500/20 bg-amber-950/10 rounded-xl p-4 mb-6 flex gap-3">
                  <AlertTriangle size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="font-body text-xs text-amber-300">
                    Enter the exact UPI Transaction ID from your payment. Each Transaction ID can only be used once.
                  </p>
                </div>

                {/* Transaction ID */}
                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">UPI Transaction ID <span className="text-indigo-400">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. T25030312345678901"
                    value={transactionId}
                    onChange={e => { setTransactionId(e.target.value); setTxError(''); }}
                    className={`form-input w-full rounded-lg px-4 py-2.5 font-mono text-sm tracking-widest ${txError ? 'border-red-500/60' : ''}`}
                  />
                  {txError && <p className="font-body text-xs text-red-400 mt-1">{txError}</p>}
                </div>

                {/* Payment proof upload */}
                <div className="mb-6">
                  <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Payment Screenshot <span className="text-indigo-400">*</span> <span className="text-slate-600">(max 1MB)</span></label>
                  <div
                    onClick={() => proofRef.current.click()}
                    className="border-2 border-dashed border-indigo-500/30 rounded-xl p-6 flex flex-col items-center gap-2 cursor-pointer hover:border-indigo-500/60 hover:bg-indigo-950/20 transition-all"
                  >
                    {paymentProof ? (
                      <div className="text-center">
                        <QrCode size={20} className="text-green-400 mx-auto mb-2" />
                        <p className="font-body text-sm text-green-300 font-medium">{paymentProof.name}</p>
                        <p className="font-mono text-xs text-slate-500">{(paymentProof.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ) : (
                      <>
                        <Upload size={20} className="text-indigo-400" />
                        <p className="font-body text-sm text-slate-500">Upload payment screenshot</p>
                        <p className="font-body text-xs text-slate-600">JPEG or PNG</p>
                      </>
                    )}
                    <input ref={proofRef} type="file" accept=".jpg,.jpeg,.png" className="hidden" onChange={e => setPaymentProof(e.target.files[0])} />
                  </div>
                </div>

                {submitError && (
                  <div className="glass border border-red-500/20 bg-red-950/10 rounded-xl p-4 mb-4 flex gap-3">
                    <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="font-body text-xs text-red-300">{submitError}</p>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} disabled={loading} className="px-5 py-3 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-widest text-slate-400 flex items-center gap-2 hover:border-slate-600 transition-colors disabled:opacity-50">
                    <ChevronLeft size={16} /> BACK
                  </button>
                  <button onClick={handleSubmit} disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 glow-indigo disabled:opacity-70">
                    {loading ? <><Loader2 size={16} className="animate-spin" /> SUBMITTING...</> : <>SUBMIT REGISTRATION <ChevronRight size={16} /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
