import React from 'react';
import { Mail, Linkedin, Send } from 'lucide-react';

export default function ContactSection() {
  return (
    <section id="contact" className="py-24 bg-obsidian-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Get in Touch</h2>
          <p className="text-slate-300 text-sm">Connect directly with LR AgroSense for partnerships, investor queries, or pilot programs.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <h3 className="text-xl font-bold text-white">Official Contact Info</h3>
            
            <a href="mailto:lragrosense@gmail.com" className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 text-white hover:text-agri-400">
              <Mail className="w-6 h-6 text-agri-400" />
              <div>
                <span className="text-xs text-slate-400 block">Email Us</span>
                <span className="font-bold">lragrosense@gmail.com</span>
              </div>
            </a>

            <a href="https://www.linkedin.com/in/lragrosense" target="_blank" rel="noopener noreferrer" className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-4 text-white hover:text-sky-400">
              <Linkedin className="w-6 h-6 text-sky-400" />
              <div>
                <span className="text-xs text-slate-400 block">LinkedIn Profile</span>
                <span className="font-bold">linkedin.com/in/lragrosense</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
