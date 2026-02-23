import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Cpu } from 'lucide-react';

const kitIncludes = [
  'STM32 Development Kit',
  'Starter Peripheral Modules',
  'USB Micro-B Cable',
];

const bothInclude = [
  'Hands-on Training Sessions',
  'Certificate of Participation',
  'Refreshments (Both Days)',
  'Performance-Based Awards',
  'Embedded Career Roadmap',
  'Expert Mentoring',
];

const cardVariants = (direction) => ({
  hidden:  { opacity: 0, x: direction === 'left' ? -32 : 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
});

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

export default function PricingSection({ onRegister }) {
  return (
    <section id="pricing" className="py-10 relative">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-3">
            Choose Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              Package
            </span>
          </h2>
          <p className="font-body text-slate-400 text-sm">
            Both options include full workshop access and value additions
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

          {/* Card 1: Without Kit */}
          <motion.div
            variants={cardVariants('left')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="glass border border-slate-700/40 rounded-2xl p-6 relative"
          >
            <div className="flex items-center gap-3 mb-2">
              <Cpu size={18} className="text-slate-400" />
              <p className="font-display text-xs tracking-widest text-slate-400">WITHOUT KIT</p>
            </div>

            <div className="flex items-end gap-2 mb-5">
              <span className="font-display text-5xl font-black text-white">₹699</span>
              <span className="font-body text-slate-500 mb-2">/ person</span>
            </div>

            <div className="space-y-2.5 mb-6">
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

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={onRegister}
              className="w-full py-3 rounded-xl border border-indigo-500/40 font-display text-xs font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors duration-200"
            >
              REGISTER – ₹699
            </motion.button>
          </motion.div>

          {/* Card 2: With Kit (featured) */}
          <motion.div
            variants={cardVariants('right')}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="relative rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl pointer-events-none" />
            <div className="absolute inset-[1.5px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[14px] pointer-events-none" />

            <div className="relative p-6">
              <div className="flex items-center gap-3 mb-2">
                <Package size={18} className="text-indigo-400" />
                <p className="font-display text-xs tracking-widest text-indigo-400">WITH COMPLETE KIT</p>
              </div>

              <div className="flex items-end gap-2 mb-5">
                <span className="font-display text-5xl font-black text-white">₹1200</span>
                <span className="font-body text-slate-400 mb-2">/ person</span>
              </div>

              <div className="space-y-2.5 mb-6">
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

                <div className="pt-3 mt-3 border-t border-indigo-500/20 space-y-2">
                  <p className="font-mono text-xs text-indigo-400 tracking-wider mb-2">
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