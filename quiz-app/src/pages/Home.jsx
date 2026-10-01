import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import AIGeneratorModal from '../components/AIGeneratorModal';
import { 
  Sparkles, 
  BrainCircuit, 
  Zap, 
  Trophy, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  Code, 
  Atom, 
  Globe, 
  Flame, 
  CheckCircle2, 
  Play, 
  ShieldCheck,
  Search
} from 'lucide-react';

export default function Home() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [showAIModal, setShowAIModal] = useState(false);
  const [modalInitialTopic, setModalInitialTopic] = useState('');
  const [heroSearchInput, setHeroSearchInput] = useState('');
  const navigate = useNavigate();

  const handleHeroGenerate = (e) => {
    e.preventDefault();
    if (heroSearchInput.trim()) {
      setModalInitialTopic(heroSearchInput.trim());
      setShowAIModal(true);
    } else {
      setShowAIModal(true);
    }
  };

  const handleQuickTopic = (topicName) => {
    setModalInitialTopic(topicName);
    setShowAIModal(true);
  };

  const predefinedQuizzes = [
    {
      id: "js-basics",
      title: "JavaScript Basics",
      desc: "Test core concepts: scopes, data types, closures, and async primitives.",
      difficulty: "Beginner",
      difficultyColor: "emerald",
      questions: 2,
      duration: "5 mins",
      icon: Code,
      gradient: "from-amber-500/20 via-orange-500/10 to-transparent",
      border: "hover:border-amber-500/40"
    },
    {
      id: "react-advanced",
      title: "React Architecture",
      desc: "Deep dive into component lifecycles, hooks, virtual DOM, and performance.",
      difficulty: "Intermediate",
      difficultyColor: "indigo",
      questions: 1,
      duration: "5 mins",
      icon: Atom,
      gradient: "from-cyan-500/20 via-blue-500/10 to-transparent",
      border: "hover:border-cyan-500/40"
    }
  ];

  const popularTopics = [
    { label: "🐍 Python Data Science", topic: "Python Data Science and Algorithms" },
    { label: "🚀 Space Exploration", topic: "Space Missions and Astronomy" },
    { label: "🏛️ World History", topic: "Major World History Revolutions" },
    { label: "🧠 Machine Learning", topic: "Machine Learning and Neural Networks" },
    { label: "💻 Cyber Security", topic: "Network Security and Ethical Hacking" }
  ];

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
        
        {/* ================= HERO AI GENERATION SECTION ================= */}
        <div className={`relative rounded-3xl overflow-hidden border p-6 sm:p-10 lg:p-14 shadow-2xl transition-all duration-300 ${
          isDark
            ? "border-white/[0.12] bg-gradient-to-b from-indigo-950/60 via-slate-900/40 to-black shadow-indigo-950/40"
            : "border-slate-200 bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 shadow-slate-200/60"
        }`}>
          {/* Ambient luminous glow balls inside hero */}
          <div className={`absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-purple-500/15' : 'bg-purple-400/10'}`} />
          <div className={`absolute bottom-0 left-10 w-80 h-80 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-400/10'}`} />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs sm:text-sm font-semibold shimmer-badge ${
              isDark
                ? "bg-white/[0.06] border-white/20 text-white"
                : "bg-black/[0.06] border-black/20 text-black"
            }`}>
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-white' : 'text-black'}`} />
              <span>Next-Gen Quiz Generator with Gemini 2.5 Flash</span>
            </div>

            <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-['Outfit'] leading-tight sm:leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Generate Any Quiz in Seconds with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                Artificial Intelligence
              </span>
            </h1>

            <p className={`text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
              Welcome back, <span className={`font-semibold ${isDark ? 'text-white' : 'text-black'}`}>{currentUser.displayName || currentUser.email}</span>! Turn any study topic into an interactive multiple-choice test tailored to your level.
            </p>

            {/* Direct Quick Prompt Search / Launch Bar */}
            <form onSubmit={handleHeroGenerate} className="pt-2 max-w-2xl mx-auto">
              <div className={`relative flex flex-col sm:flex-row items-center gap-2 p-1.5 rounded-2xl border shadow-xl backdrop-blur-xl focus-within:ring-2 transition-all ${
                isDark
                  ? "bg-black/90 border-white/[0.15] focus-within:border-indigo-500 focus-within:ring-indigo-500/30"
                  : "bg-white border-slate-300 focus-within:border-black focus-within:ring-slate-300 shadow-slate-200/50"
              }`}>
                <div className="flex items-center gap-2.5 px-3 w-full sm:w-auto flex-1">
                  <Search className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <input
                    type="text"
                    value={heroSearchInput}
                    onChange={(e) => setHeroSearchInput(e.target.value)}
                    placeholder="Enter topic: e.g. Quantum Physics, Next.js, World War II..."
                    className={`w-full py-2.5 bg-transparent text-sm sm:text-base focus:outline-none ${isDark ? 'text-white placeholder-slate-400' : 'text-slate-900 placeholder-slate-400'}`}
                  />
                </div>
                <button
                  type="submit"
                  className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm sm:text-base shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 flex-shrink-0 cursor-pointer ${
                    isDark
                      ? "bg-white text-black hover:bg-slate-100 shadow-white/10"
                      : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate Quiz</span>
                </button>
              </div>
            </form>

            {/* Topic Chips */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <span className={`text-xs font-medium ${isDark ? 'text-white/40' : 'text-black/40'}`}>Quick Topics:</span>
              {popularTopics.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickTopic(item.topic)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all active:scale-95 cursor-pointer ${
                    isDark
                      ? "bg-white/[0.05] hover:bg-white/[0.1] text-white/70 hover:text-white border-white/[0.08]"
                      : "bg-white hover:bg-black text-black hover:text-white border-black/20 shadow-sm"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= PLATFORM STATS BAR ================= */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>Gemini 2.5</p>
                <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'}`}>Flash AI Model</p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>Instant</p>
                <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'}`}>Quiz Synthesis</p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>100%</p>
                <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'}`}>Cloud Synced</p>
              </div>
            </div>
          </div>

          <div className={`p-5 rounded-2xl border backdrop-blur-md transition-all ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-white border-slate-200 shadow-sm'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className={`text-2xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>Verified</p>
                <p className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'}`}>Accurate Distractors</p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FEATURED / PREDEFINED QUIZZES ================= */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
                Curated Knowledge Challenges
              </h2>
              <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Ready-to-play baseline quizzes to test your core tech proficiencies
              </p>
            </div>
            
            <button
              onClick={() => setShowAIModal(true)}
              className={`inline-flex items-center gap-2 text-xs sm:text-sm font-semibold transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-black/60 hover:text-black'}`}
            >
              <span>Or generate custom topic</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predefinedQuizzes.map((quiz) => {
              const Icon = quiz.icon;
              return (
                <div
                  key={quiz.id}
                  className={`
                    relative rounded-2xl p-6 sm:p-7
                    border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl
                    group flex flex-col justify-between
                    ${isDark
                      ? `bg-black border-white/[0.08] ${quiz.border} hover:shadow-indigo-950/50`
                      : `bg-white border-slate-200 hover:border-slate-300 shadow-md shadow-slate-100 hover:shadow-slate-300/40`
                    }
                  `}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform ${isDark ? 'bg-white/[0.06] border-white/[0.1] text-white' : 'bg-black/[0.06] border-black/[0.1] text-black'}`}>
                        <Icon className="w-6 h-6" />
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black text-white border-black'}`}>
                          {quiz.difficulty}
                        </span>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${isDark ? 'bg-white/[0.04] text-white/60 border-white/[0.08]' : 'bg-slate-100 text-black/60 border-black/10'}`}>
                          <Clock className="w-3 h-3" />
                          {quiz.duration}
                        </span>
                      </div>
                    </div>

                    <div>
                      <h3 className={`text-xl font-bold font-['Outfit'] transition-colors ${isDark ? 'text-white' : 'text-black'}`}>
                        {quiz.title}
                      </h3>
                      <p className={`text-sm mt-1 leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                        {quiz.desc}
                      </p>
                    </div>
                  </div>

                  <div className={`pt-6 mt-4 border-t flex items-center justify-between ${isDark ? 'border-white/[0.06]' : 'border-black/[0.06]'}`}>
                    <span className={`text-xs font-medium ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                      {quiz.questions} Questions • Timed Challenge
                    </span>

                    <Link
                      to={`/quiz/${quiz.id}`}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        isDark
                          ? "bg-white/[0.06] hover:bg-white text-white hover:text-black border-white/[0.1] hover:border-white shadow-sm"
                          : "bg-black text-white hover:bg-neutral-800 border-black shadow-md shadow-black/10"
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Start Quiz</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= HOW IT WORKS / KEY VALUE ================= */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className={`text-2xl sm:text-3xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
              Why Learn With QuizzyPro AI?
            </h2>
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-black/50'}`}>
              The smartest, fastest way to test knowledge retention and identify learning gaps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-6 rounded-2xl border transition-all space-y-3 ${isDark ? 'bg-white/[0.02] border-white/[0.08] hover:border-white/20' : 'bg-white border-slate-200 shadow-sm hover:border-black/20'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <BrainCircuit className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>1. AI Topic Synthesis</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Google Gemini analyzes your topic, generating plausible distractors and deep contextual questions within seconds.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all space-y-3 ${isDark ? 'bg-white/[0.02] border-white/[0.08] hover:border-white/20' : 'bg-white border-slate-200 shadow-sm hover:border-black/20'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <Clock className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>2. Real-Time Exam Sim</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                Countdown timers, interactive choice cards, and immediate progress tracking train your recall under pressure.
              </p>
            </div>

            <div className={`p-6 rounded-2xl border transition-all space-y-3 ${isDark ? 'bg-white/[0.02] border-white/[0.08] hover:border-white/20' : 'bg-white border-slate-200 shadow-sm hover:border-black/20'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                <Trophy className="w-6 h-6" />
              </div>
              <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>3. Cloud Performance Log</h3>
              <p className={`text-sm leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                All quiz scores and completion times automatically sync to Firestore, giving you full control over your historical analytics.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ================= ULTRA-MODERN FOOTER ================= */}
      <footer className={`mt-20 border-t ${isDark ? 'border-white/[0.08] bg-black text-white/50' : 'border-black/10 bg-white text-black/50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Column 1: Brand Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-md ${isDark ? 'bg-white text-black shadow-white/10' : 'bg-black text-white shadow-black/20'}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
                <span className={`text-xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
                  QuizzyPro AI
                </span>
              </div>
              <p className={`text-sm max-w-md leading-relaxed ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                QuizzyPro AI is a next-generation interactive quiz engine powered by Google Gemini 2.5 Flash, Firebase Firestore, and React 19. Designed for learners, engineers, and curious minds.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-black border-black/20'}`}>
                  ⚡ Gemini 2.5 Flash
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-black border-black/20'}`}>
                  🔥 Firebase Firestore
                </span>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/10 text-black border-black/20'}`}>
                  ⚛️ React 19 + Vite
                </span>
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
                Explore Platform
              </h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <button onClick={() => setShowAIModal(true)} className={`transition-colors text-left cursor-pointer ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                    AI Quiz Generator
                  </button>
                </li>
                <li>
                  <Link to="/results" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                    Analytics & Score History
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className={`transition-colors ${isDark ? 'hover:text-white' : 'hover:text-black'}`}>
                    Account Profile
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Engineering Team */}
            <div className="space-y-3">
              <h4 className={`text-xs font-bold uppercase tracking-wider font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
                Engineering Team
              </h4>
              <div className={`text-xs space-y-1.5 ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                <p className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>Developed by:</p>
                <p className={isDark ? 'text-white/70' : 'text-black/70'}>Sougata Manna, Apurba Kuiti, Iris Chatterjee, Soyel Rana Mondal</p>
                <p className="pt-2 text-[11px]">Contact: sougatamanna9932@gmail.com</p>
              </div>
            </div>
          </div>

          <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-4 ${isDark ? 'border-white/[0.06] text-white/40' : 'border-black/[0.06] text-black/40'}`}>
            <p>© {new Date().getFullYear()} QuizzyPro AI. All rights reserved.</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              All Systems Operational • Pro Version 2.0
            </p>
          </div>
        </div>
      </footer>

      {/* AI Generator Modal */}
      {showAIModal && (
        <AIGeneratorModal 
          onClose={() => setShowAIModal(false)} 
          initialTopic={modalInitialTopic}
        />
      )}
    </div>
  );
}