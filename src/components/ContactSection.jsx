import React, { useState } from 'react';
import { Mail, Linkedin, Send, MapPin, CheckCircle2, MessageSquare, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ContactSection() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry / Pilot Partner',
    message: ''
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      // ignore
    }
  };

  return (
    <section id="contact" className="py-24 bg-obsidian-950 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-agri-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-500/10 border border-agri-500/30 text-agri-300 text-xs font-semibold tracking-wider uppercase">
            <Mail className="w-3.5 h-3.5 text-agri-400" />
            <span>Connect With Us</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Get in <span className="gradient-text-agri">Touch</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            Whether you are an investor, mentor, partner farmer, or agritech enthusiast—we’d love to connect.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Direct Contact Info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-8 border border-agri-500/30 space-y-8 bg-slate-900/80">
              
              <div>
                <h3 className="text-xl font-bold text-white mb-2">LR AgroSense Contact Info</h3>
                <p className="text-xs text-slate-400">
                  Reach out directly via email or connect on LinkedIn for partnerships.
                </p>
              </div>

              {/* Email Card */}
              <a
                href="mailto:lragrosense@gmail.com"
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-agri-500/40 transition-colors flex items-center gap-4 group"
              >
                <div className="p-3.5 rounded-xl bg-agri-500/10 text-agri-400 group-hover:scale-110 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Official Email
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-agri-300 transition-colors">
                    lragrosense@gmail.com
                  </span>
                </div>
              </a>

              {/* LinkedIn Card */}
              <a
                href="https://www.linkedin.com/in/lragrosense"
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-[#0A66C2]/40 transition-colors flex items-center gap-4 group"
              >
                <div className="p-3.5 rounded-xl bg-[#0A66C2]/20 text-[#0A66C2] group-hover:scale-110 transition-transform">
                  <Linkedin className="w-6 h-6 fill-[#0A66C2]" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    LinkedIn Network
                  </span>
                  <span className="text-sm sm:text-base font-bold text-white group-hover:text-sky-300 transition-colors">
                    linkedin.com/in/lragrosense
                  </span>
                </div>
              </a>

              {/* Startup Hub Location */}
              <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center gap-4">
                <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                    Focus Region
                  </span>
                  <span className="text-sm font-bold text-white">
                    Andhra Pradesh & Telangana, India
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Interactive Contact Form */}
          <div className="lg:col-span-7">
            <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-slate-800 relative bg-slate-900/60 shadow-2xl">
              
              {sent ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-agri-500/20 border border-agri-500 text-agri-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-300 max-w-md mx-auto">
                    Thank you for reaching out to LR AgroSense. We will get back to you at <span className="text-agri-400 font-semibold">{formState.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-xs font-bold hover:bg-slate-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  
                  <div>
                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-agri-400" />
                      <span>Send a Message</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Fill out the form below to connect directly with the founder and team.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Ramesh Kumar"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-agri-400 outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="ramesh@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-agri-400 outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Subject</label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-agri-400 outline-none transition-colors"
                    >
                      <option value="General Inquiry / Pilot Partner">General Inquiry / Pilot Partner</option>
                      <option value="Investor Inquiry">Investor / Mentor Inquiry</option>
                      <option value="Internship Question">Internship Question</option>
                      <option value="Product Pre-order">Product Demo / Pre-order</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">Your Message *</label>
                    <textarea
                      rows="4"
                      required
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      placeholder="Write your message or inquiry here..."
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-white text-sm focus:border-agri-400 outline-none transition-colors"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-agri-500 to-agri-600 hover:from-agri-400 hover:to-agri-500 text-slate-950 font-bold text-sm shadow-xl shadow-agri-500/20 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message to LR AgroSense</span>
                  </button>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
