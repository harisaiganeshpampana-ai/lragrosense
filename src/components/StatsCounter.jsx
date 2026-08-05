import React from 'react';
import { Droplets, TrendingUp, ShieldAlert, Zap, Globe2 } from 'lucide-react';

export default function StatsCounter() {
  const stats = [
    {
      id: 1,
      icon: Droplets,
      value: '40%+',
      label: 'Water Saved',
      description: 'Optimized irrigation based on precision soil moisture data',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/20',
    },
    {
      id: 2,
      icon: ShieldAlert,
      value: '25%+',
      label: 'Crop Losses Prevented',
      description: 'Early disease & nutrient deficiency alerts via AI telemetry',
      color: 'text-agri-400',
      bgColor: 'bg-agri-500/10 border-agri-500/20',
    },
    {
      id: 3,
      icon: TrendingUp,
      value: '30%+',
      label: 'Yield Improvement',
      description: 'Data-driven fertilizer application & soil health management',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      id: 4,
      icon: Zap,
      value: '< 1s',
      label: 'Real-Time Mobile Alerts',
      description: 'Instant notification on mobile app & local voice broadcasts',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <section className="py-16 bg-obsidian-900/60 border-y border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-agri-500/30 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl border ${stat.bgColor} ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-agri-400 transition-colors">
                    Impact Metric
                  </span>
                </div>
                <div className={`text-4xl font-extrabold font-display ${stat.color} tracking-tight mb-1`}>
                  {stat.value}
                </div>
                <div className="text-base font-bold text-white mb-2">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
