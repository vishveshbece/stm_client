import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Menu, X } from 'lucide-react';

export default function Navbar({ onRegister }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'glass border-b border-indigo-500/20 shadow-lg shadow-indigo-950/50' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center glow-indigo">
              <Cpu size={20} className="text-white" />
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg blur opacity-40 -z-10" />
          </div>
          <div>
            <p className="font-display text-xs font-bold text-indigo-400 tracking-widest leading-none">STM32</p>
            <p className="font-display text-xs text-slate-400 leading-none tracking-wider">WORKSHOP</p>
          </div>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {['About', 'Highlights', 'Pricing', 'Contact'].map(item => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-body text-slate-400 hover:text-indigo-400 transition-colors duration-200 tracking-wide"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={onRegister}
            className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-display text-xs font-bold tracking-widest text-white glow-indigo transition-all duration-300 hover:from-indigo-500 hover:to-violet-500"
          >
            REGISTER NOW
          </motion.button>
        </div>

        {/* Mobile menu button */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400">
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="md:hidden glass border-t border-indigo-500/20 px-6 py-4 flex flex-col gap-4"
        >
          {['About', 'Highlights', 'Pricing', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} className="text-slate-300 font-body" onClick={() => setMobileOpen(false)}>
              {item}
            </a>
          ))}
          <button
            onClick={() => { onRegister(); setMobileOpen(false); }}
            className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-display text-xs font-bold tracking-widest text-white text-center"
          >
            REGISTER NOW
          </button>
        </motion.div>
      )}
    </motion.nav>
  );
}
