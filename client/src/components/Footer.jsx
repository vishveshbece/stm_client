import React from 'react';
import { Cpu, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center">
                <Cpu size={18} className="text-white" />
              </div>
              <div>
                <p className="font-display text-xs font-bold text-indigo-400 tracking-widest">STM32 MASTERING</p>
                <p className="font-display text-xs text-slate-500 tracking-wider">WORKSHOP 2025</p>
              </div>
            </div>
            <p className="font-body text-sm text-slate-500 leading-relaxed">
              A professionally designed hands-on training experience focused on mastering 
              STM32 development and building a strong career path in Embedded Systems.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-4">CONTACT</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="font-body text-sm text-slate-300">Edward Paul Raj</p>
                  <a href="tel:9894923662" className="font-mono text-xs text-indigo-400">9894923662</a>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin size={14} className="text-indigo-400 flex-shrink-0" />
                <p className="font-body text-sm text-slate-400">Chennai Institute of Technology</p>
              </div>
            </div>
          </div>

          {/* Organizers */}
          <div>
            <h3 className="font-display text-xs font-bold text-slate-400 tracking-widest mb-4">ORGANIZERS</h3>
            <p className="font-body text-sm text-slate-300 font-semibold mb-1">IoT Centers of Excellence</p>
            <p className="font-body text-sm text-slate-400">Chennai Institute of Technology</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/40">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="font-mono text-xs text-indigo-400">March 5 & 6, 2025</span>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center">
          <p className="font-body text-xs text-slate-600">
            © 2025 STM32 Mastering Workshop · IoT Centers of Excellence · Chennai Institute of Technology
          </p>
        </div>
      </div>
    </footer>
  );
}
