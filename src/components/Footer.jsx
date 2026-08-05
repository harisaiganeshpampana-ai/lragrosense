import React from 'react';
import { Sprout, Linkedin, Mail, Heart, ArrowUp, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-obsidian-950 border-t border-slate-800 text-slate-400 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center shadow-lg shadow-agri-500/20">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                  LR AgroSense
                </span>
                <p className="text-xs font-semibold text-agri-400">
                  Smart Farming • AI • IoT
                </p>
              </div>
            </a>

            <p className="text-sm text-slate-300 max-w-sm leading-relaxed">
              Empowering Farmers Through Technology. Building accessible, cost-effective AI and IoT solutions to optimize crop health and save natural resources.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="mailto:lragrosense@gmail.com"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-agri-400 hover:border-agri-500/40 flex items-center justify-center transition-colors"
                aria-label="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>

              <a
                href="https://www.linkedin.com/in/lragrosense"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-[#0A66C2] hover:border-[#0A66C2]/40 flex items-center justify-center transition-colors"
                aria-label="LinkedIn Page"
              >
                <Linkedin className="w-4 h-4 fill-current" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Quick Links</h4>
            <ul className="space-y-2 text-xs font-medium">
              <li><a href="#about" className="hover:text-agri-400 transition-colors">About LR AgroSense</a></li>
              <li><a href="#vision-mission" className="hover:text-agri-400 transition-colors">Vision & Mission</a></li>
              <li><a href="#smart-monitor" className="hover:text-agri-400 transition-colors">Smart Farm Monitor</a></li>
              <li><a href="#founder" className="hover:text-agri-400 transition-colors">Founder Profile</a></li>
              <li><a href="#why-us" className="hover:text-agri-400 transition-colors">Why Choose Us</a></li>
              <li><a href="#internship" className="hover:text-agri-400 transition-colors">Careers & Internships</a></li>
            </ul>
          </div>

          {/* Col 3: Legal & Tagline */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">Startup Vision</h4>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
              <p className="font-semibold text-agri-400">🌱 Early-Stage Agritech Innovation</p>
              <p>Founded by Pampana Hari Sai Ganesh (B.Sc. Agriculture Student) to bridge technology and grassroots farming.</p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>© {new Date().getFullYear()} LR AgroSense. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Smart Farming • AI • IoT</span>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-agri-500/40 transition-colors flex items-center gap-1"
            >
              <ArrowUp className="w-4 h-4" />
              <span className="hidden sm:inline">Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
