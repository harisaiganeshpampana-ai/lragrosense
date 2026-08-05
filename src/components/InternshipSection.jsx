import React, { useState } from 'react';
import { Briefcase, ArrowRight, CheckCircle2, Sparkles, X, Send, AlertTriangle, ShieldCheck, FileText, Info } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function InternshipSection({ onOpenTerms }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    college: '',
    domain: 'Agritech & AI',
    resumeText: ''
  });

  const domains = [
    { title: 'Agritech & AI', desc: 'Develop predictive soil models & IoT telemetry algorithms.' },
    { title: 'Agriculture Science', desc: 'Agronomic field testing & soil health sensor validation.' },
    { title: 'Research & Innovation', desc: 'Literature review, sensor benchmarking & prototyping.' },
    { title: 'Content Creation & Media', desc: 'Farmer storytelling, educational media & outreach.' },
    { title: 'Startup Building', desc: 'Operations, ecosystem research & investor readiness.' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreedTerms) {
      alert('Please accept the Terms & Conditions (No Stipend & Live Certificate Agreement) to submit.');
      return;
    }

    // Calculate AI Match Score based on resume relevance
    let score = 82;
    const resText = (formData.resumeText + ' ' + formData.course).toLowerCase();
    if (resText.includes('agri') || resText.includes('bsc') || resText.includes('soil')) score += 10;
    if (resText.includes('tech') || resText.includes('python') || resText.includes('ai') || resText.includes('code')) score += 6;
    score = Math.min(score, 98);

    const newApplicant = {
      id: 'APP-' + Math.floor(1000 + Math.random() * 9000),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      course: formData.course,
      college: formData.college,
      domain: formData.domain,
      resume: formData.resumeText || 'Submitted resume statement.',
      score: score,
      recommendation: score > 90 ? 'Strong Fit' : 'Good Fit',
      skills: [formData.domain, formData.course || 'Agri Science'],
      status: 'Under Review',
      date: new Date().toISOString().split('T')[0]
    };

    // Save candidate submission to localStorage for Founder Admin Dashboard
    const saved = localStorage.getItem('lr_agrosense_applicants');
    let applicants = [];
    if (saved) {
      try {
        applicants = JSON.parse(saved);
      } catch (err) {
        applicants = [];
      }
    }
    applicants.unshift(newApplicant);
    localStorage.setItem('lr_agrosense_applicants', JSON.stringify(applicants));

    setAiScore(score);
    setSubmitted(true);

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      // ignore
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setModalOpen(false);
    setAgreedTerms(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      course: '',
      college: '',
      domain: 'Agritech & AI',
      resumeText: ''
    });
  };

  return (
    <section id="internship" className="py-24 bg-obsidian-900/90 border-t border-slate-800 relative overflow-hidden">
      
      {/* Background Lighting */}
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
            <span>Student Career Opportunities</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Join Our <span className="gradient-text-agri">Mission</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-300">
            LR AgroSense welcomes students interested in Agritech, Agriculture, Research, Innovation, Content Creation, and Startup Building.
          </p>
        </div>

        {/* 5 Domains Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {domains.map((d, index) => (
            <div
              key={index}
              className="glass-panel rounded-2xl p-6 border border-slate-800 hover:border-emerald-500/40 transition-colors space-y-3"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono">
                DOMAIN {index + 1}
              </span>
              <h3 className="text-lg font-bold text-white">{d.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{d.desc}</p>
            </div>
          ))}

          {/* CTA Box */}
          <div className="glass-panel rounded-2xl p-6 border border-emerald-500/40 bg-gradient-to-br from-emerald-950/80 to-slate-900 flex flex-col justify-between">
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase">
                APPLY TODAY
              </span>
              <h3 className="text-lg font-bold text-white">Start Your Journey</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Work closely with Founder Pampana Hari Sai Ganesh & gain hands-on experience in agritech innovation.
              </p>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
            >
              Apply for Internship
            </button>
          </div>
        </div>

        {/* Policy Disclaimers Banner */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed">
              <strong className="text-white block mb-0.5">Important Student Disclaimers:</strong>
              Early-stage unregistered startup • Unpaid internship (No stipend provided) • <strong>Live Certificate of Completion & Offer Letter</strong> issued upon internship completion.
            </div>
          </div>
          <button
            onClick={onOpenTerms}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-amber-300 text-xs font-bold shrink-0 hover:border-amber-500/40"
          >
            Read Terms & Conditions
          </button>
        </div>

      </div>

      {/* Internship Application Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-slate-950 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            
            {/* Close Button */}
            <button
              onClick={handleReset}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8 space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-white">Application Received!</h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Thank you, <span className="text-emerald-400 font-bold">{formData.name}</span>! Your profile has been submitted directly to Founder Pampana Hari Sai Ganesh.
                  </p>
                </div>

                {/* Instant AI Evaluation Result */}
                <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-left space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                    <span>🤖 AI Resume Screener Evaluation:</span>
                    <span className="text-sm font-extrabold">{aiScore}% Match</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Your background in <strong>{formData.course || formData.domain}</strong> shows strong potential for LR AgroSense's agritech mission!
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <span>Apply for LR AgroSense Internship</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Fill in your details for AI resume evaluation and founder review.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Phone / WhatsApp *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 9876543210"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">Current Pursuing Course *</label>
                      <input
                        type="text"
                        required
                        value={formData.course}
                        onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                        placeholder="e.g. B.Sc. Agriculture, B.Tech CSE, MBA"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-300 block mb-1">College / University Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.college}
                        onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                        placeholder="e.g. ANGRAU / TNAU / University"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Domain of Interest *</label>
                    <select
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                    >
                      <option value="Agritech & AI">Agritech & AI</option>
                      <option value="Agriculture Science">Agriculture Science</option>
                      <option value="Research & Innovation">Research & Innovation</option>
                      <option value="Content Creation">Content Creation</option>
                      <option value="Startup Building">Startup Building</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-300 block mb-1">Paste Resume Summary / Skills Statement *</label>
                    <textarea
                      rows="3"
                      required
                      value={formData.resumeText}
                      onChange={(e) => setFormData({ ...formData, resumeText: e.target.value })}
                      placeholder="Paste your key skills, coursework, past projects, or resume summary for AI screening..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white outline-none focus:border-emerald-400"
                    ></textarea>
                  </div>

                  {/* Terms & Disclaimers Checkbox */}
                  <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                    <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-300">
                      <input
                        type="checkbox"
                        required
                        checked={agreedTerms}
                        onChange={(e) => setAgreedTerms(e.target.checked)}
                        className="mt-0.5 accent-emerald-500 rounded cursor-pointer"
                      />
                      <span>
                        I understand LR AgroSense is an early-stage pre-registration agritech startup. I acknowledge this is an <strong>unpaid internship (no stipend)</strong> and I will receive a <strong>Verified Live Certificate of Completion</strong> upon successful internship completion.
                      </span>
                    </label>
                  </div>

                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit & Run AI Resume Screening</span>
                </button>
              </form>
            )}

          </div>
        </div>
      )}

    </section>
  );
}
