import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { QrCode, Check, AlertTriangle, X, Camera, Loader2, Calendar } from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export default function AttendanceScanner() {
  const [day, setDay] = useState('1');
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  const stopScanner = async () => {
    if (html5QrRef.current) {
      try { await html5QrRef.current.stop(); } catch {}
      html5QrRef.current = null;
    }
    setScanning(false);
  };

  const startScanner = async () => {
    setResult(null);
    setError('');
    setScanning(true);

    // Dynamically import html5-qrcode
    const { Html5Qrcode } = await import('html5-qrcode');
    const qr = new Html5Qrcode('qr-scanner-div');
    html5QrRef.current = qr;

    try {
      await qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        async (decodedText) => {
          // On success scan
          await stopScanner();
          await processQR(decodedText);
        },
        () => {} // ignore errors
      );
    } catch (err) {
      setError('Camera access denied or not available. Please check permissions.');
      setScanning(false);
    }
  };

  const processQR = async (qrData) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post(`${API}/api/attendance/scan`, {
        qrData,
        day: parseInt(day),
      });
      setResult({ type: 'success', ...data });
    } catch (err) {
      const msg = err.response?.data?.message || 'Scan failed';
      const alreadyScanned = err.response?.data?.alreadyScanned;
      setResult({
        type: alreadyScanned ? 'duplicate' : 'error',
        message: msg,
        name: err.response?.data?.name,
      });
    } finally {
      setLoading(false);
    }
  };

  // Manual entry for testing
  const [manualInput, setManualInput] = useState('');
  const handleManual = async () => {
    if (!manualInput.trim()) return;
    await processQR(manualInput.trim());
    setManualInput('');
  };

  useEffect(() => {
    return () => { stopScanner(); };
  }, []);

  return (
    <div className="max-w-xl mx-auto">
      <div className="glass rounded-2xl border border-indigo-500/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-950 to-violet-950 px-6 py-5 border-b border-indigo-500/20">
          <div className="flex items-center gap-3 mb-1">
            <QrCode size={18} className="text-indigo-400" />
            <h2 className="font-display text-sm font-bold text-white tracking-wider">ATTENDANCE SCANNER</h2>
          </div>
          <p className="font-body text-xs text-slate-500">Scan participant QR codes to mark attendance</p>
        </div>

        <div className="p-6">
          {/* Day selector */}
          <div className="mb-6">
            <label className="block font-mono text-xs text-slate-500 tracking-widest mb-3">SELECT DAY</label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { value: '1', label: 'Day 1', date: 'March 5, 2025' },
                { value: '2', label: 'Day 2', date: 'March 6, 2025' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setDay(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    day === opt.value
                      ? 'border-indigo-500 bg-indigo-950/50'
                      : 'border-slate-700 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={14} className={day === opt.value ? 'text-indigo-400' : 'text-slate-600'} />
                    <span className={`font-display text-xs font-bold tracking-wider ${day === opt.value ? 'text-white' : 'text-slate-500'}`}>{opt.label}</span>
                  </div>
                  <p className="font-body text-xs text-slate-500">{opt.date}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Scanner area */}
          <div className="mb-6">
            <div
              id="qr-scanner-div"
              className="rounded-xl overflow-hidden bg-black min-h-[250px] flex items-center justify-center relative"
              style={{ display: scanning ? 'block' : 'none' }}
            />
            {!scanning && (
              <div className="rounded-xl bg-slate-900/60 border border-slate-800 min-h-[250px] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                  }}
                />
                <QrCode size={48} className="text-slate-700" />
                <p className="font-body text-sm text-slate-500">Camera preview will appear here</p>
              </div>
            )}
          </div>

          {/* Scan button */}
          {!scanning ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={startScanner}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-bold tracking-widest text-white flex items-center justify-center gap-2 mb-4"
              style={{ boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
            >
              <Camera size={16} /> START SCANNING – DAY {day}
            </motion.button>
          ) : (
            <button
              onClick={stopScanner}
              className="w-full py-3 rounded-xl border-2 border-red-500/40 font-display text-xs font-bold tracking-widest text-red-400 flex items-center justify-center gap-2 mb-4 hover:bg-red-950/20 transition-colors"
            >
              <X size={14} /> STOP SCANNER
            </button>
          )}

          {/* Manual QR input */}
          <div className="border-t border-slate-800 pt-4">
            <p className="font-mono text-xs text-slate-600 tracking-widest mb-3">MANUAL QR DATA INPUT</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualInput}
                onChange={e => setManualInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleManual()}
                placeholder='Paste QR JSON data here...'
                className="admin-input flex-1"
              />
              <button
                onClick={handleManual}
                disabled={loading || !manualInput.trim()}
                className="px-4 py-2 rounded-xl bg-indigo-950 border border-indigo-500/40 font-display text-xs font-bold tracking-wider text-indigo-400 hover:bg-indigo-950/80 transition-colors disabled:opacity-50 whitespace-nowrap"
              >
                SUBMIT
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            className="mt-4 glass rounded-2xl p-6 border border-indigo-500/20 flex items-center gap-4">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
            <p className="font-body text-slate-300">Processing scan...</p>
          </motion.div>
        )}

        {!loading && result && (
          <motion.div initial={{ opacity:0,y:10,scale:0.95 }} animate={{ opacity:1,y:0,scale:1 }} exit={{ opacity:0 }}
            className={`mt-4 glass rounded-2xl p-6 border ${
              result.type === 'success' ? 'border-green-500/40' :
              result.type === 'duplicate' ? 'border-amber-500/40' : 'border-red-500/40'
            }`}
            style={{
              boxShadow: result.type === 'success' ? '0 0 30px rgba(34,197,94,0.15)' :
                result.type === 'duplicate' ? '0 0 30px rgba(245,158,11,0.15)' : '0 0 30px rgba(239,68,68,0.15)'
            }}
          >
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                result.type === 'success' ? 'bg-green-500/20' :
                result.type === 'duplicate' ? 'bg-amber-500/20' : 'bg-red-500/20'
              }`}>
                {result.type === 'success' && <Check size={24} className="text-green-400" />}
                {result.type === 'duplicate' && <AlertTriangle size={24} className="text-amber-400" />}
                {result.type === 'error' && <X size={24} className="text-red-400" />}
              </div>
              <div>
                <p className={`font-display text-sm font-bold tracking-wider mb-1 ${
                  result.type === 'success' ? 'text-green-400' :
                  result.type === 'duplicate' ? 'text-amber-400' : 'text-red-400'
                }`}>
                  {result.type === 'success' ? 'ATTENDANCE MARKED' :
                  result.type === 'duplicate' ? 'ALREADY SCANNED' : 'SCAN FAILED'}
                </p>
                <p className="font-body text-slate-300 text-sm">{result.message}</p>
                {result.type === 'success' && (
                  <div className="mt-3 space-y-1">
                    <p className="font-body text-xs text-slate-500">College: <span className="text-slate-300">{result.college}</span></p>
                    <p className="font-body text-xs text-slate-500">Package: <span className="text-slate-300">{result.kitOption === 'with-kit' ? 'With Kit' : 'Without Kit'}</span></p>
                    <p className="font-body text-xs text-slate-500">Day: <span className="text-indigo-300 font-bold">{result.day}</span></p>
                  </div>
                )}
              </div>
            </div>
            <button onClick={() => setResult(null)} className="mt-4 w-full py-2 rounded-lg border border-slate-700 font-display text-xs font-bold tracking-widest text-slate-500 hover:text-slate-300 transition-colors">
              SCAN NEXT
            </button>
          </motion.div>
        )}

        {!loading && error && (
          <motion.div initial={{ opacity:0,y:10 }} animate={{ opacity:1,y:0 }} exit={{ opacity:0 }}
            className="mt-4 glass rounded-2xl p-4 border border-red-500/30 flex items-center gap-3">
            <AlertTriangle size={16} className="text-red-400" />
            <p className="font-body text-sm text-red-300">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
