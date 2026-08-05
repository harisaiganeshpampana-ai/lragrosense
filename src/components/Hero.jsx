import React, { useState, useEffect } from 'react';
import { ArrowRight, Cpu, Radio, ShieldCheck, Activity, Droplets, Thermometer, Sparkles, CheckCircle2 } from 'lucide-react';

export default function Hero() {
  const [telemetry, setTelemetry] = useState({
    moisture: 48,
    ph: 6.8,
    temp: 27.5,
    humidity: 65,
    npkStatus: 'Optimal (14-14-14)',
    status: 'Healthy Soil Ecosystem'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry({
        moisture: +(45 + Math.random() * 6).toFixed(1),
        ph: +(6.7 + Math.random() * 0.3).toFixed(2),
        temp: +(27 + Math.random() * 1.5).toFixed(1),
        humidity: +(64 + Math.random() * 4).toFixed(0),
        npkStatus: 'Optimal (14-14-14)',
        status: 'Healthy Soil Ecosystem'
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-obsidian-950">
      
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/agri_hero_bg.jpg"
          alt="Smart Agriculture Field Background"
          className="w-full h-full object-cover opacity-25 scale-105 filter contrast-125 saturate-150"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950 via-obsidian-950/80 to-transparent" />
        <div className="absolute inset-0 bg-radial-glow opacity-80" />
      </div>

      {/* Decorative Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#16a34a10_1px,transparent_1px),linear-gradient(to_bottom,#16a34a10_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            
            {/* Startup Tag Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wide shadow-lg shadow-agri-500/10">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agri-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-agri-500"></span>
              </span>
              <span>Next-Gen Agritech Startup</span>
              <span className="text-slate-600">•</span>
              <span className="text-white">Smart Farming • AI • IoT</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              Empowering Farmers Through{' '}
              <span className="gradient-text-agri">Affordable AI & IoT</span> Solutions
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              LR AgroSense is building smart farming technologies that help farmers reduce crop losses, optimize resources, and make data-driven decisions.
            </p>

            {/* Feature Bullets */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-sm font-medium text-slate-300">
              <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>Real-Time Soil Telemetry</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>AI Crop Insights</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/60 px-3.5 py-1.5 rounded-lg border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-agri-400" />
                <span>Local Voice Alerts</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#about"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-agri-500 via-agri-600 to-emerald-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-base shadow-xl shadow-agri-500/25 hover:shadow-agri-500/40 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
              >
                <span>Learn More</span>
                <ArrowRight className="w-5 h-5" />
              </a>

              <a
                href="#contact"
                className="w-full sm:w-auto px-8 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-agri-500/50 text-white font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                <span>Contact Us</span>
              </a>

              <a
                href="#smart-monitor"
                className="w-full sm:w-auto px-6 py-4 rounded-xl bg-agri-500/10 hover:bg-agri-500/20 border border-agri-500/30 text-agri-300 font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-agri-400 animate-pulse" />
                <span>Try Live Demo</span>
              </a>
            </div>

          </div>

          {/* Right Column: Live IoT Telemetry Card Widget */}
          <div className="lg:col-span-5">
            <div className="relative">
              
              {/* Outer Glow */}
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-agri-500 to-techCyan opacity-30 blur-xl animate-pulse-glow" />

              {/* Glass Widget Box */}
              <div className="relative glass-panel rounded-3xl p-6 sm:p-8 border border-agri-500/30 shadow-2xl shadow-black/80 space-y-6">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-agri-500/20 text-agri-400">
                      <Radio className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-white">Smart Farm Monitor</h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-agri-400"></span> Live Telemetry • Node #AG-04
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md bg-agri-500/20 text-agri-300 border border-agri-500/30 text-xs font-mono font-bold">
                    ONLINE
                  </span>
                </div>

                {/* Main Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  
                  {/* Moisture */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-agri-500/40 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                      <span>Soil Moisture</span>
                      <Droplets className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-white">
                      {telemetry.moisture}<span className="text-sm font-normal text-slate-400">%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                        style={{ width: `${telemetry.moisture}%` }}
                      />
                    </div>
                  </div>

                  {/* Soil pH */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-agri-500/40 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                      <span>Soil pH</span>
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-white">
                      {telemetry.ph}
                    </div>
                    <p className="text-[11px] text-emerald-400 mt-2 font-medium">
                      Ideal for Wheat & Cotton
                    </p>
                  </div>

                  {/* Temperature */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-agri-500/40 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                      <span>Temperature</span>
                      <Thermometer className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold font-display text-white">
                      {telemetry.temp}<span className="text-sm font-normal text-slate-400">°C</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2 font-medium">
                      Hum: {telemetry.humidity}%
                    </p>
                  </div>

                  {/* NPK Sensor */}
                  <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-agri-500/40 transition-colors">
                    <div className="flex items-center justify-between text-slate-400 text-xs font-medium mb-1">
                      <span>NPK Ratio</span>
                      <Cpu className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-base font-bold font-display text-white truncate">
                      Optimal
                    </div>
                    <p className="text-[11px] text-purple-300 mt-2 font-medium">
                      N:P:K balanced
                    </p>
                  </div>

                </div>

                {/* AI Advisory Banner */}
                <div className="p-3.5 rounded-xl bg-agri-950/80 border border-agri-500/40 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-agri-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-agri-300">LR AI AgroSense Advisory</h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Soil health status is optimal. Irrigation scheduled in 4 hours based on forecast.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
