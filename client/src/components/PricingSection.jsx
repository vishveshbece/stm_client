import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Cpu } from 'lucide-react';

/* ─────────────────────────────────────────
   Static data — outside component
───────────────────────────────────────── */
const kitIncludes = [
  'STM32 Development Board (Nucleo-64)',
  'Starter Peripheral Modules',
  'USB Micro-B Cable',
  'Breadboard & Jump Wires',
];

const bothInclude = [
  'Hands-on Training Sessions',
  'Certificate of Participation',
  'Refreshments (Both Days)',
  'Performance-Based Awards',
  'Embedded Career Roadmap',
  'Expert Mentoring',
];

/* ─────────────────────────────────────────
   Shared card entry variants
   FIX: explicit duration (0.5s) instead of
   Framer default 0.3s — feels less abrupt.
   direction prop lets each card slide from
   its own side without duplicating variants.
───────────────────────────────────────── */
const cardVariants = (direction) => ({
  hidden:  { opacity: 0, x: direction === 'left' ? -32 : 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
});

/* ─────────────────────────────────────────
   Reusable feature-list row
───────────────────────────────────────── */
function FeatureRow({ label, iconBg, iconBorder, iconColor, textColor }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-5 h-5 rounded-full ${iconBg} border ${iconBorder} flex items-center justify-center flex-shrink-0`}>
        <Check size={11} className={iconColor} />
      </div>
      <span className={`font-body text-sm ${textColor}`}>{label}</span>
    </div>
  );
}

/* ─────────────────────────────────────────
   Pricing Section
───────────────────────────────────────── */
export default function PricingSection({ onRegister }) {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          /* FIX: added amount:0.3 — header fires as soon as 30% is
             visible; without this it triggers too late on mobile */
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Package
            </span>
          </h2>
          <p className="font-body text-slate-400">
            Both options include full workshop access and value additions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">

          {/* ── Card 1: Without Kit ── */}
          <motion.div
            variants={cardVariants('left')}
            initial="hidden"
            whileInView="visible"
            /* FIX: amount:0.2 so it fires when 20% of card is visible
               on mobile — avoids the card never animating if viewport
               is shorter than the card height */
            viewport={{ once: true, amount: 0.2 }}
            /* FIX: whileHover on a plain card (no overflow-hidden or
               absolute children) is safe — kept as-is */
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass border border-slate-700/40 rounded-2xl p-8 relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <Cpu size={20} className="text-slate-400" />
              <p className="font-display text-xs tracking-widest text-slate-400">WITHOUT KIT</p>
            </div>

            <div className="flex items-end gap-2 mb-6">
              <span className="font-display text-5xl font-black text-white">₹699</span>
              <span className="font-body text-slate-500 mb-2">/ person</span>
            </div>

            <div className="space-y-3 mb-8">
              {bothInclude.map(item => (
                <FeatureRow
                  key={item}
                  label={item}
                  iconBg="bg-indigo-950"
                  iconBorder="border-indigo-500/40"
                  iconColor="text-indigo-400"
                  textColor="text-slate-300"
                />
              ))}
            </div>

            {/* FIX: upgraded to motion.button for consistent
                interaction feedback matching the featured card */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegister}
              className="w-full py-3 rounded-xl border border-indigo-500/40 font-display text-xs font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors duration-200"
            >
              REGISTER – ₹699
            </motion.button>
          </motion.div>

          {/* ── Card 2: With Kit (featured) ── */}
          {/* FIX: whileHover y-lift on a card with overflow-hidden +
              absolute gradient borders causes the glow border to clip.
              Solution: move overflow-hidden + absolute layers into an
              inner wrapper, keep the outer motion.div clean for hover. */}
          <motion.div
            variants={cardVariants('right')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            /* No overflow-hidden here — the gradient border lives inside */
            className="relative rounded-2xl"
          >
            {/* Gradient border layers — isolated inside, not on outer div */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl pointer-events-none" />
            <div className="absolute inset-[1.5px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[14px] pointer-events-none" />

            {/* All content sits above the border layers */}
            <div className="relative p-8">

              {/* FIX: badge moved outside overflow-hidden context so it
                  never gets clipped; z-10 keeps it above border layers */}
              <div className="absolute top-4 right-4 z-10 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full shadow-lg shadow-indigo-500/30">
                <span className="font-mono text-xs font-bold text-white tracking-widest">RECOMMENDED</span>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <Package size={20} className="text-indigo-400" />
                <p className="font-display text-xs tracking-widest text-indigo-400">WITH COMPLETE KIT</p>
              </div>

              <div className="flex items-end gap-2 mb-6">
                <span className="font-display text-5xl font-black text-white">₹1200</span>
                <span className="font-body text-slate-400 mb-2">/ person</span>
              </div>

              <div className="space-y-3 mb-8">
                {bothInclude.map(item => (
                  <FeatureRow
                    key={item}
                    label={item}
                    iconBg="bg-indigo-600/30"
                    iconBorder="border-indigo-500/60"
                    iconColor="text-indigo-300"
                    textColor="text-slate-200"
                  />
                ))}

                {/* Kit-specific items */}
                <div className="pt-3 mt-3 border-t border-indigo-500/20 space-y-2">
                  <p className="font-mono text-xs text-indigo-400 tracking-wider mb-3">
                    + KIT INCLUDES:
                  </p>
                  {kitIncludes.map(item => (
                    <FeatureRow
                      key={item}
                      label={item}
                      iconBg="bg-violet-600/30"
                      iconBorder="border-violet-500/60"
                      iconColor="text-violet-300"
                      textColor="text-violet-200"
                    />
                  ))}
                </div>
              </div>

              {/* FIX: removed transition-all (conflicts with gradient
                  hover in Safari/Firefox). Use transition-colors only
                  for the colour shift; scale handled by Framer */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegister}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-display text-xs font-bold tracking-widest text-white glow-indigo hover:from-indigo-500 hover:to-violet-500 transition-colors duration-200"
              >
                REGISTER – ₹1200
              </motion.button>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}