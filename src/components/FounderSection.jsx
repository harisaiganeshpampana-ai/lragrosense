import React from 'react';
import { Linkedin, GraduationCap, Award, Lightbulb, Sparkles, ArrowUpRight, HeartHandshake } from 'lucide-react';

export default function FounderSection() {
  return (
    <section id="founder" className="py-24 bg-obsidian-900/90 border-t border-slate-800/80 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
            <GraduationCap className="w-3.5 h-3.5 text-agri-400" />
            <span>Leadership</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Meet Our <span className="gradient-text-agri">Founder</span>
          </h2>
          <p className="text-base text-slate-300">
            Driven by a passion for agricultural science and technological innovation.
          </p>
        </div>

        {/* Founder Card Container */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 sm:p-12 border border-agri-500/30 relative overflow-hidden shadow-2xl">
            
            {/* Glow Background */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-agri-500/15 via-transparent to-transparent rounded-full blur-2xl pointer-events-none" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Founder Image Column */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-agri-500 to-techCyan opacity-50 blur-lg group-hover:opacity-80 transition duration-300" />
                  <div className="relative w-56 h-56 sm:w-64 sm:h-64 rounded-2xl overflow-hidden border-2 border-agri-500/40 shadow-xl bg-slate-900">
                    <img
                      src="/assets/founder_portrait.jpg"
                      alt="Pampana Hari Sai Ganesh - Founder LR AgroSense"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-agri-500/15 text-agri-300 text-xs font-bold border border-agri-500/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-agri-400" /> B.Sc. Agriculture Student
                  </span>
                </div>
              </div>

              {/* Founder Details Column */}
              <div className="md:col-span-7 space-y-6 text-center md:text-left">
                
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Pampana Hari Sai Ganesh
                  </h3>
                  <p className="text-agri-400 font-semibold text-base mt-1">
                    Founder & Chief Agritech Officer, LR AgroSense
                  </p>
                </div>

                <p className="text-base text-slate-300 leading-relaxed">
                  Founder of LR AgroSense and B.Sc. Agriculture student focused on building innovative solutions that help farmers through technology, AI, and IoT.
                </p>

                {/* Key Highlights */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Grassroots Research</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Combining agronomic field science with modern IoT telemetry.</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-left flex items-start gap-3">
                    <HeartHandshake className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-white">Farmer-First Vision</h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">Ensuring solutions remain accessible & highly affordable.</p>
                    </div>
                  </div>
                </div>

                {/* Social Button */}
                <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-4">
                  <a
                    href="https://www.linkedin.com/in/lragrosense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] text-white font-bold text-sm shadow-lg shadow-[#0A66C2]/20 transition-all duration-300 flex items-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Linkedin className="w-4 h-4 fill-white" />
                    <span>Connect on LinkedIn</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>

              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
