import React, { useState, useEffect } from 'react';
import { Sprout, Menu, X, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Navbar({ onOpenInternship }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Vision & Mission', href: '#vision-mission' },
    { name: 'Smart Monitor', href: '#smart-monitor' },
    { name: 'Founder', href: '#founder' },
    { name: 'Why Us', href: '#why-us' },
    { name: 'Internships', href: '#internship' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-950/90 backdrop-blur-md py-3 border-b border-agri-500/20 shadow-lg shadow-black/50'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-agri-500 to-agri-700 flex items-center justify-center shadow-lg shadow-agri-500/20 group-hover:scale-105 transition-transform duration-300">
              <Sprout className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-extrabold text-xl tracking-tight text-white group-hover:text-agri-400 transition-colors">
                  LR AgroSense
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-agri-500/20 text-agri-400 border border-agri-500/30 rounded-full">
                  Startup
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                Smart Farming • AI • IoT
              </p>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-slate-300 hover:text-agri-400 transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-agri-400 hover:after:w-full after:transition-all"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-4">
            <a
              href="#contact"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-sm shadow-md shadow-agri-500/20 hover:shadow-agri-500/40 transition-all duration-300 flex items-center gap-1.5 transform hover:-translate-y-0.5"
            >
              <span>Get in Touch</span>
              <ArrowUpRight className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-agri-500/30 px-6 py-6 mt-2 space-y-4 animate-in slide-in-from-top duration-300">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-base font-semibold text-slate-200 hover:text-agri-400 transition-colors py-2 border-b border-slate-800/60"
              >
                {link.name}
              </a>
            ))}
          </div>
          <div className="pt-2">
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 text-slate-950 font-bold text-center block text-sm shadow-lg shadow-agri-500/20"
            >
              Get in Touch
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
