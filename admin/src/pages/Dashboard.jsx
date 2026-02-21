import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  Cpu, LogOut, Users, CheckCircle, XCircle, Clock,
  Package, Calendar, QrCode, RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import RegistrationsTable from '../components/RegistrationsTable';
import AttendanceScanner from '../components/AttendanceScanner';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const statCards = (stats) => [
  { label: 'Total',      value: stats.total,      icon: Users,       color: 'from-blue-500 to-cyan-600' },
  { label: 'Processing', value: stats.processing,  icon: Clock,       color: 'from-amber-500 to-orange-600' },
  { label: 'Confirmed',  value: stats.confirmed,   icon: CheckCircle, color: 'from-green-500 to-emerald-600' },
  { label: 'Rejected',   value: stats.rejected,    icon: XCircle,     color: 'from-red-500 to-rose-600' },
  { label: 'With Kit',   value: stats.withKit,     icon: Package,     color: 'from-indigo-500 to-violet-600' },
  { label: 'Day 1 Att.', value: stats.day1,        icon: Calendar,    color: 'from-teal-500 to-green-600' },
  { label: 'Day 2 Att.', value: stats.day2,        icon: Calendar,    color: 'from-purple-500 to-violet-600' },
];

const TABS = [
  { id: 'registrations', label: 'Registrations',      icon: Users },
  { id: 'scanner',       label: 'Attendance Scanner',  icon: QrCode },
];

export default function Dashboard() {
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    total: 0, processing: 0, confirmed: 0, rejected: 0,
    withKit: 0, withoutKit: 0, day1: 0, day2: 0,
  });
  const [activeTab, setActiveTab] = useState('registrations');
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/api/admin/stats`);
      setStats(data);
    } catch (e) { console.error(e); }
    finally { setStatsLoading(false); }
  }, []);

  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Nav */}
      <nav className="glass border-b border-indigo-500/20 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
            <Cpu size={16} className="text-white" />
          </div>
          <div>
            <p className="font-display text-xs font-bold text-indigo-400 tracking-widest leading-none">STM32 WORKSHOP</p>
            <p className="font-display text-xs text-slate-600 leading-none tracking-wider">ADMIN PORTAL</p>
          </div>
        </div>

        {/* Tab Nav */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 rounded-xl p-1 border border-slate-800">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-display text-xs font-bold tracking-wider transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              <tab.icon size={13} /> {tab.label.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadStats}
            className="p-2 rounded-lg text-slate-500 hover:text-indigo-400 hover:bg-indigo-950/50 transition-all"
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-700 font-display text-xs font-bold tracking-wider text-slate-400 hover:text-white hover:border-red-500/40 hover:bg-red-950/20 transition-all"
          >
            <LogOut size={14} /> LOGOUT
          </button>
        </div>
      </nav>

      {/* Mobile tabs */}
      <div className="md:hidden flex border-b border-slate-800">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-display text-xs font-bold tracking-wider border-b-2 transition-all ${
              activeTab === tab.id ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-slate-600'
            }`}
          >
            <tab.icon size={13} /> {tab.label}
          </button>
        ))}
      </div>

      {/* Stats bar */}
      <div className="px-6 py-4 border-b border-slate-800/60 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {statCards(stats).map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="glass border border-slate-800 rounded-xl px-4 py-3 flex items-center gap-3 min-w-[120px]">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0`}>
                <Icon size={14} className="text-white" />
              </div>
              <div>
                <p className="font-display text-lg font-black text-white leading-none">
                  {statsLoading ? '—' : value}
                </p>
                <p className="font-body text-xs text-slate-500 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        {activeTab === 'registrations' && <RegistrationsTable onAction={loadStats} />}
        {/* ✅ Pass loadStats as onScan so stats update after every scan */}
        {activeTab === 'scanner' && <AttendanceScanner onScan={loadStats} />}
      </div>
    </div>
  );
}