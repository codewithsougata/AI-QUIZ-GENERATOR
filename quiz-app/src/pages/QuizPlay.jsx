import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db, QUIZ_RESULTS_COLLECTION } from "../firebase/config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Sparkles, 
  Trophy, 
  ArrowLeft, 
  RotateCcw, 
  BarChart3, 
  Home, 
  AlertTriangle,
  Zap,
  Check
} from "lucide-react";

// Predefined quizzes
const predefinedQuizzes = {
  "js-basics": [
    {
      id: 1,
      question: "What is JavaScript primarily used for?",
      options: [
        "Enabling interactive web pages & dynamic client behavior",
        "Styling and visual CSS design only",
        "Operating system kernel management",
        "Database querying language replacement"
      ],
      correctAnswer: 0,
      explanation: "JavaScript is a lightweight, interpreted programming language primarily designed for client-side web page interactivity."
    },
    {
      id: 2,
      question: "Who developed the first version of JavaScript?",
      options: [
        "Microsoft Corporation",
        "Brendan Eich at Netscape",
        "Tim Berners-Lee at CERN",
        "James Gosling at Sun Microsystems"
      ],
      correctAnswer: 1,
      explanation: "Brendan Eich developed Mocha (later named JavaScript) in 10 days in May 1995 while at Netscape Communications."
    },
  ],
  "react-advanced": [
    {
      id: 1,
      question: "What is the primary role of the React Virtual DOM?",
      options: [
        "Minimizing expensive direct DOM manipulations through diffing & batching",
        "Directly replacing the browser's native JavaScript engine",
        "Acting as an encrypted database for client state",
        "Translating JSX into Python bytecode"
      ],
      correctAnswer: 0,
      explanation: "React maintains a virtual representation of the UI in memory, synchronizing it with the real DOM through a reconciliation algorithm."
    },
  ],
};

export default function QuizPlay() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  const { isDark } = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizTitle, setQuizTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadQuiz = () => {
      setLoading(true);
      const isCustomQuiz = id === "custom" || location.pathname === "/quiz/custom";

      if (isCustomQuiz) {
        const customQuizJSON = localStorage.getItem("customQuiz");
        const topic = localStorage.getItem("quizTopic");

        if (customQuizJSON) {
          try {
            const quizData = JSON.parse(customQuizJSON);
            if (quizData.questions && Array.isArray(quizData.questions)) {
              setQuestions(quizData.questions);
              setQuizTitle(quizData.title || `AI Quiz: ${topic}`);
            } else {
              setQuestions([]);
            }
          } catch (error) {
            console.error("❌ Parse error:", error);
            setQuestions([]);
          }
        } else {
          setQuestions([]);
        }
      } else {
        const predefined = predefinedQuizzes[id] || [];
        setQuestions(predefined);
        setQuizTitle(getPredefinedTitle(id));
      }

      setLoading(false);
    };

    loadQuiz();
  }, [id, location.pathname]);

  const getPredefinedTitle = (quizId) => {
    const titles = {
      "js-basics": "JavaScript Basics",
      "react-advanced": "React Architecture",
    };
    return titles[quizId] || "Quiz Challenge";
  };

  // Timer countdown
  useEffect(() => {
    if (questions.length > 0 && timeLeft > 0 && !showResult && !loading) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0 && !loading && !showResult) {
      handleFinish();
    }
  }, [timeLeft, showResult, questions.length, loading]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNext = () => {
    const updatedAnswers = {
      ...userAnswers,
      [currentQuestion]: selectedAnswer
    };

    if (currentQuestion < questions.length - 1) {
      const nextQ = currentQuestion + 1;
      setCurrentQuestion(nextQ);
      setSelectedAnswer(updatedAnswers[nextQ] ?? null);
    } else {
      handleFinish(updatedAnswers);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      const prevQ = currentQuestion - 1;
      setCurrentQuestion(prevQ);
      setSelectedAnswer(userAnswers[prevQ] ?? null);
    }
  };

  // Save result to Firebase
  const saveResultToFirebase = async (result) => {
    if (!currentUser || !db) return null;

    try {
      setSaving(true);
      const resultData = {
        userId: currentUser.uid,
        userEmail: currentUser.email,
        quizId: result.quizId,
        quizTitle: result.quizTitle,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage: result.percentage,
        isCustom: result.isCustom || false,
        timeSpent: 300 - timeLeft,
        timestamp: serverTimestamp(),
        createdAt: serverTimestamp(),
        ...(result.isCustom && result.topic && { topic: result.topic }),
      };

      const docRef = await addDoc(collection(db, QUIZ_RESULTS_COLLECTION), resultData);
      return docRef.id;
    } catch (error) {
      console.error("❌ Firebase save failed:", error);
      return null;
    } finally {
      setSaving(false);
    }
  };

  const handleFinish = async (finalAnswers = userAnswers) => {
    // Calculate final score
    let calculatedScore = 0;
    questions.forEach((q, idx) => {
      const selected = finalAnswers[idx];
      if (selected !== undefined && selected === q.correctAnswer) {
        calculatedScore++;
      }
    });

    setScore(calculatedScore);
    const percentage = Math.round((calculatedScore / questions.length) * 100);
    const isCustom = id === "custom" || location.pathname === "/quiz/custom";

    const result = {
      quizId: id || "custom",
      quizTitle: isCustom ? quizTitle : getPredefinedTitle(id),
      score: calculatedScore,
      totalQuestions: questions.length,
      percentage: percentage,
      timestamp: new Date().toISOString(),
      isCustom: isCustom,
      timeLeft: timeLeft,
      timeSpent: 300 - timeLeft,
      ...(isCustom && { topic: localStorage.getItem("quizTopic") }),
    };

    const firebaseId = await saveResultToFirebase(result);

    // Save locally
    const existingResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
    existingResults.unshift({ ...result, firebaseId });
    localStorage.setItem("quizResults", JSON.stringify(existingResults));

    setShowResult(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getTimerColor = () => {
    if (timeLeft > 120) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (timeLeft > 60) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse";
  };

  const getGradeInfo = (p) => {
    if (p >= 90) return { grade: "A+", label: "Mastery Level", color: "text-emerald-400", bg: "bg-emerald-500/20" };
    if (p >= 80) return { grade: "A", label: "Excellent Work", color: "text-indigo-400", bg: "bg-indigo-500/20" };
    if (p >= 70) return { grade: "B", label: "Good Effort", color: "text-cyan-400", bg: "bg-cyan-500/20" };
    if (p >= 60) return { grade: "C", label: "Passing Grade", color: "text-amber-400", bg: "bg-amber-500/20" };
    return { grade: "F", label: "Need More Practice", color: "text-rose-400", bg: "bg-rose-500/20" };
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-3 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-400 font-medium text-sm">Preparing Quiz Session...</p>
        </div>
      </div>
    );
  }

  // Quiz Not Found State
  if (!questions.length && !loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className={`max-w-md w-full p-8 rounded-3xl border text-center space-y-4 shadow-2xl ${isDark ? 'bg-black border-white/[0.1]' : 'bg-white border-slate-200'}`}>
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h2 className={`text-2xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>Quiz Not Found</h2>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            The quiz could not be loaded or questions have not been generated yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className={`w-full py-3 px-4 rounded-xl font-bold text-sm shadow-lg transition-all cursor-pointer ${isDark ? 'bg-white text-black hover:bg-slate-100' : 'bg-black text-white hover:bg-neutral-800'}`}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Results Screen State
  if (showResult) {
    const finalScore = score;
    const totalQ = questions.length;
    const percentage = Math.round((finalScore / totalQ) * 100);
    const grade = getGradeInfo(percentage);

    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 max-w-3xl mx-auto flex items-center justify-center">
        <div className={`w-full p-6 sm:p-10 rounded-3xl border shadow-2xl text-center relative overflow-hidden space-y-8 transition-all ${
          isDark 
            ? "bg-black border-white/[0.12] shadow-indigo-950/60 text-white" 
            : "bg-white border-slate-200 shadow-slate-200/50 text-slate-900"
        }`}>
          {/* Ambient Top Glow */}
          <div className={`absolute top-0 right-1/4 w-64 h-64 rounded-full blur-3xl pointer-events-none ${isDark ? 'bg-indigo-500/15' : 'bg-indigo-100/50'}`} />

          {/* Header celebration badge */}
          <div className="space-y-3">
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-semibold ${
              isDark 
                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border-indigo-500/30 text-indigo-300"
                : "bg-indigo-50 border-indigo-200 text-indigo-700"
            }`}>
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Challenge Completed</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {quizTitle}
            </h1>
          </div>

          {/* Saving Indicator */}
          {saving && (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs ${isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
              <div className="w-3.5 h-3.5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
              <span>Syncing score to cloud...</span>
            </div>
          )}

          {/* Circular / Score Gauge Highlight */}
          <div className="flex flex-col items-center justify-center">
            <div className={`relative w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center shadow-xl ${
              isDark 
                ? "bg-black border-indigo-500/30 shadow-indigo-500/15" 
                : "bg-slate-50 border-indigo-400/40 shadow-slate-200"
            }`}>
              <span className={`text-4xl sm:text-5xl font-black font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {percentage}%
              </span>
              <span className={`text-xs font-medium mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {finalScore} of {totalQ} Correct
              </span>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${grade.bg} ${grade.color} border border-white/[0.08]`}>
                Grade {grade.grade} • {grade.label}
              </span>
            </div>
          </div>

          {/* Performance Quick Summary Grid */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Correct</p>
              <p className="text-xl font-bold text-emerald-500 font-['Outfit']">{finalScore}</p>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Incorrect</p>
              <p className="text-xl font-bold text-rose-500 font-['Outfit']">{totalQ - finalScore}</p>
            </div>
            <div className={`p-3.5 rounded-2xl border ${isDark ? 'bg-white/[0.03] border-white/[0.08]' : 'bg-slate-50 border-slate-200'}`}>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Time Spent</p>
              <p className="text-xl font-bold text-cyan-500 font-['Outfit']">
                {formatTime(300 - timeLeft)}
              </p>
            </div>
          </div>

          {/* Action Navigation Buttons: High-Contrast Black & White */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate("/results")}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark 
                  ? "bg-white text-black hover:bg-slate-100 shadow-white/10" 
                  : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>View Score History</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl border font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isDark 
                  ? "bg-white/[0.06] hover:bg-white/[0.1] border-white/[0.1] text-white" 
                  : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz Question View
  const question = questions[currentQuestion];
  const optionLetters = ['A', 'B', 'C', 'D'];
  const progressPercent = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className={`min-h-screen py-6 sm:py-10 px-4 sm:px-6 max-w-4xl mx-auto space-y-6 transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Top Header Card: Title, Question Counter, Countdown Timer */}
      <div className={`p-4 sm:p-6 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${
        isDark ? 'bg-black border-white/[0.1]' : 'bg-white border-slate-200 shadow-md'
      }`}>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Link 
              to="/" 
              className={`p-1.5 rounded-lg transition-colors ${isDark ? 'text-slate-400 hover:text-white hover:bg-white/[0.06]' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
              title="Exit Quiz"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h2 className={`text-lg sm:text-xl font-bold font-['Outfit'] truncate max-w-xs sm:max-w-md ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {quizTitle}
            </h2>
          </div>
          <p className={`text-xs pl-8 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Question <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentQuestion + 1}</span> of {questions.length}
          </p>
        </div>

        {/* Live Timer Pill */}
        <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold ${getTimerColor()}`}>
          <Clock className="w-4 h-4" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className={`w-full rounded-full h-2 overflow-hidden border ${isDark ? 'bg-black border-white/[0.06]' : 'bg-slate-200 border-slate-300'}`}>
        <div
          className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300 shadow-sm shadow-indigo-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Main Question Card */}
      <div className={`p-6 sm:p-10 rounded-3xl border shadow-2xl relative space-y-8 transition-all ${
        isDark ? 'bg-black border-white/[0.1]' : 'bg-white border-slate-200 shadow-xl'
      }`}>
        <div className="space-y-3">
          <span className={`px-3 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider ${isDark ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-200'}`}>
            QUESTION #{currentQuestion + 1}
          </span>
          <h3 className={`text-xl sm:text-2xl font-bold font-['Outfit'] leading-relaxed ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {question?.question}
          </h3>
        </div>

        {/* Options List */}
        <div className="space-y-3">
          {question?.options?.map((option, index) => {
            const isSelected = selectedAnswer === index;
            const letter = optionLetters[index] || index + 1;

            return (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`
                  w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center gap-4 group cursor-pointer
                  ${isSelected
                    ? isDark
                      ? "bg-indigo-600/15 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500"
                      : "bg-indigo-50 border-indigo-600 text-indigo-950 shadow-md shadow-indigo-100 ring-2 ring-indigo-500"
                    : isDark
                      ? "bg-white/[0.02] border-white/[0.08] text-slate-300 hover:text-white hover:bg-white/[0.05] hover:border-white/[0.18]"
                      : "bg-slate-50 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-100 hover:border-slate-300"
                  }
                `}
              >
                {/* Option Letter Badge */}
                <div
                  className={`
                    w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors
                    ${isSelected
                      ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/40"
                      : isDark
                        ? "bg-white/[0.06] border border-white/[0.1] text-slate-400 group-hover:text-white"
                        : "bg-white border border-slate-300 text-slate-700 group-hover:text-slate-900 shadow-sm"
                    }
                  `}
                >
                  {isSelected ? <Check className="w-4 h-4 stroke-[3]" /> : letter}
                </div>

                <span className="text-sm sm:text-base font-medium flex-1">
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Navigation Footer */}
        <div className={`pt-6 border-t flex items-center justify-between ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all disabled:opacity-30 disabled:pointer-events-none flex items-center gap-2 cursor-pointer ${
              isDark 
                ? "border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06]" 
                : "border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center gap-2 cursor-pointer ${
              isDark
                ? "bg-white text-black hover:bg-slate-100 shadow-white/10"
                : "bg-black text-white hover:bg-neutral-800 shadow-black/20"
            }`}
          >
            <span>{currentQuestion === questions.length - 1 ? "Finish Challenge" : "Next Question"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
