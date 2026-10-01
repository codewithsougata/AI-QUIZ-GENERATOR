import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { db, QUIZ_RESULTS_COLLECTION } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  orderBy
} from "firebase/firestore";
import { 
  BarChart3, 
  Trash2, 
  RefreshCw, 
  Calendar, 
  Clock, 
  Trophy, 
  Sparkles, 
  BrainCircuit, 
  CheckCircle2, 
  AlertCircle,
  Filter,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import AIGeneratorModal from "../components/AIGeneratorModal";

export default function Results() {
  const { currentUser } = useAuth();
  const { isDark } = useTheme();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [resultToDelete, setResultToDelete] = useState(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (currentUser) {
      fetchResultsFromFirebase();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchResultsFromFirebase = async () => {
    if (!currentUser) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const q = query(
        collection(db, QUIZ_RESULTS_COLLECTION),
        where("userId", "==", currentUser.uid),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const firebaseResults = [];

      querySnapshot.forEach((document) => {
        const data = document.data();
        firebaseResults.push({
          id: document.id,
          ...data,
          timestamp: data.createdAt?.seconds
            ? new Date(data.createdAt.seconds * 1000).toISOString()
            : data.timestamp || null,
          quizTitle: data.quizTitle || "Untitled Quiz",
          score: data.score || 0,
          totalQuestions: data.totalQuestions || 0,
          percentage: data.percentage || 0,
          timeSpent: data.timeSpent || 0,
          isCustom: data.isCustom || false,
        });
      });

      setResults(firebaseResults);
      localStorage.setItem("quizResults", JSON.stringify(firebaseResults));

    } catch (err) {
      setError("Failed to fetch cloud records: " + err.message);
      try {
        const localResults = JSON.parse(localStorage.getItem("quizResults") || "[]");
        setResults(localResults);
      } catch {
        setResults([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteResult = async (resultId) => {
    try {
      await deleteDoc(doc(db, QUIZ_RESULTS_COLLECTION, resultId));
      const updated = results.filter(r => r.id !== resultId);
      setResults(updated);
      localStorage.setItem("quizResults", JSON.stringify(updated));
      setShowDeleteConfirm(false);
    } catch (err) {
      setError("Delete failed: " + err.message);
    }
  };

  const clearAllResults = async () => {
    try {
      const q = query(
        collection(db, QUIZ_RESULTS_COLLECTION),
        where("userId", "==", currentUser.uid)
      );
      const snap = await getDocs(q);
      const deletes = snap.docs.map(d => deleteDoc(doc(db, QUIZ_RESULTS_COLLECTION, d.id)));
      await Promise.all(deletes);

      setResults([]);
      localStorage.removeItem("quizResults");
      setShowDeleteConfirm(false);
    } catch (err) {
      setError("Clear all failed: " + err.message);
    }
  };

  // KPIs
  const totalQuizzes = results.length;
  const avgAccuracy = totalQuizzes > 0
    ? Math.round(results.reduce((acc, r) => acc + (r.percentage || 0), 0) / totalQuizzes)
    : 0;
  const totalTimeSpentSeconds = results.reduce((acc, r) => acc + (r.timeSpent || 0), 0);
  const bestScore = totalQuizzes > 0
    ? Math.max(...results.map(r => r.percentage || 0))
    : 0;

  const filteredResults = results.filter(r => {
    if (filterType === "ai") return r.isCustom;
    if (filterType === "predefined") return !r.isCustom;
    return true;
  });

  const getGradeInfo = (p) => {
    if (p >= 90) return { grade: "A+", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    if (p >= 80) return { grade: "A", color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20" };
    if (p >= 70) return { grade: "B", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
    if (p >= 60) return { grade: "C", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" };
    return { grade: "F", color: "text-rose-400 bg-rose-500/10 border-rose-500/20" };
  };

  const formatSeconds = (sec) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins}m ${s}s`;
  };

  if (!currentUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-400 font-medium">Please sign in to view analytics</p>
      </div>
    );
  }

  return (
    <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 transition-colors duration-300 ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
      
      {/* Header and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <BarChart3 className="w-5 h-5" />
            </span>
            <h1 className={`text-2xl sm:text-3xl font-extrabold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Analytics & History
            </h1>
          </div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Track your performance, accuracy trends, and quiz completion history
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchResultsFromFirebase}
            className={`px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer ${
              isDark 
                ? "bg-white/[0.04] hover:bg-white/[0.08] border-white/[0.08] text-slate-300 hover:text-white"
                : "bg-white hover:bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 shadow-sm"
            }`}
            title="Refresh from Cloud"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {results.length > 0 && (
            <button
              onClick={() => {
                setResultToDelete("all");
                setShowDeleteConfirm(true);
              }}
              className="px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-500 text-xs font-semibold flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-2xl border shadow-lg transition-all ${isDark ? 'bg-black border-white/[0.08]' : 'bg-white border-slate-200 shadow-slate-100'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Quizzes Taken</p>
          <p className={`text-3xl font-black font-['Outfit'] mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{totalQuizzes}</p>
          <p className="text-[11px] text-indigo-500 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Completed
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-lg transition-all ${isDark ? 'bg-black border-white/[0.08]' : 'bg-white border-slate-200 shadow-slate-100'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Average Accuracy</p>
          <p className="text-3xl font-black text-indigo-500 font-['Outfit'] mt-1">{avgAccuracy}%</p>
          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Across all subjects</p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-lg transition-all ${isDark ? 'bg-black border-white/[0.08]' : 'bg-white border-slate-200 shadow-slate-100'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Best Score</p>
          <p className="text-3xl font-black text-emerald-500 font-['Outfit'] mt-1">{bestScore}%</p>
          <p className="text-[11px] text-emerald-500 mt-1 flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Peak Performance
          </p>
        </div>

        <div className={`p-5 rounded-2xl border shadow-lg transition-all ${isDark ? 'bg-black border-white/[0.08]' : 'bg-white border-slate-200 shadow-slate-100'}`}>
          <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Study Time</p>
          <p className="text-3xl font-black text-cyan-500 font-['Outfit'] mt-1">
            {Math.floor(totalTimeSpentSeconds / 60)}m
          </p>
          <p className={`text-[11px] mt-1 flex items-center gap-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <Clock className="w-3 h-3" /> Active focus
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className={`flex items-center gap-2 border-b pb-3 ${isDark ? 'border-white/[0.08]' : 'border-slate-200'}`}>
        <Filter className={`w-4 h-4 mr-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
        {[
          { id: "all", label: `All (${results.length})` },
          { id: "ai", label: `AI Generated (${results.filter(r => r.isCustom).length})` },
          { id: "predefined", label: `Predefined (${results.filter(r => !r.isCustom).length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`
              px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer
              ${filterType === tab.id
                ? isDark
                  ? "bg-white text-black shadow-md shadow-white/10"
                  : "bg-black text-white shadow-md shadow-black/20"
                : isDark
                  ? "text-slate-400 hover:text-white hover:bg-white/[0.05]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Results Content */}
      {loading ? (
        <div className="py-16 text-center space-y-3">
          <div className="w-10 h-10 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400">Loading your performance records...</p>
        </div>
      ) : filteredResults.length === 0 ? (
        <div className={`py-16 px-6 text-center rounded-3xl border space-y-4 max-w-lg mx-auto shadow-xl ${isDark ? 'bg-black border-white/[0.08] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mx-auto">
            <Sparkles className="w-7 h-7" />
          </div>
          <h3 className={`text-xl font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>No Quiz Results Yet</h3>
          <p className={`text-xs sm:text-sm max-w-sm mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Generate your first AI quiz or tackle one of the curated programming challenges to start building your record.
          </p>
          <button
            onClick={() => setShowAIModal(true)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg transition-all cursor-pointer ${isDark ? 'bg-white text-black hover:bg-slate-100 shadow-white/10' : 'bg-black text-white hover:bg-neutral-800 shadow-black/20'}`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Generate First AI Quiz</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredResults.map((result) => {
            const grade = getGradeInfo(result.percentage);

            return (
              <div
                key={result.id}
                className={`relative rounded-2xl border p-5 sm:p-6 shadow-xl transition-all duration-200 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between group ${
                  isDark
                    ? "bg-black border-white/[0.08] hover:border-indigo-500/30"
                    : "bg-white border-slate-200 hover:border-slate-300 shadow-slate-100 hover:shadow-slate-300/40"
                }`}
              >
                {/* Delete button */}
                <button
                  onClick={() => {
                    setResultToDelete(result.id);
                    setShowDeleteConfirm(true);
                  }}
                  className="absolute top-4 right-4 p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                  title="Delete Result"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <div className="space-y-4">
                  {/* Badges: Type and Grade */}
                  <div className="flex items-center justify-between pr-8">
                    {result.isCustom ? (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20' : 'bg-purple-50 text-purple-700 border border-purple-200'}`}>
                        <Sparkles className="w-3 h-3 text-purple-500" />
                        AI Generated
                      </span>
                    ) : (
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${isDark ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' : 'bg-blue-50 text-blue-700 border border-blue-200'}`}>
                        Curated
                      </span>
                    )}

                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${grade.color}`}>
                      Grade {grade.grade}
                    </span>
                  </div>

                  <div>
                    <h3 className={`text-lg font-bold font-['Outfit'] truncate transition-colors ${isDark ? 'text-white group-hover:text-indigo-300' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                      {result.topic || result.quizTitle}
                    </h3>
                    <p className={`text-xs flex items-center gap-1.5 mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      <Calendar className={`w-3 h-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
                      <span>
                        {result.timestamp
                          ? new Date(result.timestamp).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric"
                            })
                          : "Recently"}
                      </span>
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className={`w-full rounded-full h-1.5 overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 rounded-full"
                      style={{ width: `${result.percentage}%` }}
                    />
                  </div>

                  {/* 3 Metric Pills */}
                  <div className="grid grid-cols-3 gap-2 text-center pt-1">
                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Score</p>
                      <p className={`text-sm font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {result.score}/{result.totalQuestions}
                      </p>
                    </div>

                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Accuracy</p>
                      <p className="text-sm font-bold text-indigo-500 font-['Outfit']">
                        {result.percentage}%
                      </p>
                    </div>

                    <div className={`p-2 rounded-xl border ${isDark ? 'bg-white/[0.02] border-white/[0.04]' : 'bg-slate-50 border-slate-200'}`}>
                      <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Time</p>
                      <p className="text-sm font-bold text-cyan-500 font-['Outfit']">
                        {formatSeconds(result.timeSpent || 0)}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`max-w-md w-full p-6 rounded-3xl border shadow-2xl space-y-4 ${isDark ? 'bg-black border-white/[0.1] text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
            <h3 className={`text-lg font-bold font-['Outfit'] ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {resultToDelete === "all" ? "Clear All Score History?" : "Delete This Quiz Record?"}
            </h3>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              This action permanently removes the selected result data from your cloud account. This cannot be undone.
            </p>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isDark ? 'border-white/[0.1] text-slate-300 hover:text-white hover:bg-white/[0.06]' : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (resultToDelete === "all") {
                    clearAllResults();
                  } else {
                    deleteResult(resultToDelete);
                  }
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30 transition-colors cursor-pointer"
              >
                {resultToDelete === "all" ? "Clear All History" : "Delete Record"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Modal Trigger */}
      {showAIModal && <AIGeneratorModal onClose={() => setShowAIModal(false)} />}
    </div>
  );
}
