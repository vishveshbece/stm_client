import React from 'react';
import { Cpu, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-slate-800/60 py-16 overflow-hidden">

      {/* Subtle background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 100%, rgba(49,46,129,0.12) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ── 3-column grid ── */}
        <div className="grid md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                  <Cpu size={18} className="text-white" />
                </div>
                <div className="absolute -inset-0.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg blur opacity-30 -z-10" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-indigo-400 tracking-widest leading-none">
                  STM32 MASTERING
                </p>
                <p className="font-display text-xs text-slate-500 tracking-wider leading-none mt-0.5">
                  WORKSHOP 2025
                </p>
              </div>
            </div>
            <p className="font-body text-sm text-slate-500 leading-relaxed max-w-xs">
              A professionally designed hands-on training experience focused on mastering
              STM32 development and building a strong career path in Embedded Systems.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-5">
              CONTACT
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={13} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-body text-sm text-slate-300 font-medium">Student Co-ordinator</p>
                  <a
                    href="tel:9894923662"
                    className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                  >
                    9894923662
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-indigo-400" />
                </div>
                <p className="font-body text-sm text-slate-400 leading-snug">
                  Chennai Institute of Technology,<br />
                  Chennai, Tamil Nadu
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={13} className="text-indigo-400" />
                </div>
                <a
                  href="mailto:iotcoe@citchennai.net"
                  className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
                >
                  iotcoe@citchennai.net
                </a>
              </div>
            </div>
          </div>

          {/* Organizers */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-5">
              ORGANIZERS
            </h3>
            <p className="font-body text-sm text-slate-300 font-semibold mb-1">
              IoT Centers of Excellence
            </p>
            <p className="font-body text-sm text-slate-400 mb-6">
              Chennai Institute of Technology
            </p>

            {/* Event date badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-indigo-400">March 5 & 6, 2025</span>
            </div>

            {/* Time info */}
            <p className="font-body text-xs text-slate-600 block">
              9:00 AM – 3:00 PM both days
            </p>
          </div>
        </div>

        {/* ── Copyright bar — OUTSIDE the grid ── */}
        <div className="border-t border-slate-800/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* FIX: text-slate-600 (~2.4:1 contrast) → text-slate-400 (~5.5:1, passes WCAG AA) */}
          <p className="font-body text-xs text-slate-400">
            © 2025 STM32 Mastering Workshop · IoT Centers of Excellence · Chennai Institute of Technology
          </p>
          <div className="flex items-center gap-1.5">
            {/* FIX: dot opacity /60 → full indigo-400 so it reads at small size */}
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            {/* FIX: text-slate-700 (~1.8:1 contrast) → text-slate-500 (~4.1:1) */}
            <span className="font-mono text-xs text-slate-500">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}