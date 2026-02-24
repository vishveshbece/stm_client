import React from 'react';
import { Cpu, Phone, MapPin, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="relative border-t border-slate-800/60 py-10 overflow-hidden">

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
        <div className="grid md:grid-cols-3 gap-8 mb-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-3">
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
                  WORKSHOP 2026
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
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-4">
              CONTACT
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone size={13} className="text-indigo-400" />
                </div>
                <div>
                  <p className="font-body text-sm text-slate-400 font-medium">Student Co-ordinators</p>
                  <p className="font-body text-sm text-slate-400 font-medium">POOJAA SRI S –{' '}
                    <a
                      href="tel:9106689525"
                      className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      9106689525
                    </a>
                  </p>
                  <p className="font-body text-sm text-slate-400 font-medium">RATHISH KUMAR R–{' '}
                    <a
                      href="tel:8428024725"
                      className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      8428024725
                    </a>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={13} className="text-indigo-400" />
                </div>
                <a
                  href="https://www.google.com/maps/place/Chennai+Institute+of+Technology"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-sm text-slate-400 leading-snug hover:text-indigo-400 transition-colors"
                >
                  Chennai Institute of Technology,<br />
                  Sarathy nagar,<br />
                  Kundrathur, Chennai - 600069
                </a>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail size={13} className="text-indigo-400" />
                </div>
                <a
                  href="edwardpaulrajj@citchennai.net"
                  className="font-mono text-xs text-indigo-400 hover:text-indigo-300 transition-colors mt-1"
                >
                  edwardpaulrajj@citchennai.net
                </a>
              </div>
            </div>
          </div>

          {/* Organizers */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-4">
              ORGANIZERS
            </h3>
            <p className="font-body text-sm text-slate-300 font-semibold mb-1">
              IoT Centers of Excellence
            </p>
            <p className="font-body text-sm text-slate-400 mb-4">
              Chennai Institute of Technology
            </p>

            {/* Event date badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-indigo-400">March 5 & 6, 2026</span>
            </div>

            {/* Time info — contrast fixed: slate-600 → slate-500 */}
            <p className="font-body text-xs text-slate-500 block">
              9:00 AM – 3:00 PM both days
            </p>
          </div>
        </div>

        {/* ── Copyright bar ── */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-xs text-slate-400">
            © 2026STM32 Mastering Workshop · IoT Center of Excellence · Chennai Institute of Technology
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
            <span className="font-mono text-xs text-slate-500">v1.0.0</span>
          </div>
        </div>

      </div>
    </footer>
  );
}