import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(30,27,75,0.5) 0%, #030712 70%)' }}>
      
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(rgba(99,102,241,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.15) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-indigo-500/60"
          style={{ left: `${10 + i * 12}%`, top: `${20 + (i % 3) * 20}%` }}
          animate={{ y: [0, -30, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="glass rounded-2xl overflow-hidden"
          style={{ border: '1px solid rgba(99,102,241,0.3)', boxShadow: '0 0 60px rgba(99,102,241,0.1)' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-950 to-violet-950 px-8 py-8 text-center border-b border-indigo-500/20">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-4"
              style={{ boxShadow: '0 0 30px rgba(99,102,241,0.5)' }}>
              <Cpu size={28} className="text-white" />
            </div>
            <h1 className="font-display text-lg font-black text-white tracking-wider">ADMIN PORTAL</h1>
            <p className="font-body text-xs text-indigo-400 mt-1 tracking-widest">STM32 MASTERING WORKSHOP</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <p className="font-display text-xs text-slate-500 tracking-widest text-center mb-6">SECURE LOGIN</p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Username</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="admin"
                    className="admin-input pl-9"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-xs text-slate-400 mb-1.5 tracking-wide">Password</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-500" />
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="admin-input pl-9 pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                    {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-950/30 border border-red-500/30 px-4 py-3">
                  <p className="font-body text-xs text-red-400">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 mt-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-xs font-black tracking-widest text-white flex items-center justify-center gap-2 hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-60"
                style={{ boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
              >
                {loading ? <><Loader2 size={14} className="animate-spin" /> AUTHENTICATING...</> : <><Lock size={14} /> ACCESS PORTAL</>}
              </button>
            </form>

            <p className="text-center font-body text-xs text-slate-600 mt-6">
              IoT Centers of Excellence · Chennai Institute of Technology
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
