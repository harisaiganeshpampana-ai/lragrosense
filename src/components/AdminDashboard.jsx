import React, { useState, useEffect } from 'react';
import {
  Lock,
  UserCheck,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  Bot,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Send,
  LogOut,
  Phone,
  Mail
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [passError, setPassError] = useState(false);
  const [applicants, setApplicants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Sample default candidates + localStorage items
  const initialApplicants = [
    {
      id: 'APP-101',
      name: 'Ananya Verma',
      email: 'ananya.v@gmail.com',
      phone: '+91 9845123789',
      course: 'B.Sc. Agriculture (3rd Year)',
      college: 'TNAU Coimbatore',
      domain: 'Agriculture Science',
      resume: 'Pursuing B.Sc Ag with coursework in soil chemistry, plant pathology, and precision agronomy. Conducted field research on organic NPK fertilizers.',
      score: 95,
      recommendation: 'Strong Fit',
      skills: ['Soil Chemistry', 'Agronomy Fieldwork', 'Plant Pathology'],
      status: 'Shortlisted',
      date: '2026-08-02'
    },
    {
      id: 'APP-102',
      name: 'Rohan Kulkarni',
      email: 'rohan.k@tech.edu',
      phone: '+91 9712345678',
      course: 'B.Tech Computer Science',
      college: 'IIIT Hyderabad',
      domain: 'Agritech & AI',
      resume: 'Full-stack developer with experience in Python, IoT MQTT protocols, React, and Machine Learning models for plant disease image classification.',
      score: 92,
      recommendation: 'Strong Fit',
      skills: ['Python & ML', 'IoT MQTT Sensors', 'React.js'],
      status: 'Under Review',
      date: '2026-08-03'
    },
    {
      id: 'APP-103',
      name: 'Siddharth Rao',
      email: 'siddharth.rao@gmail.com',
      phone: '+91 9900112233',
      course: 'MBA Innovation & Entrepreneurship',
      college: 'IIM Visakhapatnam',
      domain: 'Startup Building',
      resume: 'MBA student focused on agritech market research, investor pitch decks, and rural supply chain logistics.',
      score: 88,
      recommendation: 'Good Fit',
      skills: ['Market Research', 'Pitch Decks', 'Rural Logistics'],
      status: 'Under Review',
      date: '2026-08-03'
    }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('lr_agrosense_applicants');
    if (saved) {
      try {
        setApplicants(JSON.parse(saved));
      } catch (err) {
        setApplicants(initialApplicants);
      }
    } else {
      setApplicants(initialApplicants);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (passcode === 'lragrosense2026' || passcode === 'admin') {
      setIsAuthenticated(true);
      setPassError(false);
    } else {
      setPassError(true);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = applicants.map((app) => (app.id === id ? { ...app, status: newStatus } : app));
    setApplicants(updated);
    localStorage.setItem('lr_agrosense_applicants', JSON.stringify(updated));
    if (selectedApplicant && selectedApplicant.id === id) {
      setSelectedApplicant({ ...selectedApplicant, status: newStatus });
    }
  };

  const handleAiQuestion = (e) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;

    const q = aiQuestion.toLowerCase();
    let reply = '';

    if (q.includes('agriculture') || q.includes('bsc') || q.includes('agri')) {
      const agCandidates = applicants.filter((a) => a.course.toLowerCase().includes('agri') || a.domain.includes('Agriculture'));
      reply = `I found ${agCandidates.length} candidate(s) with an Agriculture background: ${agCandidates.map((c) => `${c.name} (${c.college}, Score: ${c.score}%)`).join('; ')}. Recommended for field trial testing!`;
    } else if (q.includes('top') || q.includes('best') || q.includes('score')) {
      const top = [...applicants].sort((a, b) => b.score - a.score)[0];
      reply = `Top candidate is ${top.name} with a ${top.score}% match score for ${top.domain}. Key skills: ${top.skills.join(', ')}.`;
    } else if (q.includes('ai') || q.includes('tech') || q.includes('coder')) {
      const techCandidates = applicants.filter((a) => a.domain.includes('Agritech') || a.course.toLowerCase().includes('tech'));
      reply = `I found ${techCandidates.length} candidate(s) in Agritech & AI: ${techCandidates.map((c) => `${c.name} (${c.course})`).join(', ')}.`;
    } else {
      reply = `Analyzed ${applicants.length} total applicant profiles. ${applicants.filter((a) => a.status === 'Shortlisted').length} candidates are currently Shortlisted. Would you like to review Agritech developers or B.Sc Agriculture students?`;
    }

    setAiResponse(reply);
    setAiQuestion('');
  };

  if (!isOpen) return null;

  const filteredApplicants = applicants.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.college.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDomain = domainFilter === 'All' || app.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-slate-950 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center font-bold text-white">
              👔
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
                <span>Founder Admin Portal</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold border border-emerald-500/30">
                  Pampana Hari Sai Ganesh
                </span>
              </h3>
              <p className="text-xs text-slate-400">AI Student Internship Applicant Screener & Dashboard</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Passcode Authentication Modal */}
        {!isAuthenticated ? (
          <div className="max-w-md mx-auto py-12 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-2xl font-bold text-white">Founder Authentication</h4>
              <p className="text-xs text-slate-400 mt-1">Enter your founder access code to view candidate applications and AI resume analysis.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="password"
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter Founder Passcode..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-white text-center text-sm focus:border-emerald-400 outline-none"
                />
                {passError && (
                  <p className="text-xs text-rose-400 mt-2 font-medium">Incorrect passcode. (Try passcode: lragrosense2026)</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20"
              >
                Access Admin Dashboard
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard View */
          <div className="space-y-6">
            
            {/* Stats Metrics Row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Total Applications</span>
                <div className="text-3xl font-extrabold text-white mt-1">{applicants.length}</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Shortlisted Candidates</span>
                <div className="text-3xl font-extrabold text-emerald-400 mt-1">
                  {applicants.filter((a) => a.status === 'Shortlisted').length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-medium">Avg AI Match Score</span>
                <div className="text-3xl font-extrabold text-cyan-400 mt-1">
                  {Math.round(applicants.reduce((acc, a) => acc + (a.score || 80), 0) / (applicants.length || 1))}%
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Admin Status</span>
                  <div className="text-xs font-bold text-emerald-400 mt-1">LOGGED IN</div>
                </div>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white text-xs"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* AI Assistant Q&A Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <Bot className="w-5 h-5 text-emerald-400" />
                <span>Ask LR AgroSense AI Recruiter Assistant</span>
              </div>

              <form onSubmit={handleAiQuestion} className="flex gap-2">
                <input
                  type="text"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g. 'Show me B.Sc Agriculture students' or 'Who is the top candidate?'"
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Ask AI
                </button>
              </form>

              {aiResponse && (
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-emerald-300">
                  🤖 <strong>AI Insight:</strong> {aiResponse}
                </div>
              )}
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, college, course..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none focus:border-emerald-400"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={domainFilter}
                  onChange={(e) => setDomainFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs outline-none"
                >
                  <option value="All">All Domains</option>
                  <option value="Agritech & AI">Agritech & AI</option>
                  <option value="Agriculture Science">Agriculture Science</option>
                  <option value="Research & Innovation">Research & Innovation</option>
                  <option value="Content Creation">Content Creation</option>
                  <option value="Startup Building">Startup Building</option>
                </select>
              </div>
            </div>

            {/* Applicant Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase font-semibold">
                  <tr>
                    <th className="p-4">Candidate</th>
                    <th className="p-4">Course & College</th>
                    <th className="p-4">Domain</th>
                    <th className="p-4">AI Score</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {filteredApplicants.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-900/80 transition-colors">
                      <td className="p-4 font-bold text-white">
                        <div>{app.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{app.email}</div>
                      </td>

                      <td className="p-4">
                        <div>{app.course}</div>
                        <div className="text-[10px] text-emerald-400 font-medium">{app.college}</div>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-semibold">
                          {app.domain}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                          {app.score}% Match
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            app.status === 'Shortlisted'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : app.status === 'Accepted'
                              ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                              : app.status === 'Rejected'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold hover:bg-emerald-500 hover:text-slate-950 transition-all"
                        >
                          View AI Analysis
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        )}

        {/* Selected Candidate AI Analysis Drawer */}
        {selectedApplicant && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/40 bg-slate-950 space-y-6 shadow-2xl">
              
              <button
                onClick={() => setSelectedApplicant(null)}
                className="absolute top-5 right-5 p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white"
              >
                ✕
              </button>

              <div className="space-y-1">
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                  Candidate ID: {selectedApplicant.id}
                </span>
                <h3 className="text-2xl font-bold text-white mt-2">{selectedApplicant.name}</h3>
                <p className="text-xs text-slate-400">{selectedApplicant.course} • {selectedApplicant.college}</p>
              </div>

              {/* Contact Details */}
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-300">
                  <Mail className="w-4 h-4 text-emerald-400" />
                  <span>{selectedApplicant.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>{selectedApplicant.phone || 'Not provided'}</span>
                </div>
              </div>

              {/* AI Evaluation */}
              <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-300">
                  <span>AI Match Recommendation: {selectedApplicant.recommendation}</span>
                  <span>{selectedApplicant.score}% Match Score</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Candidate demonstrates strong alignment with LR AgroSense's {selectedApplicant.domain} mission.
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {selectedApplicant.skills?.map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                      ✓ {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Resume Text */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Resume / Application Statement:</label>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 max-h-32 overflow-y-auto italic">
                  "{selectedApplicant.resume}"
                </div>
              </div>

              {/* Status Manager Actions */}
              <div className="space-y-2 pt-2">
                <label className="text-xs font-bold text-slate-300">Update Application Status:</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Shortlisted', 'Under Review', 'Accepted', 'Rejected'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(selectedApplicant.id, st)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedApplicant.status === st
                          ? 'bg-emerald-500 text-slate-950 shadow-md'
                          : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
