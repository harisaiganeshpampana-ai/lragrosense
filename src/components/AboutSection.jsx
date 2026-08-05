import React from 'react';
import { Target, Leaf, Cpu, Waves, Sparkles, CheckCircle2 } from 'lucide-react';

export default function AboutSection() {
  const pillars = [
    {
      title: 'Improve Productivity',
      desc: 'Precision data analytics to maximize yield per acre.',
      icon: Leaf,
    },
    {
      title: 'Reduce Crop Losses',
      desc: 'Proactive early warning systems for moisture & soil stress.',
      icon: Target,
    },
    {
      title: 'Optimize Resources',
      desc: 'Smart irrigation & targeted fertilizer application.',
      icon: Waves,
    },
    {
      title: 'Sustainable Farming',
      desc: 'Eco-friendly practices that protect topsoil and conserve water.',
      icon: Cpu,
    },
  ];

  return (
    <section id="about" className="py-24 bg-obsidian-950 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              
              {/* Outer Border Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-agri-500 to-techCyan opacity-40 blur-xl group-hover:opacity-60 transition duration-500" />

              <div className="relative glass-panel rounded-3xl p-3 border border-agri-500/30 overflow-hidden shadow-2xl">
                <img
                  src="/assets/smart_sensor_device.jpg"
                  alt="LR AgroSense Hardware & IoT Sensor Node"
                  className="w-full h-[400px] object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 filter contrast-110"
                />
                
                {/* Floating Tag */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl glass-panel border border-agri-500/30 backdrop-blur-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-agri-500/20 text-agri-400 flex items-center justify-center font-bold">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Smart IoT Sensor Node</h4>
                      <p className="text-xs text-slate-300">Continuous soil moisture, pH & NPK telemetry</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Right Column: About Content */}
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
              <Leaf className="w-3.5 h-3.5 text-agri-400" />
              <span>About Us</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              Transforming Agriculture with <span className="gradient-text-agri">Accessible Tech</span>
            </h2>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              LR AgroSense is an early-stage Agritech startup dedicated to transforming agriculture through affordable AI and IoT solutions. Our mission is to help farmers improve productivity, reduce crop losses, optimize water and fertilizer usage, and promote sustainable farming practices.
            </p>

            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon;
                return (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-agri-500/40 transition-colors flex items-start gap-3"
                  >
                    <div className="p-2.5 rounded-lg bg-agri-500/10 text-agri-400 shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">{pillar.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{pillar.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
