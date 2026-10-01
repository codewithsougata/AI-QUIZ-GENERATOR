import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import AIGeneratorModal from "./AIGeneratorModal";
import { 
  Home, 
  BarChart3, 
  User, 
  Sparkles, 
  X, 
  Zap, 
  BrainCircuit, 
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function Sidebar({ isOpen, onClose }) {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const location = useLocation();
  const [showAIModal, setShowAIModal] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Device detection
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (isMobile && isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobile, isOpen]);

  if (!currentUser) return null;

  const menuItems = [
    { 
      path: "/", 
      label: "Dashboard", 
      icon: Home,
      badge: null
    },
    { 
      path: "/results", 
      label: "Analytics & History", 
      icon: BarChart3,
      badge: "Live"
    },
    { 
      path: "/profile", 
      label: "Account Profile", 
      icon: User,
      badge: null
    },
  ];

  const handleLinkClick = () => {
    if (isMobile) onClose();
  };

  const handleAIClick = () => {
    setShowAIModal(true);
    if (isMobile) onClose();
  };

  // Determine sidebar classes based on mobile/desktop
  const sidebarClasses = `
    fixed
    ${isDark ? 'bg-black/95' : 'bg-white'} backdrop-blur-2xl
    border-r ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}
    transition-all duration-300 ease-in-out flex flex-col z-50
    ${isMobile
      ? `top-0 bottom-0 left-0 w-80 ${isOpen ? "translate-x-0 shadow-2xl shadow-indigo-950/80" : "-translate-x-full"}`
      : "top-16 sm:top-20 bottom-0 left-0 w-64 xl:w-72 translate-x-0"
    }
  `;

  return (
    <>
      {/* Overlay for mobile - ONLY when sidebar is open */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside className={sidebarClasses}>
        {/* Mobile Header with Close Button */}
        {isMobile && (
          <div className={`p-5 border-b flex justify-between items-center flex-shrink-0 ${isDark ? 'border-white/[0.08] bg-black' : 'border-slate-200 bg-white'}`}>
            <Link 
              to="/" 
              className="flex items-center gap-2.5" 
              onClick={handleLinkClick}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-black'}`}>
                Quizzy<span className={isDark ? 'text-white' : 'text-black'}>Pro</span> AI
              </span>
            </Link>

            <button 
              className={`p-2 rounded-xl transition-colors ${isDark ? 'text-white/60 hover:text-white hover:bg-white/[0.06]' : 'text-black/60 hover:text-black hover:bg-black/[0.06]'}`} 
              onClick={onClose}
              aria-label="Close sidebar"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* User Card */}
        <div className={`p-4 mx-3 mt-4 mb-2 rounded-2xl border shadow-lg flex-shrink-0 ${
          isDark
            ? 'bg-white/[0.03] border-white/[0.08]'
            : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold text-base shadow-md shadow-indigo-500/20 flex-shrink-0">
                {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email?.charAt(0).toUpperCase() || 'U')}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 rounded-full ${isDark ? 'border-black' : 'border-white'}`}></span>
            </div>

            <div className="min-w-0 flex-1">
              <p className={`font-semibold truncate text-sm ${isDark ? 'text-white' : 'text-black'}`}>
                {currentUser.displayName || "Knowledge Explorer"}
              </p>
              <p className={`text-xs truncate ${isDark ? 'text-white/50' : 'text-black/50'}`}>
                {currentUser.email}
              </p>
            </div>
          </div>

          <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-[11px] ${isDark ? 'border-white/[0.06] text-white/50' : 'border-slate-200 text-black/50'}`}>
            <span className={`flex items-center gap-1 font-medium ${isDark ? 'text-white' : 'text-black'}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              Pro Member
            </span>
            <span className={`px-2 py-0.5 rounded-full font-semibold border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black text-white border-black'}`}>
              LVL 1
            </span>
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1.5">
          <p className={`px-3 pb-2 text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-white/40' : 'text-black/40'}`}>
            Navigation
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={handleLinkClick}
                  className={`
                    group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium
                    transition-all duration-200
                    ${isActive
                      ? isDark
                        ? "bg-white text-black shadow-lg shadow-white/10 font-semibold"
                        : "bg-black text-white shadow-md font-semibold"
                      : isDark
                        ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
                        : "text-black/60 hover:text-black hover:bg-black/[0.05]"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 transition-transform duration-200 ${isActive ? (isDark ? 'text-black' : 'text-white') : isDark ? 'text-white/50 group-hover:text-white group-hover:scale-110' : 'text-black/50 group-hover:text-black group-hover:scale-110'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full border ${isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black text-white border-black'}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* AI Banner Card in Sidebar */}
          <div className="pt-4">
            <div className={`p-4 rounded-2xl border shadow-xl relative overflow-hidden ${
              isDark
                ? "bg-white/[0.04] border-white/[0.1]"
                : "bg-slate-50 border-slate-200"
            }`}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none"></div>
              
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/10 text-white' : 'bg-black/10 text-black'}`}>
                  <BrainCircuit className="w-4 h-4" />
                </div>
                <h4 className={`text-xs font-bold font-['Outfit'] uppercase tracking-wide ${isDark ? 'text-white' : 'text-black'}`}>
                  AI Quiz Engine
                </h4>
              </div>

              <p className={`text-[11px] mb-3 leading-relaxed ${isDark ? 'text-white/60' : 'text-black/60'}`}>
                Generate high-yield quizzes on any custom topic in seconds.
              </p>

              <button
                onClick={handleAIClick}
                className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-95 shadow-md ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-100 shadow-white/10"
                    : "bg-black hover:bg-neutral-800 text-white shadow-black/20"
                }`}
                type="button"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Launch Generator</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t flex-shrink-0 ${isDark ? 'border-white/[0.08] bg-black/40 text-white/40' : 'border-slate-200 bg-slate-50 text-black/40'}`}>
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Gemini AI 2.5 Flash
            </span>
            <span className={`font-mono text-[10px] ${isDark ? 'text-white/30' : 'text-black/30'}`}>v2.0 PRO</span>
          </div>
        </div>
      </aside>

      {/* AI Modal */}
      {showAIModal && <AIGeneratorModal onClose={() => setShowAIModal(false)} />}
    </>
  );
}