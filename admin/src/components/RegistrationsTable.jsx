import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import {
  Search, Check, X, Eye, ExternalLink, ChevronDown,
  Loader2, AlertTriangle, FileText, Image, QrCode
} from 'lucide-react';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const STATUS_STYLES = {
  processing: 'bg-amber-950/40 border-amber-500/40 text-amber-400',
  confirmed:  'bg-green-950/40 border-green-500/40 text-green-400',
  rejected:   'bg-red-950/40 border-red-500/40 text-red-400',
};

function Badge({ status }) {
  return (
    <span className={`font-mono text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider ${STATUS_STYLES[status] || STATUS_STYLES.processing}`}>
      {status}
    </span>
  );
}

function ConfirmModal({ reg, onClose, onDone }) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const confirm = async () => {
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin/registrations/${reg._id}/confirm`);
      onDone();
    } catch (e) { setErr(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }}
        className="relative glass rounded-2xl p-6 max-w-sm w-full border border-green-500/30"
        style={{ boxShadow:'0 0 40px rgba(34,197,94,0.15)' }}
      >
        <h3 className="font-display text-sm font-bold text-white tracking-wider mb-2">CONFIRM REGISTRATION</h3>
        <p className="font-body text-sm text-slate-400 mb-1">
          Confirm <strong className="text-white">{reg.firstName} {reg.lastName}</strong>?
        </p>
        <p className="font-body text-xs text-slate-500 mb-6">
          A confirmation email with unique QR code will be sent to <span className="text-indigo-400">{reg.email}</span>.
        </p>
        {err && <p className="text-red-400 font-body text-xs mb-4">{err}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-wider text-slate-400">CANCEL</button>
          <button onClick={confirm} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 font-display text-xs font-bold tracking-wider text-white flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
            CONFIRM
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function RejectModal({ reg, onClose, onDone }) {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const reject = async () => {
    if (!reason.trim()) { setErr('Please provide a rejection reason.'); return; }
    setLoading(true);
    try {
      await axios.post(`${API}/api/admin/registrations/${reg._id}/reject`, { reason });
      onDone();
    } catch (e) { setErr(e.response?.data?.message || 'Error'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity:0,scale:0.9 }} animate={{ opacity:1,scale:1 }}
        className="relative glass rounded-2xl p-6 max-w-sm w-full border border-red-500/30"
        style={{ boxShadow:'0 0 40px rgba(239,68,68,0.15)' }}
      >
        <h3 className="font-display text-sm font-bold text-white tracking-wider mb-2">REJECT REGISTRATION</h3>
        <p className="font-body text-sm text-slate-400 mb-4">
          Rejecting <strong className="text-white">{reg.firstName} {reg.lastName}</strong>.
          A rejection email with your reason will be sent.
        </p>
        <label className="block font-body text-xs text-slate-400 mb-1.5">Reason for rejection <span className="text-red-400">*</span></label>
        <textarea
          value={reason}
          onChange={e => { setReason(e.target.value); setErr(''); }}
          placeholder="e.g. Invalid payment screenshot provided..."
          rows={3}
          className="admin-input resize-none mb-4"
        />
        {err && <p className="text-red-400 font-body text-xs mb-3">{err}</p>}
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-wider text-slate-400">CANCEL</button>
          <button onClick={reject} disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 font-display text-xs font-bold tracking-wider text-white flex items-center justify-center gap-2 disabled:opacity-60">
            {loading ? <Loader2 size={13} className="animate-spin" /> : <X size={13} />}
            REJECT
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function DetailModal({ reg, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}
        className="relative glass rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto border border-indigo-500/30"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 glass border-b border-indigo-500/20 px-6 py-4 flex items-center justify-between">
          <h3 className="font-display text-xs font-bold text-white tracking-wider">APPLICANT DETAILS</h3>
          <button onClick={onClose} className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:text-white">
            <X size={14} />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-display text-base font-black text-white">{reg.firstName} {reg.lastName}</h4>
              <p className="font-body text-sm text-slate-400">{reg.email}</p>
              <p className="font-body text-sm text-slate-500">{reg.mobile}</p>
            </div>
            <Badge status={reg.status} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              ['College', reg.college],
              ['Specialization', reg.specialization],
              ['Course', reg.course],
              ['Package', reg.kitOption === 'with-kit' ? '₹1200 With Kit' : '₹699 No Kit'],
              ['Amount Paid', `₹${reg.amount}`],
              ['Transaction ID', reg.transactionId],
            ].map(([k, v]) => (
              <div key={k} className="bg-slate-900/60 rounded-xl p-3">
                <p className="font-mono text-xs text-slate-600 tracking-wider mb-1">{k.toUpperCase()}</p>
                <p className="font-body text-sm text-slate-200 break-all">{v || '—'}</p>
              </div>
            ))}
          </div>

          {/* Attendance */}
          <div className="bg-slate-900/60 rounded-xl p-3">
            <p className="font-mono text-xs text-slate-600 tracking-wider mb-2">ATTENDANCE</p>
            <div className="flex gap-4">
              <div className={`flex items-center gap-2 font-body text-sm ${reg.attendedDay1 ? 'text-green-400' : 'text-slate-600'}`}>
                {reg.attendedDay1 ? <Check size={14} /> : <X size={14} />} Day 1 (Mar 5)
              </div>
              <div className={`flex items-center gap-2 font-body text-sm ${reg.attendedDay2 ? 'text-green-400' : 'text-slate-600'}`}>
                {reg.attendedDay2 ? <Check size={14} /> : <X size={14} />} Day 2 (Mar 6)
              </div>
            </div>
          </div>

          {reg.rejectionReason && (
            <div className="bg-red-950/20 border border-red-500/20 rounded-xl p-3">
              <p className="font-mono text-xs text-red-500 tracking-wider mb-1">REJECTION REASON</p>
              <p className="font-body text-sm text-red-300">{reg.rejectionReason}</p>
            </div>
          )}

          {/* Files */}
          <div className="space-y-2">
            <p className="font-mono text-xs text-slate-600 tracking-wider">DOCUMENTS</p>
            {reg.resume?.filename && (
              <a href={`${API}/api/admin/registrations/${reg._id}/resume`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-950/30 transition-colors">
                <FileText size={16} className="text-indigo-400" />
                <span className="font-body text-sm text-indigo-300 flex-1">View Resume</span>
                <ExternalLink size={13} className="text-slate-500" />
              </a>
            )}
            {reg.paymentProof?.filename && (
              <a href={`${API}/api/admin/registrations/${reg._id}/payment-proof`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-indigo-500/20 hover:bg-indigo-950/30 transition-colors">
                <Image size={16} className="text-indigo-400" />
                <span className="font-body text-sm text-indigo-300 flex-1">View Payment Proof</span>
                <ExternalLink size={13} className="text-slate-500" />
              </a>
            )}
            {reg.qrCode?.data && (
              <a href={`${API}/api/admin/registrations/${reg._id}/qrcode`} target="_blank" rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-xl border border-green-500/20 hover:bg-green-950/30 transition-colors">
                <QrCode size={16} className="text-green-400" />
                <span className="font-body text-sm text-green-300 flex-1">View Entry QR Code</span>
                <ExternalLink size={13} className="text-slate-500" />
              </a>
            )}
          </div>

          <p className="font-mono text-xs text-slate-700 text-center">
            Registered: {new Date(reg.createdAt).toLocaleString()}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function RegistrationsTable({ onAction }) {
  const [regs, setRegs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [detailTarget, setDetailTarget] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const { data } = await axios.get(`${API}/api/admin/registrations`, { params });
      setRegs(data.registrations);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  useEffect(() => { const t = setTimeout(load, 300); return () => clearTimeout(t); }, [load]);

  const handleDone = () => {
    setConfirmTarget(null);
    setRejectTarget(null);
    load();
    onAction?.();
  };

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
          <input
            type="text"
            placeholder="Search by name, email, txn ID..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="admin-input w-auto min-w-[150px]"
        >
          <option value="">All Statuses</option>
          <option value="processing">Processing</option>
          <option value="confirmed">Confirmed</option>
          <option value="rejected">Rejected</option>
        </select>
        <button onClick={load} className="px-4 py-2 rounded-xl border border-indigo-500/30 font-display text-xs font-bold tracking-wider text-indigo-400 hover:bg-indigo-950/40 transition-colors">
          REFRESH
        </button>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                {['Name', 'Email', 'College', 'Package', 'Txn ID', 'Status', 'Registered', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-mono text-xs text-slate-600 tracking-widest whitespace-nowrap">{h.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="text-center py-16">
                  <Loader2 size={24} className="animate-spin text-indigo-400 mx-auto" />
                </td></tr>
              ) : regs.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-16 font-body text-slate-600">No registrations found</td></tr>
              ) : (
                regs.map((reg, i) => (
                  <motion.tr
                    key={reg._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="border-b border-slate-800/50 hover:bg-slate-900/40 transition-colors"
                  >
                    <td className="px-4 py-3 font-body text-sm text-white whitespace-nowrap font-medium">
                      {reg.firstName} {reg.lastName}
                    </td>
                    <td className="px-4 py-3 font-body text-xs text-slate-400 max-w-[180px] truncate">{reg.email}</td>
                    <td className="px-4 py-3 font-body text-xs text-slate-500 max-w-[150px] truncate">{reg.college}</td>
                    <td className="px-4 py-3">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full border ${reg.kitOption === 'with-kit' ? 'bg-violet-950/40 border-violet-500/40 text-violet-400' : 'bg-slate-900 border-slate-700 text-slate-500'}`}>
                        {reg.kitOption === 'with-kit' ? '₹1200 Kit' : '₹699'}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 max-w-[140px] truncate">{reg.transactionId || '—'}</td>
                    <td className="px-4 py-3"><Badge status={reg.status} /></td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600 whitespace-nowrap">
                      {new Date(reg.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 flex-nowrap">
                        <button onClick={() => setDetailTarget(reg)}
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/50 transition-all" title="View Details">
                          <Eye size={13} />
                        </button>
                        {reg.status === 'processing' && (
                          <>
                            <button onClick={() => setConfirmTarget(reg)}
                              className="p-1.5 rounded-lg bg-green-950/30 text-green-500 hover:bg-green-950/60 border border-green-500/20 transition-all" title="Confirm">
                              <Check size={13} />
                            </button>
                            <button onClick={() => setRejectTarget(reg)}
                              className="p-1.5 rounded-lg bg-red-950/30 text-red-500 hover:bg-red-950/60 border border-red-500/20 transition-all" title="Reject">
                              <X size={13} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-slate-800">
          <p className="font-mono text-xs text-slate-600">{regs.length} record{regs.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {confirmTarget && <ConfirmModal reg={confirmTarget} onClose={() => setConfirmTarget(null)} onDone={handleDone} />}
        {rejectTarget  && <RejectModal  reg={rejectTarget}  onClose={() => setRejectTarget(null)}  onDone={handleDone} />}
        {detailTarget  && <DetailModal  reg={detailTarget}  onClose={() => setDetailTarget(null)} />}
      </AnimatePresence>
    </div>
  );
}
