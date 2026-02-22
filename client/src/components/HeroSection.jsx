import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Clock, ChevronDown, Zap, Cpu, Wifi, ChevronLeft, ChevronRight } from 'lucide-react';
import board1 from '../assets/board1.png';
import board2 from '../assets/board2.png';
import board3 from '../assets/board3.png';

/* ─────────────────────────────────────────
   BOARD DATA — 3 real board photos
───────────────────────────────────────── */
const BOARDS = [
  { src: board1, label: 'STM32 NUCLEO-64',    spec: 'F446RET6 · 180MHz',  color: '#6366f1', glow: 'rgba(99,102,241,0.7)'  },
  { src: board2, label: 'STM32 BLACKPILL',    spec: 'F411CEU6 · 100MHz',  color: '#22d3ee', glow: 'rgba(34,211,238,0.7)'  },
  { src: board3, label: 'STM32 BLUE PILL',    spec: 'F103C8T6 · 72MHz',   color: '#34d399', glow: 'rgba(52,211,153,0.7)'  },
];

const EVENT_DETAILS = [
  { icon: Calendar, label: 'March 5 & 6', sub: '2025' },
  { icon: Clock,    label: '9:00 AM',     sub: '3:00 PM Daily' },
  { icon: MapPin,   label: 'CIT Chennai', sub: 'Chennai Institute of Tech' },
];

const PROTOCOLS = ['UART', 'SPI', 'I²C', 'HAL', 'GPIO', 'PWM'];

/* ─────────────────────────────────────────
   Floating particles
───────────────────────────────────────── */
function Particles() {
  const particles = useMemo(() =>
    Array.from({ length: 16 }, (_, i) => ({
      id: i,
      size:     Math.random() * 3 + 1.5,
      x:        Math.random() * 100,
      y:        Math.random() * 100,
      duration: Math.random() * 8 + 7,
      delay:    Math.random() * 5,
    })), []
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-indigo-400/30"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
          animate={{ y: [0, -55, -25, -70, 0], x: [0, 18, -12, 9, 0], opacity: [0.2, 0.7, 0.3, 0.6, 0.2] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────
   Scrolling protocol ticker (mobile)
───────────────────────────────────────── */
function ProtocolTicker() {
  const items = [...PROTOCOLS, ...PROTOCOLS, ...PROTOCOLS];
  return (
    <div className="w-full overflow-hidden py-2 mb-6">
      <motion.div
        className="flex gap-3 w-max"
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
      >
        {items.map((p, i) => (
          <div
            key={i}
            className="flex-shrink-0 px-3 py-1 rounded-md border border-indigo-500/30 bg-indigo-950/50"
          >
            <span className="font-mono text-xs text-indigo-300 tracking-widest">{p}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MOBILE BOARD SHOWCASE
   3-board carousel with:
   - Swipe-style slide transition
   - Pulsing neon ring that changes per board
   - Animated scan line across the board
   - Corner bracket decorations
   - Dot + arrow navigation
   - Live spec readout
───────────────────────────────────────── */
function MobileBoardShowcase() {
  const [active,    setActive]    = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused,    setPaused]    = useState(false);

  const go = useCallback((idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    const n = (active + 1) % BOARDS.length;
    setDirection(1); setActive(n);
  }, [active]);

  const prev = useCallback(() => {
    const n = (active - 1 + BOARDS.length) % BOARDS.length;
    setDirection(-1); setActive(n);
  }, [active]);

  /* auto-advance every 3.5s unless user is interacting */
  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, 3500);
    return () => clearInterval(t);
  }, [next, paused]);

  const board = BOARDS[active];

  const slideV = {
    enter:  d => ({ x: d > 0 ? '80%' : '-80%', opacity: 0, scale: 0.85 }),
    center: {
      x: 0, opacity: 1, scale: 1,
      transition: { type: 'spring', stiffness: 280, damping: 28 },
    },
    exit: d => ({
      x: d > 0 ? '-80%' : '80%', opacity: 0, scale: 0.85,
      transition: { duration: 0.28, ease: 'easeIn' },
    }),
  };

  return (
    <div
      className="relative flex flex-col items-center w-full pt-2 pb-8 px-5"
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* ── Board stage ── */}
      <div className="relative flex items-center justify-center" style={{ width: '100%', height: 240 }}>

        {/* outer neon ring — color-keyed to active board */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 228, height: 228,
            border: `2px solid ${board.color}`,
            boxShadow: `0 0 24px ${board.glow}, inset 0 0 24px ${board.color}18`,
          }}
          animate={{ scale: [1, 1.05, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          key={`ring-${active}`}
        />

        {/* spinning dashed orbit ring */}
        <motion.div
          className="absolute rounded-full border border-dashed"
          style={{ width: 248, height: 248, borderColor: `${board.color}40` }}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        />

        {/* inner glow fill */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 210, height: 210,
            background: `radial-gradient(circle, ${board.color}20 0%, transparent 72%)`,
          }}
          animate={{ scale: [0.92, 1.06, 0.92] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          key={`fill-${active}`}
        />

        {/* board image + slide animation */}
        <div className="relative z-10" style={{ width: 188, height: 188 }}>

          {/* corner bracket decorations */}
          {[['top-0 left-0', 'border-t-2 border-l-2'],
            ['top-0 right-0', 'border-t-2 border-r-2'],
            ['bottom-0 left-0', 'border-b-2 border-l-2'],
            ['bottom-0 right-0', 'border-b-2 border-r-2']].map(([pos, brd], i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 ${pos} ${brd} z-20`}
              style={{ borderColor: board.color }}
            />
          ))}

          <AnimatePresence custom={direction} mode="popLayout">
            <motion.div
              key={active}
              custom={direction}
              variants={slideV}
              initial="enter"
              animate="center"
              exit="exit"
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
            >
              {/* the board photo */}
              <motion.img
                src={board.src}
                alt={board.label}
                className="w-full h-full object-contain select-none"
                style={{
                  mixBlendMode: 'screen',
                  filter: `
                    drop-shadow(0 0 14px ${board.glow})
                    drop-shadow(0 0 28px ${board.color}88)
                    brightness(1.15) contrast(1.05)
                  `,
                }}
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                draggable={false}
              />

              {/* scan line sweeping over the board */}
              <motion.div
                className="absolute left-0 right-0 pointer-events-none"
                style={{
                  height: 3,
                  background: `linear-gradient(90deg, transparent 0%, ${board.color}ee 40%, ${board.color} 50%, ${board.color}ee 60%, transparent 100%)`,
                  boxShadow: `0 0 10px ${board.glow}`,
                }}
                animate={{ top: ['0%', '100%'] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', repeatDelay: 0.6 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* prev / next arrows */}
        <button
          onClick={() => { setPaused(true); prev(); setTimeout(() => setPaused(false), 4000); }}
          className="absolute left-0 z-30 w-9 h-9 flex items-center justify-center rounded-full glass border border-indigo-500/30 text-indigo-400 hover:text-white hover:border-indigo-400 transition-all"
        >
          <ChevronLeft size={16} />
        </button>
        <button
          onClick={() => { setPaused(true); next(); setTimeout(() => setPaused(false), 4000); }}
          className="absolute right-0 z-30 w-9 h-9 flex items-center justify-center rounded-full glass border border-indigo-500/30 text-indigo-400 hover:text-white hover:border-indigo-400 transition-all"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* ── Board info readout ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`info-${active}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="flex flex-col items-center gap-1 mt-4 mb-4"
        >
          {/* board name */}
          <span
            className="font-display text-sm font-bold tracking-widest"
            style={{ color: board.color }}
          >
            {board.label}
          </span>
          {/* spec line — looks like a terminal readout */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-slate-500">{'>'}</span>
            <span className="font-mono text-xs text-slate-400">{board.spec}</span>
            <motion.span
              className="inline-block w-1.5 h-3.5 rounded-sm"
              style={{ background: board.color }}
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.9, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ── Dot indicators ── */}
      <div className="flex items-center gap-2">
        {BOARDS.map((b, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="rounded-full transition-all duration-400"
            style={{
              height: 7,
              width:   i === active ? 22 : 7,
              background: i === active ? board.color : 'rgba(99,102,241,0.25)',
              boxShadow: i === active ? `0 0 8px ${board.glow}` : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   DESKTOP BOARD (cycles through all 3)
───────────────────────────────────────── */
function DesktopBoard() {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(p => (p + 1) % BOARDS.length), 4000);
    return () => clearInterval(t);
  }, []);
  const board = BOARDS[active];

  const DESKTOP_BADGES = [
    { label: 'UART', left: '4%',  top: '22%', icon: Wifi, delay: 0   },
    { label: 'SPI',  left: '74%', top: '14%', icon: Cpu,  delay: 0.8 },
    { label: 'I2C',  left: '2%',  top: '68%', icon: Zap,  delay: 1.6 },
    { label: 'HAL',  left: '72%', top: '74%', icon: Cpu,  delay: 1.2 },
  ];

  return (
    <div className="relative hidden lg:flex items-center justify-center min-h-[500px]">
      {/* rings */}
      <motion.div className="absolute rounded-full"
        style={{ width: 310, height: 310, border: `2px solid ${board.color}50`,
          boxShadow: `0 0 40px ${board.glow}` }}
        animate={{ scale: [1, 1.04, 1], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 3, repeat: Infinity }}
        key={`dr-${active}`}
      />
      <motion.div className="absolute rounded-full border border-dashed"
        style={{ width: 360, height: 360, borderColor: `${board.color}25` }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute w-[26rem] h-[26rem] rounded-full border"
        style={{ borderColor: `${board.color}10` }} />

      {/* board */}
      <motion.div
        className="relative z-10 w-72"
        animate={{ y: [0, -16, 0], rotate: [0, 1.2, -0.8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={active}
            src={board.src}
            alt={board.label}
            className="w-full h-full object-contain select-none"
            style={{
              mixBlendMode: 'screen',
              filter: `drop-shadow(0 0 22px ${board.glow}) drop-shadow(0 0 44px ${board.color}55) brightness(1.12)`,
            }}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.5 }}
            draggable={false}
          />
        </AnimatePresence>
        {/* scan overlay */}
        <motion.div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            height: 3,
            background: `linear-gradient(90deg, transparent, ${board.color}dd, transparent)`,
            boxShadow: `0 0 10px ${board.glow}`,
          }}
          animate={{ top: ['0%', '100%'] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 0.5 }}
        />
      </motion.div>

      {/* floating badges */}
      {DESKTOP_BADGES.map(({ label, left, top, icon: Icon, delay }) => (
        <motion.div
          key={label}
          className="absolute glass border-glow rounded-lg px-3 py-2 flex items-center gap-2"
          style={{ left, top }}
          animate={{ y: [0, -8, 0], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 4, delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Icon size={12} className="text-indigo-400" />
          <span className="font-mono text-xs text-indigo-300 font-bold">{label}</span>
        </motion.div>
      ))}

      {/* board label below */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`dlabel-${active}`}
          className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-mono text-xs tracking-widest" style={{ color: board.color }}>
            {board.label}
          </span>
          <span className="font-mono text-xs text-slate-600">{board.spec}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   HERO SECTION — mobile-first layout
   Mobile:  headline → board carousel → chips → CTAs
   Desktop: left text + right board (2-col grid)
───────────────────────────────────────── */
export default function HeroSection({ onRegister }) {
  return (
    <section
      id="about"
      className="relative min-h-screen flex flex-col overflow-hidden circuit-bg"
    >
      {/* BG gradients */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(49,46,129,0.35) 0%, transparent 70%)' }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 50% 50% at 20% 80%, rgba(109,40,217,0.18) 0%, transparent 60%)' }} />

      <Particles />

      {/* ════════════════════════════════
          MOBILE LAYOUT  (hidden on lg+)
          Order: spacer → badge → headline
                 → board carousel → chips → CTAs
      ════════════════════════════════ */}
      <div className="lg:hidden flex flex-col w-full relative z-10 pt-20 px-5">

        {/* live badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-5"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/60">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-indigo-300 tracking-widest">REGISTRATION OPEN</span>
          </div>
        </motion.div>

        {/* headline — centred on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.08 }}
          className="text-center mb-2"
        >
          <h1 className="font-display font-black leading-[0.9]">
            <span className="block text-white" style={{ fontSize: 'clamp(48px,13vw,72px)' }}>STM32</span>
            <span
              className="block text-glow bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent"
              style={{ fontSize: 'clamp(48px,13vw,72px)' }}
            >
              MASTERING
            </span>
            <span className="block text-white text-2xl tracking-widest mt-1">WORKSHOP</span>
          </h1>
          <p className="font-display text-xs text-indigo-300 tracking-widest mt-3 font-medium">
            ROADMAP TO SECURE AN EMBEDDED PLACEMENT
          </p>
        </motion.div>

        {/* board carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.18 }}
        >
          <MobileBoardShowcase />
        </motion.div>

        {/* protocol ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ProtocolTicker />
        </motion.div>

        {/* event chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38 }}
          className="grid grid-cols-1 gap-3 mb-6"
        >
          {EVENT_DETAILS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="glass border-glow rounded-xl px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center flex-shrink-0">
                <Icon size={15} className="text-indigo-400" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-white leading-none">{label}</p>
                <p className="font-body text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.46 }}
          className="flex flex-col gap-3 pb-12"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onRegister}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-sm font-bold tracking-widest text-white glow-indigo flex items-center justify-center gap-2"
          >
            <Zap size={16} /> REGISTER NOW
          </motion.button>
          <a
            href="#highlights"
            className="w-full py-4 rounded-xl border border-indigo-500/40 font-display text-sm font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors flex items-center justify-center gap-2"
          >
            VIEW PROGRAM
          </a>
        </motion.div>
      </div>

      {/* ════════════════════════════════
          DESKTOP LAYOUT  (hidden below lg)
          Standard 2-column: left text / right board
      ════════════════════════════════ */}
      <div className="hidden lg:grid lg:grid-cols-2 gap-16 items-center w-full max-w-7xl mx-auto px-8 py-28 relative z-10 flex-1">

        {/* LEFT: text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/40 bg-indigo-950/50 mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="font-mono text-xs text-indigo-300 tracking-widest">REGISTRATION OPEN</span>
          </div>

          <h1 className="font-display text-5xl xl:text-6xl font-black leading-tight mb-4">
            <span className="text-white block">STM32</span>
            <span className="text-glow bg-gradient-to-r from-indigo-400 via-violet-400 to-purple-400 bg-clip-text text-transparent block">
              MASTERING
            </span>
            <span className="text-white text-4xl block">WORKSHOP</span>
          </h1>

          <p className="font-display text-sm text-indigo-300 tracking-widest mb-6 font-medium">
            ROADMAP TO SECURE AN EMBEDDED PLACEMENT
          </p>

          <p className="font-body text-slate-400 text-base leading-relaxed mb-8 max-w-lg">
            Exclusive 2-Days Intensive Program — hands-on STM32 development training
            and a strong career roadmap in Embedded Systems.
          </p>

          <div className="grid grid-cols-3 gap-4 mb-10">
            {EVENT_DETAILS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="glass border-glow rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-950 flex items-center justify-center flex-shrink-0">
                  <Icon size={15} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-display text-xs font-bold text-white leading-none">{label}</p>
                  <p className="font-body text-xs text-slate-500 mt-0.5">{sub}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegister}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-xl font-display text-sm font-bold tracking-widest text-white glow-indigo flex items-center gap-2"
            >
              <Zap size={16} /> REGISTER NOW
            </motion.button>
            <a
              href="#highlights"
              className="px-8 py-4 rounded-xl border border-indigo-500/40 font-display text-sm font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors flex items-center gap-2"
            >
              VIEW PROGRAM
            </a>
          </div>
        </motion.div>

        {/* RIGHT: board */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <DesktopBoard />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-5 left-1/2 -translate-x-1/2 text-slate-500 z-10"
        animate={{ y: [0, 9, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown size={22} />
      </motion.div>
    </section>
  );
}