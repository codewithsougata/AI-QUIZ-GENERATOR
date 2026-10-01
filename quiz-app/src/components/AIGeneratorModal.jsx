import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import GeminiService, { isApiConfigured } from '../services/geminiApi';
import { 
  Sparkles, 
  X, 
  BrainCircuit, 
  Zap, 
  Gauge, 
  Sliders, 
  Check, 
  Flame, 
  Lightbulb, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export default function AIGeneratorModal({ onClose, initialTopic = '' }) {
  const { isDark } = useTheme();
  const [topic, setTopic] = useState(initialTopic);
  const [difficulty, setDifficulty] = useState('medium');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const suggestedTopics = [
    { label: '🐍 Python & Data Science', value: 'Python Programming and Data Structures' },
    { label: '⚛️ React & Modern JS', value: 'React 19, JavaScript ESNext, and Frontend Architecture' },
    { label: '🚀 Astrophysics & Space', value: 'Astrophysics, Black Holes, and Space Exploration' },
    { label: '🧠 Machine Learning', value: 'Machine Learning, Neural Networks, and Generative AI' },
    { label: '🏛️ World History', value: 'Ancient World History and Major Revolutions' },
    { label: '💡 General Science', value: 'Physics, Chemistry, and Biological Wonders' }
  ];

  const loadingSteps = [
    'Initializing Gemini 2.5 Flash...',
    'Synthesizing quiz knowledge base...',
    'Crafting smart multiple-choice questions...',
    'Calibrating question difficulty...',
    'Finalizing quiz format...'
  ];

  // Animated loading step progression
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < loadingSteps.length - 1 ? prev + 1 : prev));
      }, 1200);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const generateQuiz = async (e) => {
    e.preventDefault();
    if (!topic.trim()) {
      setError('Please enter or select a quiz topic');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let quizData;

      if (isApiConfigured()) {
        try {
          quizData = await GeminiService.generateQuiz(topic, difficulty, numberOfQuestions);
        } catch (apiError) {
          console.warn('Gemini API failed, using intelligent mock generator:', apiError);
          quizData = GeminiService.generateMockQuiz(topic, difficulty, numberOfQuestions);
        }
      } else {
        quizData = GeminiService.generateMockQuiz(topic, difficulty, numberOfQuestions);
      }

      const questions = quizData.quiz?.questions || quizData.questions || [];

      // Transform questions to standard format
      const transformedQuestions = questions.map((q, index) => ({
        id: q.id || index + 1,
        question: q.questionText || q.question || `Question ${index + 1} about ${topic}`,
        options: q.options || [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : 0,
        explanation: q.explanation || `The correct answer is option ${(q.correctAnswer ?? 0) + 1}.`
      }));

      const quizToSave = {
        title: quizData.quiz?.title || `AI Quiz: ${topic}`,
        description: quizData.quiz?.description || `${difficulty.toUpperCase()} level quiz about ${topic}`,
        difficulty: difficulty,
        topic: topic,
        totalQuestions: transformedQuestions.length,
        questions: transformedQuestions,
        timestamp: new Date().toISOString(),
        type: 'ai-generated'
      };

      // Save to localStorage
      localStorage.setItem('customQuiz', JSON.stringify(quizToSave));
      localStorage.setItem('quizTopic', topic);
      localStorage.setItem('quizSource', 'ai-generator');

      onClose();

      setTimeout(() => {
        navigate('/quiz/custom');
      }, 120);

    } catch (err) {
      console.error('Quiz generation failed:', err);
      setError('Failed to generate quiz. Please check connection and try again.');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Outer Glow Container */}
      <div className={`relative w-full max-w-lg my-8 rounded-3xl border shadow-2xl p-6 sm:p-8 overflow-hidden transition-all duration-300 ${
        isDark 
          ? "bg-black border-white/[0.12] shadow-indigo-950/80 text-white" 
          : "bg-white border-slate-200 shadow-slate-300/50 text-slate-900"
      }`}>
        {/* Ambient Top Glow */}
        <div className={`absolute top-0 right-10 w-48 h-48 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/10' : 'bg-indigo-100/60'}`} />

        {/* Modal Header */}
        <div className={`flex items-center justify-between pb-5 border-b relative z-10 ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <BrainCircuit className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className={`text-xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AI Quiz Studio
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isDark ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
                  GEMINI 2.5
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Generate tailored multiple-choice challenges in seconds
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className={`p-2 rounded-xl transition-colors disabled:opacity-50 cursor-pointer ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.08]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Overlay Animation */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-6">
            <div className="relative">
              {/* Outer pulsing ring */}
              <div className="w-24 h-24 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
              {/* Inner glowing icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/50 animate-pulse">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Synthesizing Your Quiz...
              </h4>
              <p className="text-xs text-indigo-500 font-mono tracking-wide transition-all duration-300">
                {loadingSteps[loadingStep]}
              </p>
            </div>

            <div className={`w-full max-w-xs rounded-full h-1.5 overflow-hidden border ${isDark ? 'bg-black border-white/[0.08]' : 'bg-slate-200 border-slate-300'}`}>
              <div 
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${((loadingStep + 1) / loadingSteps.length) * 100}%` }}
              />
            </div>
            <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Generating questions on <span className={`font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>"{topic}"</span>
            </p>
          </div>
        ) : (
          <form onSubmit={generateQuiz} className="mt-5 space-y-5 relative z-10">
            {/* Topic Input */}
            <div>
              <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                What do you want to learn? *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Quantum Computing, World War II, Next.js..."
                  className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none transition-all font-medium ${
                    isDark
                      ? "bg-slate-900/90 border-white/[0.12] text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30"
                      : "bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-black focus:ring-2 focus:ring-slate-300"
                  }`}
                  required
                />
              </div>

              {/* Quick suggestion chips */}
              <div className="mt-2.5">
                <p className={`text-[11px] mb-1.5 font-medium flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  <Lightbulb className="w-3 h-3 text-amber-500" />
                  Popular Topic Suggestions:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestedTopics.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(item.value)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                        isDark
                          ? "bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border-white/[0.06]"
                          : "bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border-slate-200"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Difficulty Level Buttons */}
            <div>
              <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Select Difficulty Level
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'easy', label: 'Easy', icon: '🟢', desc: 'Foundational' },
                  { id: 'medium', label: 'Medium', icon: '🟡', desc: 'Intermediate' },
                  { id: 'hard', label: 'Hard', icon: '🔴', desc: 'Advanced' }
                ].map((level) => {
                  const isSelected = difficulty === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setDifficulty(level.id)}
                      className={`
                        p-3 rounded-2xl border text-center transition-all duration-200 cursor-pointer
                        ${isSelected
                          ? isDark
                            ? 'bg-white text-black border-white shadow-lg shadow-white/10 ring-2 ring-white font-bold'
                            : 'bg-black text-white border-black shadow-lg shadow-black/20 ring-2 ring-black font-bold'
                          : isDark
                            ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }
                      `}
                    >
                      <div className="text-base mb-0.5">{level.icon}</div>
                      <div className={`text-xs font-bold ${isSelected ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-white' : 'text-slate-900')}`}>{level.label}</div>
                      <div className={`text-[10px] ${isSelected ? (isDark ? 'text-black/70' : 'text-white/70') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>{level.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Question Count
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { count: 3, label: '3 Questions', desc: '~2 mins' },
                  { count: 5, label: '5 Questions', desc: '~4 mins' },
                  { count: 10, label: '10 Questions', desc: '~8 mins' }
                ].map((item) => {
                  const isSelected = numberOfQuestions === item.count;
                  return (
                    <button
                      key={item.count}
                      type="button"
                      onClick={() => setNumberOfQuestions(item.count)}
                      className={`
                        py-2.5 px-3 rounded-xl border text-center transition-all duration-200 cursor-pointer
                        ${isSelected
                          ? isDark
                            ? 'bg-white text-black border-white shadow-lg shadow-white/10 ring-2 ring-white font-bold'
                            : 'bg-black text-white border-black shadow-lg shadow-black/20 ring-2 ring-black font-bold'
                          : isDark
                            ? 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }
                      `}
                    >
                      <div className={`text-xs font-bold ${isSelected ? (isDark ? 'text-black' : 'text-white') : (isDark ? 'text-white' : 'text-slate-900')}`}>{item.label}</div>
                      <div className={`text-[10px] ${isSelected ? (isDark ? 'text-black/70' : 'text-white/70') : (isDark ? 'text-slate-400' : 'text-slate-500')}`}>{item.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons: Pure Black & White Contrast */}
            <div className="pt-3 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className={`flex-1 py-3 px-4 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
                  isDark
                    ? "border-white/[0.15] text-slate-300 hover:text-white hover:bg-white/[0.06]"
                    : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                Cancel
              </button>

              <button
                type="submit"
                className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDark
                    ? "bg-white text-black hover:bg-neutral-100 shadow-white/10"
                    : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Generate Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}