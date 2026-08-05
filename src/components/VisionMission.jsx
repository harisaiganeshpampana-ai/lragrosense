import React from 'react';
import { Eye, Rocket, ShieldCheck, Compass, Check } from 'lucide-react';

export default function VisionMission() {
  return (
    <section id="vision-mission" className="py-20 bg-obsidian-900/80 border-t border-slate-800/80 relative overflow-hidden">
      
      {/* Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-agri-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
            <Compass className="w-3.5 h-3.5 text-agri-400" />
            <span>Guiding Principles</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Our Vision & <span className="gradient-text-agri">Mission</span>
          </h2>
          <p className="text-base text-slate-300">
            Pioneering the future of precision agriculture with purpose-driven technology built for scale and impact.
          </p>
        </div>

        {/* Vision & Mission Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Card 1: Our Vision */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-10 border border-agri-500/30 relative flex flex-col justify-between group">
            
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-agri-500/10 rounded-full blur-2xl group-hover:bg-agri-500/20 transition-all duration-500" />

            <div className="space-y-6 relative z-10">
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-agri-500/20 to-agri-700/20 border border-agri-500/40 flex items-center justify-center text-agri-400 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-agri-500/10">
                  <Eye className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                  PILLAR 01
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Vision
              </h3>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                To create an intelligent agricultural ecosystem that empowers farmers with data-driven decision-making while improving food security and reducing environmental impact.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-agri-300">
                  <Check className="w-4 h-4 text-agri-400" />
                  <span>Enhanced Food Security for Future Generations</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-agri-300">
                  <Check className="w-4 h-4 text-agri-400" />
                  <span>Zero Water & Resource Waste Ecosystem</span>
                </div>
              </div>

            </div>

          </div>

          {/* Card 2: Our Mission */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-10 border border-techCyan/30 relative flex flex-col justify-between group">
            
            {/* Ambient Background Accent */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-techCyan/10 rounded-full blur-2xl group-hover:bg-techCyan/20 transition-all duration-500" />

            <div className="space-y-6 relative z-10">
              
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-techCyan/20 to-cyan-700/20 border border-techCyan/40 flex items-center justify-center text-techCyan group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-techCyan/10">
                  <Rocket className="w-7 h-7" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">
                  PILLAR 02
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Our Mission
              </h3>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
                Develop accessible and cost-effective technologies that make modern farming possible for every farmer.
              </p>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-techCyan">
                  <Check className="w-4 h-4 text-techCyan" />
                  <span>Affordable IoT Hardware & AI Algorithms</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-techCyan">
                  <Check className="w-4 h-4 text-techCyan" />
                  <span>Local Language Voice Assistance for Regional Farmers</span>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
