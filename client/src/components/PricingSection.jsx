import React from 'react';
import { motion } from 'framer-motion';
import { Check, Package, Cpu } from 'lucide-react';

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

export default function PricingSection({ onRegister }) {
  return (
    <section id="pricing" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="font-mono text-xs text-indigo-400 tracking-widest mb-4">// PRICING</p>
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
            Choose Your <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Package</span>
          </h2>
          <p className="font-body text-slate-400">Both options include full workshop access and value additions</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Without Kit */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
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
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-indigo-950 border border-indigo-500/40 flex items-center justify-center flex-shrink-0">
                    <Check size={11} className="text-indigo-400" />
                  </div>
                  <span className="font-body text-sm text-slate-300">{item}</span>
                </div>
              ))}
            </div>

            <button
              onClick={onRegister}
              className="w-full py-3 rounded-xl border border-indigo-500/40 font-display text-xs font-bold tracking-widest text-indigo-400 hover:bg-indigo-950/50 transition-colors"
            >
              REGISTER – ₹699
            </button>
          </motion.div>

          {/* With Kit - Featured */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -4 }}
            className="relative rounded-2xl overflow-hidden"
          >
            {/* Glowing border */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl" />
            <div className="absolute inset-[1px] bg-gradient-to-br from-slate-900 to-indigo-950 rounded-2xl" />
            
            <div className="relative p-8">
              {/* Popular badge */}
              <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full">
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
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-indigo-600/30 border border-indigo-500/60 flex items-center justify-center flex-shrink-0">
                      <Check size={11} className="text-indigo-300" />
                    </div>
                    <span className="font-body text-sm text-slate-200">{item}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-indigo-500/20 mt-4">
                  <p className="font-mono text-xs text-indigo-400 tracking-wider mb-3">+ KIT INCLUDES:</p>
                  {kitIncludes.map(item => (
                    <div key={item} className="flex items-center gap-3 mb-2">
                      <div className="w-5 h-5 rounded-full bg-violet-600/30 border border-violet-500/60 flex items-center justify-center flex-shrink-0">
                        <Check size={11} className="text-violet-300" />
                      </div>
                      <span className="font-body text-sm text-violet-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onRegister}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 font-display text-xs font-bold tracking-widest text-white glow-indigo hover:from-indigo-500 hover:to-violet-500 transition-all"
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
