import React from 'react';
import { DollarSign, Users, BrainCircuit, Sprout, Smile, CheckCircle, Sparkles } from 'lucide-react';

export default function WhyAgroSense() {
  const points = [
    {
      title: 'Affordable Technology',
      desc: 'Engineered specifically for cost sensitivity, bringing precision sensors to smallholder and commercial farmers alike without heavy capital investments.',
      icon: DollarSign,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Farmer First Approach',
      desc: 'Designed alongside real farmers to solve actual field pain points—from regional voice notifications to simple one-tap mobile interfaces.',
      icon: Users,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'AI-Driven Innovation',
      desc: 'Smart machine learning models process soil moisture, pH, and micro-climate data to output actionable recommendations, not confusing graphs.',
      icon: BrainCircuit,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Sustainable Agriculture',
      desc: 'Reduces excessive chemical runoff and conserves water tables, creating healthier soil biology for future growing seasons.',
      icon: Sprout,
      color: 'text-agri-400',
      bg: 'bg-agri-500/10 border-agri-500/20',
    },
    {
      title: 'Easy To Use Solutions',
      desc: 'Plug-and-play hardware deployment with zero complicated setup. Install in soil within minutes and view instant telemetry.',
      icon: Smile,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section id="why-us" className="py-24 bg-obsidian-950 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-agri-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-agri-400" />
            <span>Competitive Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Why <span className="gradient-text-agri">LR AgroSense</span>?
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Building purpose-driven agritech hardware and software tailored for real impact on the farm floor.
          </p>
        </div>

        {/* 5 Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`glass-panel glass-panel-hover rounded-3xl p-8 border border-slate-800 flex flex-col justify-between group ${
                  index === 0 ? 'lg:col-span-1' : ''
                }`}
              >
                <div className="space-y-5">
                  <div className={`p-4 rounded-2xl border w-fit ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-agri-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs font-bold text-slate-400">
                  <CheckCircle className="w-4 h-4 text-agri-400" />
                  <span>Verified Advantage</span>
                </div>
              </div>
            );
          })}

          {/* Callout Box */}
          <div className="glass-panel glass-panel-hover rounded-3xl p-8 border border-agri-500/40 bg-gradient-to-br from-agri-950/80 to-obsidian-900 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-agri-500/20 text-agri-300 text-xs font-mono font-bold">
                READY TO COLLABORATE?
              </span>
              <h3 className="text-xl font-bold text-white">Partner with LR AgroSense</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                We are actively seeking strategic pitch sessions, mentor networks, university agricultural labs, and pilot farmers across India.
              </p>
            </div>

            <a
              href="#contact"
              className="mt-6 w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-center block text-xs tracking-wide shadow-md shadow-agri-500/20"
            >
              Get Connected
            </a>
          </div>

        </div>

      </div>
    </section>
  );
}
