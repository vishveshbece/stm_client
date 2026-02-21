import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Menu, X } from 'lucide-react';

/* ─────────────────────────────────────────
   Mobile menu animation variants
   Defined outside component — stable refs,
   no recreation on each render
───────────────────────────────────────── */
const mobileMenuVariants = {
  hidden: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.22, ease: 'easeIn' },
  },
  visible: {
    opacity: 1,
    height: 'auto',
    transition: { duration: 0.28, ease: 'easeOut' },
  },
};

const NAV_LINKS = ['About', 'Highlights', 'Pricing', 'Contact'];

export default function Navbar({ onRegister }) {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  /* FIX: passive:true tells the browser this listener never calls
     preventDefault() — removes the "non-passive event listener"
     console warning and allows the browser to scroll without waiting */
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  /* FIX: close mobile menu first, THEN scroll after the exit
     animation completes (280 ms) so the layout shift doesn't
     interrupt the closing animation */
  const handleNavLinkClick = useCallback((href) => {
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }, []);

  const handleRegisterClick = useCallback(() => {
    setMobileOpen(false);
    // slight delay so menu closes before modal opens
    setTimeout(onRegister, 200);
  }, [onRegister]);

  return (
    /* FIX: removed transition-all from nav className — it conflicts
       with Framer's initial/animate and causes a double-transition
       flicker on first paint. Background transition is handled by
       Framer on the inner glass div instead */
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      {/* FIX: background transition isolated to this div — no conflict
          with Framer's entry animation on the outer nav */}
      <div
        className={`transition-all duration-500 ${
          scrolled
            ? 'glass border-b border-indigo-500/20 shadow-lg shadow-indigo-950/50'
            : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* ── Logo ── */}
          <div className="flex items-center gap-3">
            {/* FIX: added isolate so the blur glow stays inside this
                stacking context and doesn't bleed through sibling elements */}
            <div className="relative isolate">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center glow-indigo">
                <Cpu size={20} className="text-white" />
              </div>
              {/* Glow halo — z-[-1] keeps it behind the icon */}
              <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg blur opacity-40 z-[-1]" />
            </div>
            <div>
              <p className="font-display text-xs font-bold text-indigo-400 tracking-widest leading-none">
                STM32
              </p>
              <p className="font-display text-xs text-slate-400 leading-none tracking-wider mt-0.5">
                WORKSHOP
              </p>
            </div>
          </div>

          {/* ── Desktop nav links ── */}
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(item => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm font-body text-slate-400 hover:text-indigo-400 transition-colors duration-200 tracking-wide"
              >
                {item}
              </a>
            ))}
          </div>

          {/* ── Desktop CTA ── */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegister}
              className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-display text-xs font-bold tracking-widest text-white glow-indigo hover:from-indigo-500 hover:to-violet-500 transition-colors duration-300"
            >
              REGISTER NOW
            </motion.button>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            onClick={() => setMobileOpen(prev => !prev)}
            className="md:hidden text-slate-400 hover:text-slate-200 transition-colors p-1"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {/* FIX: animate icon swap with a quick scale so it doesn't
                just hard-cut between Menu and X */}
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate:  90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: 'block' }}
                >
                  <X size={24} />
                </motion.span>
              ) : (
                <motion.span
                  key="open"
                  initial={{ rotate:  90, opacity: 0 }}
                  animate={{ rotate: 0,   opacity: 1 }}
                  exit={{   rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ display: 'block' }}
                >
                  <Menu size={24} />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* ── Mobile dropdown menu ──
          FIX: wrapped in AnimatePresence so the exit (close)
          animation actually plays. Without this, the component
          unmounts immediately and height:0 / opacity:0 never run.
      ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            variants={mobileMenuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="md:hidden overflow-hidden glass border-t border-indigo-500/20"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((item, i) => (
                <motion.a
                  key={item}
                  /* stagger each link as the menu opens */
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.2 }}
                  href={`#${item.toLowerCase()}`}
                  onClick={e => {
                    e.preventDefault();
                    handleNavLinkClick(`#${item.toLowerCase()}`);
                  }}
                  className="font-body text-slate-300 hover:text-indigo-400 transition-colors py-3 border-b border-slate-800/60 last:border-0 tracking-wide"
                >
                  {item}
                </motion.a>
              ))}

              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.06 + 0.05, duration: 0.2 }}
                onClick={handleRegisterClick}
                className="mt-3 px-4 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-lg font-display text-xs font-bold tracking-widest text-white text-center glow-indigo"
              >
                REGISTER NOW
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}