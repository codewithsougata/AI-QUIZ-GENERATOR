import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Menu, X, Flame, User, LogOut, ChevronDown, Sun, Moon } from "lucide-react";
import AIGeneratorModal from "./AIGeneratorModal";

export default function Navbar({ onMenuClick, isSidebarOpen }) {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    }
    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfileMenu]);

  if (!currentUser) return null;

  const getAvatarUrl = () => {
    if (currentUser?.photoURL && !imageError) {
      return currentUser.photoURL;
    }
    const name = currentUser?.displayName || currentUser?.email || "User";
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=6366F1&color=fff&bold=true&size=128`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  /* ──────────────────────────────────────────────────────────────────── */
  /* Dynamic classes based on theme                                       */
  /* ──────────────────────────────────────────────────────────────────── */
  const navBg = isDark ? "bg-black/85 border-white/[0.08]" : "bg-white/90 border-slate-200";
  const textPri = isDark ? "text-white" : "text-black";
  const textSec = isDark ? "text-white/60" : "text-black/60";
  const hoverBg = isDark ? "hover:bg-white/[0.06]" : "hover:bg-black/[0.05]";
  const iconBg = isDark ? "bg-black" : "bg-white";
  const dropdownBg = isDark ? "bg-black border-white/[0.1]" : "bg-white border-slate-200 shadow-xl";
  const dropdownItem = isDark
    ? "text-white/70 hover:text-white hover:bg-white/[0.06]"
    : "text-black/70 hover:text-black hover:bg-black/[0.05]";
  const dropdownDivider = isDark ? "border-white/[0.08]" : "border-black/[0.08]";
  const streakBg = isDark ? "bg-white/[0.04] border-white/[0.08]" : "bg-slate-100 border-slate-200";
  const menuBtnBorder = isDark ? "border-white/[0.08]" : "border-black/[0.1]";
  const menuBtnText = isDark ? "text-white/60 hover:text-white" : "text-black/60 hover:text-black";

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-40 backdrop-blur-xl border-b transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 sm:h-20">

            {/* ── Left: Hamburger + Brand ── */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onMenuClick}
                className={`lg:hidden p-2 rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${menuBtnText} ${hoverBg} ${menuBtnBorder}`}
                aria-label={isSidebarOpen ? "Close navigation" : "Open navigation"}
              >
                {isSidebarOpen
                  ? <X className="w-5 h-5 text-indigo-400" />
                  : <Menu className="w-5 h-5" />
                }
              </button>

              {/* Brand Logo */}
              <Link to="/" className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-95">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 transition-all duration-300">
                  <div className={`w-full h-full ${iconBg} rounded-[10px] flex items-center justify-center`}>
                    <Sparkles className="w-5 h-5 text-indigo-400 group-hover:rotate-12 transition-transform duration-300" />
                  </div>
                </div>

                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-lg sm:text-xl font-extrabold tracking-tight font-['Outfit'] ${textPri}`}>
                      Quizzy<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Pro</span>
                    </span>
                    <span className="px-1.5 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-sm shadow-indigo-500/50">
                      AI
                    </span>
                  </div>
                  <span className={`text-[10px] hidden sm:block -mt-1 font-medium ${textSec}`}>
                    Powered by Gemini 2.5 Flash
                  </span>
                </div>
              </Link>
            </div>

            {/* ── Right: AI Button + Streak + Theme Toggle + Avatar ── */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Quick AI Generator Button */}
              <button
                onClick={() => setShowAIModal(true)}
                className={`hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 ${isDark
                    ? "bg-white text-black hover:bg-neutral-100 shadow-white/10"
                    : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
                  }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Create AI Quiz</span>
              </button>



              {/* ══════════════════════════════════════════ */}
              {/*  THEME TOGGLE BUTTON  (Light / Night Mode) */}
              {/*  Black and White High-Contrast Design      */}
              {/* ══════════════════════════════════════════ */}
              <button
                onClick={toggleTheme}
                title={isDark ? "Switch to Sun / Light Mode" : "Switch to Night / Dark Mode"}
                aria-label={isDark ? "Switch to Sun / Light Mode" : "Switch to Night / Dark Mode"}
                className={`
                  relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 cursor-pointer
                  ${isDark
                    ? "bg-black border-2 border-white/60 shadow-inner"
                    : "bg-white border-2 border-black/80 shadow-inner"
                  }
                `}
              >
                {/* Track indicator icons */}
                <span className="absolute inset-0 flex items-center justify-between px-1.5 pointer-events-none select-none">
                  {/* Sun icon on left */}
                  <Sun className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? "text-white/40 opacity-100" : "opacity-0"}`} />
                  {/* Moon icon on right */}
                  <Moon className={`w-3.5 h-3.5 transition-opacity duration-300 ${isDark ? "opacity-0" : "text-black/40 opacity-100"}`} />
                </span>

                {/* Sliding Knob (Pure Black & White) */}
                <span
                  className={`
                    absolute top-[2px] w-[20px] h-[20px] rounded-full transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                    flex items-center justify-center shadow-md
                    ${isDark
                      ? "translate-x-[28px] bg-white text-black shadow-white/20"
                      : "translate-x-[2px] bg-black text-white shadow-black/30"
                    }
                  `}
                >
                  {isDark
                    ? <Moon className="w-3 h-3 text-black fill-current" />
                    : <Sun className="w-3 h-3 text-white fill-current" />
                  }
                </span>
              </button>

              {/* User Dropdown / Avatar */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center gap-2 p-1 rounded-full transition-all focus:outline-none ${isDark ? 'hover:ring-2 hover:ring-white/30' : 'hover:ring-2 hover:ring-black/20'}`}
                  aria-label="User menu"
                >
                  <div className="relative">
                    <img
                      src={getAvatarUrl()}
                      alt={currentUser?.displayName || "Profile"}
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover ring-2 ${isDark ? 'ring-white/20' : 'ring-black/20'}`}
                      onError={() => setImageError(true)}
                    />
                    <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 rounded-full ${isDark ? 'border-black' : 'border-white'}`}></span>
                  </div>
                </button>

                {/* Dropdown */}
                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-2xl border shadow-2xl py-2 z-40 animate-slide-in-left ${dropdownBg}`}>
                      <div className={`px-4 py-2.5 border-b ${dropdownDivider}`}>
                        <p className={`text-xs ${textSec}`}>Signed in as</p>
                        <p className={`text-sm font-semibold truncate ${textPri}`}>
                          {currentUser.displayName || currentUser.email}
                        </p>
                      </div>

                      <div className="p-1 space-y-0.5">
                        <Link
                          to="/profile"
                          onClick={() => setShowProfileMenu(false)}
                          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${dropdownItem}`}
                        >
                          <User className="w-4 h-4 text-indigo-400" />
                          <span>Account Profile</span>
                        </Link>
                        <button
                          onClick={() => { setShowProfileMenu(false); setShowAIModal(true); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${dropdownItem}`}
                        >
                          <Sparkles className="w-4 h-4 text-purple-400" />
                          <span>AI Quiz Studio</span>
                        </button>

                        {/* Theme toggle inside dropdown too */}
                        <button
                          onClick={() => { toggleTheme(); setShowProfileMenu(false); }}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-xl transition-colors ${dropdownItem}`}
                        >
                          {isDark
                            ? <Sun className="w-4 h-4 text-white" />
                            : <Moon className="w-4 h-4 text-black" />
                          }
                          <span>{isDark ? "Switch to Light Mode" : "Switch to Night Mode"}</span>
                        </button>
                      </div>

                      <div className={`pt-1 mt-1 border-t p-1 ${dropdownDivider}`}>
                        <button
                          onClick={() => { setShowProfileMenu(false); handleLogout(); }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {showAIModal && <AIGeneratorModal onClose={() => setShowAIModal(false)} />}
    </>
  );
}