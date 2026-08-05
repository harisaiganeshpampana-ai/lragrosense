import React from 'react';
import { X, ShieldCheck, Info, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function TermsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-slate-950 shadow-2xl space-y-6 max-h-[85vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          aria-label="Close Terms Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" /> Official Policy & Terms
          </div>
          <h3 className="text-2xl font-extrabold text-white">Terms & Conditions - Student Internship</h3>
          <p className="text-xs text-slate-400">
            Please read the following guidelines and disclaimers before submitting your application to LR AgroSense.
          </p>
        </div>

        {/* Policy Points */}
        <div className="space-y-4 text-xs text-slate-300 leading-relaxed">
          
          {/* Point 1: Startup Status */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-amber-400">
              <AlertTriangle className="w-4 h-4" />
              <span>1. Early-Stage & Pre-Registration Disclaimer</span>
            </div>
            <p className="text-slate-300">
              LR AgroSense is an early-stage Agritech startup initiative founded by Pampana Hari Sai Ganesh (B.Sc. Agriculture student). The startup is currently operating in the pre-registration development phase.
            </p>
          </div>

          {/* Point 2: Unpaid Internship */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-rose-400">
              <Info className="w-4 h-4" />
              <span>2. Unpaid Internship (No Stipend)</span>
            </div>
            <p className="text-slate-300">
              All student internships and research positions at LR AgroSense are purely educational and voluntary. <strong>No financial stipend or monetary compensation will be provided.</strong>
            </p>
          </div>

          {/* Point 3: Live Certificate */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>3. Verified Live Certificate of Completion</span>
            </div>
            <p className="text-slate-300">
              Upon successful completion of the internship tenure and assigned project deliverables, students will be awarded a <strong>Verified Live Certificate of Completion</strong>, an Official Offer Letter, and a Recommendation Letter signed by Founder Pampana Hari Sai Ganesh.
            </p>
          </div>

          {/* Point 4: Data Privacy */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
            <div className="flex items-center gap-2 font-bold text-cyan-400">
              <FileText className="w-4 h-4" />
              <span>4. Data Privacy & Candidate Resume Screening</span>
            </div>
            <p className="text-slate-300">
              Information provided in the application form (Full Name, Phone/WhatsApp, Email, Course, College, Resume) will be analyzed by LR AgroSense's AI Candidate Screener exclusively for internship evaluation and will not be shared with third parties.
            </p>
          </div>

        </div>

        {/* Modal Action */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
          >
            I Understand & Agree
          </button>
        </div>

      </div>
    </div>
  );
}
