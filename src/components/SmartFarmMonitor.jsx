import React, { useState } from 'react';
import {
  Droplets,
  Activity,
  Cpu,
  Thermometer,
  CloudRain,
  Smartphone,
  Volume2,
  BarChart3,
  TrendingUp,
  ShieldCheck,
  Zap,
  CheckCircle,
  Play,
  VolumeX,
  Sparkles,
  Sliders
} from 'lucide-react';

export default function SmartFarmMonitor() {
  const [selectedCrop, setSelectedCrop] = useState('Paddy (Rice)');
  const [simulatedMoisture, setSimulatedMoisture] = useState(38);
  const [simulatedPH, setSimulatedPH] = useState(6.2);
  const [simulatedTemp, setSimulatedTemp] = useState(31);
  const [activeLang, setActiveLang] = useState('Telugu');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const features = [
    {
      title: 'Soil Moisture Monitoring',
      desc: 'High-accuracy dielectric sensors measure root-zone volumetric water content continuously.',
      icon: Droplets,
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10 border-cyan-500/20'
    },
    {
      title: 'Soil pH Monitoring',
      desc: 'Real-time soil acidity & alkalinity tracking for optimized fertilizer absorption.',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20'
    },
    {
      title: 'NPK Monitoring',
      desc: 'Smart Nitrogen, Phosphorus, and Potassium nutrient level estimation to eliminate guesswork.',
      icon: Cpu,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10 border-purple-500/20'
    },
    {
      title: 'Temperature Tracking',
      desc: 'Ambient and subterranean temperature sensor logging to protect crops from heat stress.',
      icon: Thermometer,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20'
    },
    {
      title: 'Humidity Monitoring',
      desc: 'Atmospheric micro-climate relative humidity tracking for pest & fungal outbreak prediction.',
      icon: CloudRain,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10 border-blue-500/20'
    },
    {
      title: 'Mobile Alerts',
      desc: 'Push notifications delivered directly to the farmer\'s smartphone for critical soil conditions.',
      icon: Smartphone,
      color: 'text-agri-400',
      bg: 'bg-agri-500/10 border-agri-500/20'
    },
    {
      title: 'Local Language Voice Notifications',
      desc: 'Spoken voice alerts in regional languages so every farmer can take instant action without barrier.',
      icon: Volume2,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20'
    },
    {
      title: 'Real-Time Data Insights',
      desc: 'AI dashboard visualizing historic trends, predictive irrigation schedules, and yield forecasts.',
      icon: BarChart3,
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20'
    }
  ];

  const benefits = [
    {
      title: 'Reduce Crop Losses',
      desc: 'Prevent drought stress and crop disease through early automated warnings.',
      icon: ShieldCheck,
      stat: 'Up to 25% Loss Reduction'
    },
    {
      title: 'Save Water',
      desc: 'Irrigate only when and where required, cutting pump power & water usage drastically.',
      icon: Droplets,
      stat: 'Save 40%+ Water'
    },
    {
      title: 'Improve Yield',
      desc: 'Maintain optimal soil pH and balanced NPK nutrients for healthier, fuller harvests.',
      icon: TrendingUp,
      stat: '+30% Harvest Yield'
    },
    {
      title: 'Better Decision Making',
      desc: 'Shift from traditional guessing to actionable, science-based agricultural insights.',
      icon: Zap,
      stat: '24/7 AI Guidance'
    }
  ];

  // Local Language Voice Messages
  const voiceAlerts = {
    Telugu: 'నమస్కారం! మీ పొలంలో నేల తేమ 38% కి పడిపోయింది. దయచేసి నీటి పారుదల ప్రారంభించండి.',
    Hindi: 'नमस्ते! आपके खेत में मिट्टी की नमी 38% तक गिर गई है। कृपया तुरंत सिंचाई शुरू करें।',
    English: 'Alert! Soil moisture level in Field #1 has dropped to 38%. Irrigation recommended now.',
    Tamil: 'வணக்கம்! உங்கள் வயலில் மண் ஈரப்பதம் 38% ஆக குறைந்துள்ளது. பாசனத்தை தொடங்கவும்.',
    Kannada: 'ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಮೀನಿನಲ್ಲಿ ಮಣ್ಣಿನ ತೇವಾಂಶ 38% ಕ್ಕೆ ಕುಸಿದಿದೆ. ದಯವಿಟ್ಟು ನೀರಾವರಿ ಪ್ರಾರಂಭಿಸಿ.'
  };

  const handlePlayVoiceAlert = () => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    const textToSpeak = voiceAlerts[activeLang];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);

    // Set voice language hint
    if (activeLang === 'Telugu') utterance.lang = 'te-IN';
    else if (activeLang === 'Hindi') utterance.lang = 'hi-IN';
    else if (activeLang === 'Tamil') utterance.lang = 'ta-IN';
    else if (activeLang === 'Kannada') utterance.lang = 'kn-IN';
    else utterance.lang = 'en-US';

    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  return (
    <section id="smart-monitor" className="py-24 bg-obsidian-950 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/3 right-0 w-96 h-96 bg-agri-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-techCyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
            <Cpu className="w-3.5 h-3.5 text-agri-400" />
            <span>Product Highlights</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Smart Farm <span className="gradient-text-agri">Monitor</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            An end-to-end IoT sensor suite paired with actionable AI telemetry to give farmers complete control over soil and crop health.
          </p>
        </div>

        {/* 8 Feature Cards Grid */}
        <div>
          <h3 className="text-xl font-bold text-slate-200 mb-8 flex items-center gap-2 border-l-4 border-agri-500 pl-3">
            <span>Key IoT & AI Capabilities</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-slate-800 flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className={`p-3.5 rounded-xl border w-fit ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white tracking-tight group-hover:text-agri-300 transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Interactive IoT & Local Language Demo Box */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-agri-500/40 relative bg-slate-900/90 shadow-2xl">
          <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-agri-500 to-techCyan text-slate-950 text-xs font-extrabold uppercase tracking-wider shadow-lg flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
            <span>Interactive Live Demo</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Simulator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h4 className="text-2xl font-extrabold text-white flex items-center gap-2">
                  <Sliders className="w-6 h-6 text-agri-400" />
                  <span>Soil Telemetry Simulator</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust simulated parameters to experience real-time AI warnings & voice broadcasts.
                </p>
              </div>

              {/* Crop Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Active Crop Type:</label>
                <div className="flex flex-wrap gap-2">
                  {['Paddy (Rice)', 'Wheat', 'Cotton', 'Chilli / Spices', 'Vegetables'].map((crop) => (
                    <button
                      key={crop}
                      onClick={() => setSelectedCrop(crop)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        selectedCrop === crop
                          ? 'bg-agri-500 text-slate-950 shadow-md shadow-agri-500/20'
                          : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                      }`}
                    >
                      {crop}
                    </button>
                  ))}
                </div>
              </div>

              {/* Moisture Slider */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Droplets className="w-4 h-4 text-cyan-400" /> Soil Moisture
                  </span>
                  <span className={simulatedMoisture < 40 ? 'text-amber-400' : 'text-agri-400'}>
                    {simulatedMoisture}% ({simulatedMoisture < 40 ? 'Low Moisture Alert' : 'Optimal'})
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="80"
                  value={simulatedMoisture}
                  onChange={(e) => setSimulatedMoisture(Number(e.target.value))}
                  className="w-full accent-agri-400 cursor-pointer"
                />
              </div>

              {/* pH Slider */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-400" /> Soil pH Level
                  </span>
                  <span className="text-emerald-400">{simulatedPH} pH</span>
                </div>
                <input
                  type="range"
                  min="5.0"
                  max="8.5"
                  step="0.1"
                  value={simulatedPH}
                  onChange={(e) => setSimulatedPH(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

            </div>

            {/* Local Voice Alert Simulator */}
            <div className="lg:col-span-6 space-y-6 bg-slate-950/80 p-6 rounded-2xl border border-slate-800">
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-6 h-6 text-rose-400 animate-pulse" />
                  <h4 className="text-lg font-bold text-white">Local Language Voice Broadcast</h4>
                </div>
                <span className="text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30">
                  AUDIO SYNTH
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                LR AgroSense converts complex soil telemetry into immediate spoken alerts in local dialects so non-literate or busy farmers receive timely warnings.
              </p>

              {/* Language Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                {['Telugu', 'Hindi', 'English', 'Tamil', 'Kannada'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      activeLang === lang
                        ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              {/* Spoken Text Box */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs font-medium text-slate-200 space-y-2">
                <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                  Generated {activeLang} Voice Alert:
                </div>
                <p className="italic text-agri-300 text-sm">
                  "{voiceAlerts[activeLang]}"
                </p>
              </div>

              {/* Audio Play Button */}
              <button
                onClick={handlePlayVoiceAlert}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 shadow-lg ${
                  isSpeaking
                    ? 'bg-rose-600 text-white animate-pulse'
                    : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white shadow-rose-500/25'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5" />
                    <span>Broadcasting Alert...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Test Voice Alert ({activeLang})</span>
                  </>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* Benefits Grid (4 Cards) */}
        <div>
          <h3 className="text-xl font-bold text-slate-200 mb-8 flex items-center gap-2 border-l-4 border-agri-500 pl-3">
            <span>Direct Benefits to Farmers</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="glass-panel glass-panel-hover rounded-2xl p-6 border border-agri-500/20 relative flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-xl bg-agri-500/10 text-agri-400 border border-agri-500/20 w-fit group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-white">{benefit.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{benefit.desc}</p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-800">
                    <span className="text-xs font-bold text-agri-400 bg-agri-500/10 px-2.5 py-1 rounded-md border border-agri-500/20">
                      {benefit.stat}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
