import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Code2, Wifi, Layers, Bug, TrendingUp, Award, Coffee, Gift } from 'lucide-react';

/* ─────────────────────────────────────────
   Static data — outside component to avoid
   re-creation on every render
───────────────────────────────────────── */
const highlights = [
  {
    icon: Cpu,
    title: 'Hands-On STM32 Training',
    desc: 'Work directly with STM32 Nucleo-64 development boards in guided practical sessions.',
    color: 'from-indigo-500 to-blue-600',
  },
  {
    icon: Code2,
    title: 'Bare Metal Programming',
    desc: 'Understand register-level control, memory maps, and direct hardware manipulation.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Layers,
    title: 'STM32 HAL Architecture',
    desc: 'Deep-dive into Hardware Abstraction Layer concepts and peripheral driver design.',
    color: 'from-blue-500 to-cyan-600',
  },
  {
    icon: Wifi,
    title: 'Communication Protocols',
    desc: 'Master UART, SPI, and I2C protocols with real interfacing exercises on physical hardware.',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    icon: Bug,
    title: 'Peripheral Interfacing & Debug',
    desc: 'Interface with sensors, displays, and actuators. Debug using STM32CubeIDE and logic analyzers.',
    color: 'from-orange-500 to-amber-600',
  },
  {
    icon: TrendingUp,
    title: 'Embedded Career Roadmap',
    desc: 'Strategic placement guidance, resume tips, and interview preparation for Embedded roles.',
    color: 'from-rose-500 to-pink-600',
  },
];

const valueAdds = [
  { icon: Award,  label: 'Certificate of Participation' },
  { icon: Coffee, label: 'Refreshments Included' },
  { icon: Gift,   label: 'Performance-Based Awards & Gifts' },
];

/* ─────────────────────────────────────────
   Card grid with correct stagger
   FIX: individual whileInView on each card
   fires independently — stagger doesn't work.
   Solution: one useInView ref on the grid
   container, then animate all children from
   a single variants object with staggerChildren.
───────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,   // 100 ms between each card
      delayChildren:   0.05,
    },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

function HighlightsGrid() {
  const ref     = useRef(null);
  // FIX: amount:0.1 fires when 10 % of the grid is visible —
  // on mobile the grid is tall so 0.3 (default) never triggers
  const inView  = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={gridVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
    >
      {highlights.map(h => (
        <motion.div
          key={h.title}
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="glass border-glow rounded-2xl p-6 group cursor-default"
        >
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}
          >
            <h.icon size={22} className="text-white" />
          </div>
          <h3 className="font-display text-sm font-bold text-white mb-2 tracking-wide">
            {h.title}
          </h3>
          <p className="font-body text-sm text-slate-400 leading-relaxed">{h.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   Highlights Section
───────────────────────────────────────── */
export default function HighlightsSection() {
  return (
    <section id="highlights" className="py-24 relative">
      {/* Background circuit overlay */}
      <div className="absolute inset-0 circuit-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
            Program{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Highlights
            </span>
          </h2>
          <p className="font-body text-slate-400 max-w-xl mx-auto">
            A carefully structured curriculum covering the full spectrum of STM32 development
          </p>
        </motion.div>

        {/* ── Highlights grid (stagger fixed) ── */}
        <HighlightsGrid />

        {/* ── Value additions ──
            FIX: was flex-wrap with gap-8 — on small phones each item
            became very narrow. Now uses a responsive grid so each
            item always gets a full readable row on mobile.
        ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="glass border-glow rounded-2xl p-6 md:p-8"
        >
          <p className="font-display text-xs text-center text-indigo-400 tracking-widest mb-6">
            VALUE ADDITIONS
          </p>

          {/* Grid: 1 col on mobile → 3 cols on md+ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {valueAdds.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/10"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-indigo-400" />
                </div>
                <span className="font-body text-slate-300 font-medium text-sm leading-snug">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}