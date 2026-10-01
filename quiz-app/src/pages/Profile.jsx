import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User, 
  Mail, 
  Key, 
  Calendar, 
  Clock, 
  ShieldCheck, 
  LogOut, 
  Sparkles, 
  Award, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { isDark } = useTheme();
  const [imageError, setImageError] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-['Outfit']">Sign In Required</h2>
          <p className="text-xs text-slate-400">Please log in to manage your account details</p>
        </div>
      </div>
    );
  }

  const getAvatarUrl = () => {
    if (currentUser?.photoURL && !imageError) {
      return currentUser.photoURL;
    }
    const name = currentUser?.displayName || currentUser?.email || "User";
    const encodedName = encodeURIComponent(name);
    return `https://ui-avatars.com/api/?name=${encodedName}&background=6366F1&color=fff&bold=true&size=256`;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header */}
      <div>
        <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
          Account Profile
        </h1>
        <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Manage your personal credentials, learning status, and security
        </p>
      </div>

      {/* Main Profile Showcase Card */}
      <div className={`rounded-3xl border shadow-2xl overflow-hidden relative transition-all ${isDark ? 'bg-black border-white/[0.1]' : 'bg-white border-slate-200'}`}>
        {/* Banner with Glowing Gradient */}
        <div className="h-32 sm:h-44 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/15"></div>
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        {/* Profile Details Content */}
        <div className="px-6 sm:px-10 pb-8 sm:pb-10 relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5 text-center sm:text-left">
              {/* Avatar with glowing ring */}
              <div className="relative">
                <img
                  src={getAvatarUrl()}
                  alt={currentUser.displayName || "Profile"}
                  className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl border-4 shadow-2xl object-cover ring-2 ring-indigo-500/40 bg-slate-900 ${isDark ? 'border-black' : 'border-white'}`}
                  onError={() => setImageError(true)}
                />
                <span className={`absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 rounded-full ${isDark ? 'border-black' : 'border-white'}`}></span>
              </div>

              {/* Name & Email */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <h2 className={`text-2xl sm:text-3xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    {currentUser.displayName || 'Knowledge Explorer'}
                  </h2>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1 ${isDark ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    PRO MEMBER
                  </span>
                </div>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* Logout Action Button */}
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 active:scale-95 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>

          {/* Level & XP Progression Bar */}
          <div className={`mb-8 p-5 rounded-2xl border ${isDark ? 'bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-slate-900/60 border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className={`font-bold flex items-center gap-1.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                <Award className="w-4 h-4 text-amber-500" />
                Level 1 • Knowledge Pioneer
              </span>
              <span className={`font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>150 / 500 XP to Level 2</span>
            </div>
            <div className={`w-full rounded-full h-2 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
              <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full w-[30%]" />
            </div>
          </div>

          {/* Account Credentials & Meta Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Email Address */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Email Address</p>
                <p className={`text-sm font-semibold truncate mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentUser.email}</p>
                <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified Account
                </p>
              </div>
            </div>

            {/* User ID */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                <Key className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>User Identifier (UID)</p>
                <p className={`text-xs font-mono truncate mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{currentUser.uid}</p>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Firestore Cloud Key</p>
              </div>
            </div>

            {/* Account Created Date */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Member Since</p>
                <p className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentUser.metadata?.creationTime
                    ? new Date(currentUser.metadata.creationTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    : 'Active Member'}
                </p>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Registration Record</p>
              </div>
            </div>

            {/* Last Active */}
            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${isDark ? 'bg-white/[0.02] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Last Login</p>
                <p className={`text-sm font-semibold mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {currentUser.metadata?.lastSignInTime
                    ? new Date(currentUser.metadata.lastSignInTime).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Recently'}
                </p>
                <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Current Session Active</p>
              </div>
            </div>

          </div>

          {/* Security & Authentication Footnote */}
          <div className={`mt-8 p-5 rounded-2xl border flex items-start gap-3 ${isDark ? 'bg-indigo-500/[0.04] border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
            <ShieldCheck className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
            <div className="text-xs space-y-1">
              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Firebase Security Protocol</p>
              <p className={`leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                Your credentials and quiz analytics are encrypted and securely synchronized through Firebase Authentication and Cloud Firestore rules.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${isDark ? 'bg-black border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>Confirm Sign Out</h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Are you sure you want to end your current session? You can sign back in anytime to access your quizzes.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${isDark ? 'border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06]' : 'border-slate-300 text-slate-700 hover:bg-slate-100'}`}
              >
                Stay Logged In
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}