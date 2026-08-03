import React from 'react';
import { Linkedin, GraduationCap, Lightbulb, Sparkles, ArrowUpRight } from 'lucide-react';

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 bg-obsidian-900/90 border-t border-slate-800 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-agri-500/30 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="w-56 h-56 rounded-2xl overflow-hidden border-2 border-agri-500/40">
                <img src="/assets/founder_portrait.jpg" alt="Pampana Hari Sai Ganesh" className="w-full h-full object-cover" />
              </div>
              <span className="mt-3 px-3 py-1 rounded-full bg-agri-500/20 text-agri-300 text-xs font-bold">
                B.Sc. Agriculture Student
              </span>
            </div>

            <div className="md:col-span-7 space-y-4">
              <h3 className="text-2xl sm:text-3xl font-bold text-white">
                Pampana Hari Sai Ganesh
              </h3>
              <p className="text-agri-400 font-semibold text-sm">
                Founder, LR AgroSense
              </p>
              <p className="text-base text-slate-300">
                Founder of LR AgroSense and B.Sc. Agriculture student focused on building innovative solutions that help farmers through technology, AI, and IoT.
              </p>
              <a
                href="https://www.linkedin.com/in/lragrosense"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-[#0A66C2] text-white font-bold text-sm inline-flex items-center gap-2"
              >
                <Linkedin className="w-4 h-4 fill-white" />
                <span>Connect on LinkedIn</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
