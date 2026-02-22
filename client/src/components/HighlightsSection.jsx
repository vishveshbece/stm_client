import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cpu, Code2, Wifi, Layers, Bug, TrendingUp, Award, Coffee, Gift } from 'lucide-react';

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
   Stagger variants
───────────────────────────────────────── */
const gridVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const cardVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

function HighlightsGrid() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <motion.div
      ref={ref}
      variants={gridVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-8"
    >
      {highlights.map(h => (
        <motion.div
          key={h.title}
          variants={cardVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="glass border-glow rounded-2xl p-5 group cursor-default"
        >
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${h.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <h.icon size={20} className="text-white" />
          </div>
          <h3 className="font-display text-sm font-bold text-white mb-1.5 tracking-wide">
            {h.title}
          </h3>
          <p className="font-body text-sm text-slate-400 leading-relaxed">{h.desc}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}

export default function HighlightsSection() {
  return (
    <section id="highlights" className="py-10 relative">
      <div className="absolute inset-0 circuit-bg opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.45 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
            Program{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Highlights
            </span>
          </h2>
          <p className="font-body text-slate-400 max-w-xl mx-auto text-sm">
            A carefully structured curriculum covering the full spectrum of STM32 development
          </p>
        </motion.div>

        {/* Grid */}
        <HighlightsGrid />

        {/* Value additions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.45 }}
          className="glass border-glow rounded-2xl p-5 md:p-6"
        >
          <p className="font-display text-xs text-center text-indigo-400 tracking-widest mb-5">
            VALUE ADDITIONS
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {valueAdds.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/10"
              >
                <div className="w-9 h-9 rounded-xl bg-indigo-950 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
                  <Icon size={17} className="text-indigo-400" />
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