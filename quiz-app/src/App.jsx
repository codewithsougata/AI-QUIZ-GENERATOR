import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import QuizPlay from './pages/QuizPlay';
import Results from './pages/Results';
import Profile from './pages/Profile';
import FirebaseDebug from './pages/FirebaseDebug';

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
}

function AppContent() {
  const { currentUser } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col relative overflow-x-hidden transition-colors duration-300 ${isDark ? 'bg-black text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Dynamic Background Ambient Glowing Orbs */}
      <div className="fixed top-[-10%] left-[20%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="fixed bottom-[-10%] right-[15%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" style={{ animationDelay: '2s' }} />
      <div className="fixed top-[40%] right-[5%] w-[400px] h-[400px] bg-cyan-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Sidebar for authenticated users */}
      {currentUser && (
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={closeSidebar} 
        />
      )}

      {/* Main Layout Area */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${currentUser ? 'lg:ml-64 xl:ml-72' : ''}`}>
        {/* Top Navbar */}
        {currentUser && (
          <Navbar 
            onMenuClick={toggleSidebar} 
            isSidebarOpen={isSidebarOpen} 
          />
        )}

        {/* Page Content Container */}
        <main className={`flex-1 overflow-x-hidden ${currentUser ? 'pt-16 sm:pt-20' : ''}`}>
          <Routes>
            <Route path="/login" element={!currentUser ? <Login /> : <Navigate to="/" replace />} />
            <Route path="/register" element={!currentUser ? <Register /> : <Navigate to="/" replace />} />
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/results" element={<ProtectedRoute><Results /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/quiz/:id" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
            <Route path="/quiz/custom" element={<ProtectedRoute><QuizPlay /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <FirebaseDebug />
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </Router>
  );
}

export default App;