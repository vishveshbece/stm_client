import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, Zap, Cpu, Wifi } from 'lucide-react';

// SVG representation of STM32 Nucleo-64 board
function STM32Board({ className = '', style = {} }) {
  return (
    <svg viewBox="0 0 280 420" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
      {/* PCB Base */}
      <rect x="10" y="10" width="260" height="400" rx="8" fill="#1a2744" stroke="#4f46e5" strokeWidth="1.5"/>
      
      {/* ST Logo area */}
      <rect x="30" y="30" width="80" height="30" rx="4" fill="#0f172a"/>
      <text x="40" y="51" fill="#818cf8" fontSize="14" fontFamily="monospace" fontWeight="bold">NUCLEO</text>
      
      {/* Main STM32 IC */}
      <rect x="90" y="120" width="100" height="100" rx="4" fill="#0d1117" stroke="#4f46e5" strokeWidth="1"/>
      <text x="140" y="168" textAnchor="middle" fill="#6366f1" fontSize="9" fontFamily="monospace">STM32</text>
      <text x="140" y="180" textAnchor="middle" fill="#6366f1" fontSize="9" fontFamily="monospace">F446RET6</text>
      <text x="140" y="192" textAnchor="middle" fill="#4b5563" fontSize="7" fontFamily="monospace">ST 2024</text>
      {/* IC pins */}
      {[0,1,2,3,4,5].map(i => (
        <g key={i}>
          <rect x={88 - 8} y={130 + i * 15} width="8" height="3" rx="1" fill="#94a3b8"/>
          <rect x={192} y={130 + i * 15} width="8" height="3" rx="1" fill="#94a3b8"/>
          <rect x={100 + i * 15} y={88 - 8} width="3" height="8" rx="1" fill="#94a3b8"/>
          <rect x={100 + i * 15} y={222} width="3" height="8" rx="1" fill="#94a3b8"/>
        </g>
      ))}

      {/* USB connector */}
      <rect x="115" y="15" width="50" height="25" rx="3" fill="#1e293b" stroke="#64748b" strokeWidth="1"/>
      <text x="140" y="31" textAnchor="middle" fill="#64748b" fontSize="8" fontFamily="monospace">USB</text>
      
      {/* ST-Link section */}
      <rect x="25" y="70" width="70" height="40" rx="3" fill="#0f172a" stroke="#312e81" strokeWidth="1"/>
      <text x="60" y="86" textAnchor="middle" fill="#6366f1" fontSize="7" fontFamily="monospace">ST-LINK</text>
      <text x="60" y="97" textAnchor="middle" fill="#4b5563" fontSize="6" fontFamily="monospace">V3E</text>

      {/* LED indicators */}
      <circle cx="185" cy="60" r="5" fill="#22c55e" opacity="0.9" filter="url(#greenGlow)"/>
      <circle cx="200" cy="60" r="5" fill="#3b82f6" opacity="0.9" filter="url(#blueGlow)"/>
      <circle cx="215" cy="60" r="5" fill="#ef4444" opacity="0.7"/>
      <text x="200" y="78" textAnchor="middle" fill="#374151" fontSize="6" fontFamily="monospace">PWR/LD2/LD3</text>

      {/* User button */}
      <rect x="230" y="100" width="28" height="18" rx="9" fill="#1e293b" stroke="#4f46e5" strokeWidth="1"/>
      <circle cx="244" cy="109" r="5" fill="#312e81"/>
      <text x="244" y="130" textAnchor="middle" fill="#4b5563" fontSize="6" fontFamily="monospace">USER</text>

      {/* Reset button */}
      <rect x="25" y="120" width="28" height="18" rx="9" fill="#1e293b" stroke="#374151" strokeWidth="1"/>
      <circle cx="39" cy="129" r="5" fill="#1f2937"/>
      <text x="39" y="150" textAnchor="middle" fill="#374151" fontSize="6" fontFamily="monospace">RST</text>

      {/* Arduino header connectors - left */}
      <rect x="12" y="140" width="14" height="120" rx="3" fill="#0f172a" stroke="#374151"/>
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="13" y={145 + i * 16} width="12" height="8" rx="2" fill="#1e293b" stroke="#4f46e5" strokeWidth="0.5"/>
      ))}

      {/* Arduino header connectors - right */}
      <rect x="254" y="140" width="14" height="120" rx="3" fill="#0f172a" stroke="#374151"/>
      {[0,1,2,3,4,5,6].map(i => (
        <rect key={i} x="255" y={145 + i * 16} width="12" height="8" rx="2" fill="#1e293b" stroke="#4f46e5" strokeWidth="0.5"/>
      ))}

      {/* Bottom connector strip */}
      <rect x="40" y="340" width="200" height="16" rx="3" fill="#0f172a" stroke="#374151"/>
      {[0,1,2,3,4,5,6,7,8,9,10].map(i => (
        <rect key={i} x={44 + i * 17} y={341} width="14" height="14" rx="2" fill="#1e293b" stroke="#4f46e5" strokeWidth="0.5"/>
      ))}

      {/* Crystal oscillator */}
      <rect x="170" y="80" width="30" height="15" rx="3" fill="#1e293b" stroke="#6b7280"/>
      <text x="185" y="91" textAnchor="middle" fill="#6b7280" fontSize="6" fontFamily="monospace">8MHz</text>

      {/* Trace lines */}
      <line x1="95" y1="170" x2="26" y2="170" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4"/>
      <line x1="185" y1="170" x2="254" y2="170" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4"/>
      <line x1="140" y1="230" x2="140" y2="335" stroke="#1e3a5f" strokeWidth="1" strokeDasharray="4,4"/>

      {/* Filters */}
      <defs>
        <filter id="greenGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="blueGlow">
          <feGaussianBlur stdDeviation="2" result="blur"/>
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Corner mounting holes */}
      <circle cx="25" cy="25" r="4" fill="none" stroke="#374151"/>
      <circle cx="255" cy="25" r="4" fill="none" stroke="#374151"/>
      <circle cx="25" cy="395" r="4" fill="none" stroke="#374151"/>
      <circle cx="255" cy="395" r="4" fill="none" stroke="#374151"/>
    </svg>
  );
}

// Floating particles
function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 6 + 6,
    delay: Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-500/50"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -40, -20, -60, 0], x: [0, 20, -15, 10, 0], opacity: [0.4, 0.9, 0.5, 0.8, 0.4] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

export default function HeroSection({ onRegister }) {
  return (
    <section id="about" className="relative min-h-screen flex items-center pt-20 overflow-hidden circuit-bg">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-radial from-indigo-950/40 via-transparent to-transparent" style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(49,46,129,0.3) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-gradient-radial" style={{ background: 'radial-gradient(ellipse 50% 50% at 30% 70%, rgba(109,40,217,0.15) 0%, transparent 60%)' }} />
      
      <Particles />

      <div className="max-w-7xl mx-auto px-6 py-20 grid lg:grid-cols-2 gap-16 items-center w-full relative z-10">
        {/* Left content */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/50 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-indigo-300 tracking-widest">REGISTRATION OPEN</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-4xl md:text-5xl xl:text-6xl font-black leading-tight mb-4">
              <span className="text-white">STM32</span>
              <br />
              <span className="text-glow bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent">
                MASTERING
              </span>
              <br />
              <span className="text-white text-3xl md:text-4xl">WORKSHOP</span>
            </h1>

            <p className="font-display text-sm md:text-base text-indigo-300 tracking-widest mb-8 font-medium">
              ROADMAP TO SECURE AN EMBEDDED PLACEMENT
            </p>

            <p className="font-body text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
              Executive Two-Day Intensive Program. A professionally designed hands-on training 
              experience focused on mastering STM32 development and building a strong career path 
              in Embedded Systems.
            </p>

            {/* Event details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[
                { icon: Calendar, label: 'March 5 & 6', sub: '2025' },
                { icon: Clock, label: '9:00 AM', sub: '3:00 PM Daily' },
                { icon: MapPin, label: 'CIT Chennai', sub: 'Chennai Institute of Tech' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="glass border-glow rounded-xl p-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-display text-xs font-bold text-white leading-none">{label}</p>
                    <p className="font-body text-xs text-slate-500 mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={onRegister}
                className="group relative px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-sm font-bold tracking-widest text-white overflow-hidden glow-indigo"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Zap size={16} /> REGISTER NOW
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-violet-400 opacity-0 group-hover:opacity-20 transition-opacity" />
              </motion.button>
              <a
                href="#highlights"
                className="px-8 py-4 rounded-xl border border-indigo-500/40 font-display text-sm font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors flex items-center gap-2"
              >
                VIEW PROGRAM
              </a>
            </div>
          </motion.div>
        </div>

        {/* Right content - Floating STM32 Board */}
        <div className="relative flex items-center justify-center">
          {/* Glow rings */}
          <div className="absolute w-72 h-72 rounded-full border border-indigo-500/20 animate-pulse" />
          <div className="absolute w-96 h-96 rounded-full border border-violet-500/10 animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute w-[28rem] h-[28rem] rounded-full border border-indigo-500/5" />

          {/* Floating board */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 2, -1, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="relative z-10"
          >
            <div className="relative w-56 board-glow">
              <STM32Board />
              {/* Scan line effect */}
              <div className="absolute inset-0 rounded-lg overflow-hidden scan-overlay pointer-events-none" />
            </div>
          </motion.div>

          {/* Floating tech badges */}
          {[
            { label: 'UART', x: -100, y: -60, icon: Wifi, delay: 0 },
            { label: 'SPI', x: 110, y: -80, icon: Cpu, delay: 1 },
            { label: 'I2C', x: -90, y: 100, icon: Zap, delay: 2 },
            { label: 'HAL', x: 100, y: 110, icon: Cpu, delay: 1.5 },
          ].map(({ label, x, y, icon: Icon, delay }) => (
            <motion.div
              key={label}
              className="absolute glass border-glow rounded-lg px-3 py-2 flex items-center gap-2"
              style={{ left: `calc(50% + ${x}px)`, top: `calc(50% + ${y}px)` }}
              animate={{ y: [0, -8, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Icon size={12} className="text-indigo-400" />
              <span className="font-mono text-xs text-indigo-300 font-bold">{label}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={24} />
      </motion.div>
    </section>
  );
}
