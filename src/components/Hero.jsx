import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Radio, Activity, Droplets, Thermometer, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const [telemetry, setTelemetry] = useState({
    moisture: 48,
    ph: 6.8,
    temp: 27.5,
    humidity: 65,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        moisture: +(45 + Math.random() * 6).toFixed(1),
        ph: +(6.7 + Math.random() * 0.3).toFixed(2),
        temp: +(27 + Math.random() * 1.5).toFixed(1),
        humidity: +(64 + Math.random() * 4).toFixed(0),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wide">
              <span>Next-Gen Agritech Startup</span>
              <span className="text-slate-600">•</span>
              <span className="text-white">Smart Farming • AI • IoT</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Empowering Farmers Through{' '}
              <span className="gradient-text-agri">Affordable AI & IoT</span> Solutions
            </h1>

            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              LR AgroSense is building smart farming technologies that help farmers reduce crop losses, optimize resources, and make data-driven decisions.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a href="#about" className="px-8 py-4 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 text-slate-950 font-bold text-base flex items-center gap-2">
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#contact" className="px-8 py-4 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold text-base">
                <span>Contact Us</span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-agri-500/30 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <Radio className="w-5 h-5 text-agri-400 animate-pulse" />
                  <div>
                    <h3 className="font-bold text-white">Smart Farm Telemetry</h3>
                    <p className="text-xs text-slate-400">Node #AG-04 • LIVE</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Soil Moisture</span>
                  <div className="text-2xl font-bold text-white mt-1">{telemetry.moisture}%</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-xs text-slate-400">Soil pH</span>
                  <div className="text-2xl font-bold text-white mt-1">{telemetry.ph}</div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
