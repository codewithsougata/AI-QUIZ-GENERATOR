import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sparkles, Mail, Lock, Eye, EyeOff, User, ArrowRight, Brain, Zap, Trophy } from 'lucide-react';

export default function Register() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }

    try {
      setError('');
      setLoading(true);
      await register(email, password, displayName);
      navigate('/');
    } catch (err) {
      setError('Failed to create account: ' + (err.message || 'Please check your information'));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setError('');
      setLoading(true);
      await loginWithGoogle();
      navigate('/');
    } catch (err) {
      setError('Failed to sign up with Google: ' + (err.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Brand Showcase */}
        <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Join 10,000+ Active Learners</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight font-['Outfit']">
              Create Your Free{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                AI Quiz Account
              </span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Unlock unlimited AI quiz generation, save your score histories, and master any domain from science to programming.
            </p>
          </div>

          <div className="hidden sm:grid grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center mb-2">
                <Brain className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Smart Engine</p>
              <p className="text-[11px] text-white/50 mt-0.5">Gemini 2.5 AI</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center mb-2">
                <Zap className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Zero Setup</p>
              <p className="text-[11px] text-white/50 mt-0.5">Instant start</p>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm">
              <div className="w-8 h-8 rounded-xl bg-white/10 text-white flex items-center justify-center mb-2">
                <Trophy className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-white">Achievements</p>
              <p className="text-[11px] text-white/50 mt-0.5">Rank up</p>
            </div>
          </div>
        </div>

        {/* Right Column: Register Card */}
        <div className="lg:col-span-6 w-full max-w-md mx-auto">
          <div className="relative rounded-3xl bg-black/90 backdrop-blur-2xl border border-white/[0.1] p-6 sm:p-8 lg:p-10 shadow-2xl shadow-indigo-950/50">
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>

            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-['Outfit']">
                Get Started
              </h2>
              <p className="text-sm text-white/50 mt-1">
                Create an account to start generating quizzes
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm mb-5 flex items-start gap-2.5">
                <span className="text-base leading-none">⚠️</span>
                <span className="flex-1">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">
                  Full Name (Optional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.12] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.12] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.12] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-white/40 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-white/60 mb-1 uppercase tracking-wider">
                  Confirm Password *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/[0.12] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-white text-black hover:bg-neutral-200 shadow-lg shadow-white/10 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Free Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-black text-white/40 font-medium">Or continue with</span>
              </div>
            </div>

            {/* Google Signup */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="w-full py-2.5 px-4 rounded-xl bg-black border border-white/[0.15] hover:bg-neutral-900 text-white text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.17 0 9.97 0 12s.45 3.83 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Switch to Login */}
            <div className="mt-5 text-center text-xs text-white/40">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-white/80 font-semibold underline-offset-4 hover:underline">
                Sign in here
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}