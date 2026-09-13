import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import ResumePage from './pages/ResumePage';
import InterviewHistory from './pages/InterviewHistory';
import InterviewRoom from './pages/InterviewRoom';
import ReportPage from './pages/ReportPage';

// Private Route Wrapper
const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Only Route Wrapper (prevents logged in users from seeing login/register pages)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : children;
};

// Title capitalization helper injection for String proto
if (!String.prototype.title) {
  String.prototype.title = function () {
    return this.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  };
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Landing Marketing Page */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          
          {/* Protected Candidate Dashboard & Operations */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/resume" element={<PrivateRoute><ResumePage /></PrivateRoute>} />
          <Route path="/history" element={<PrivateRoute><InterviewHistory /></PrivateRoute>} />
          <Route path="/interview/:id" element={<PrivateRoute><InterviewRoom /></PrivateRoute>} />
          <Route path="/reports/:id" element={<PrivateRoute><ReportPage /></PrivateRoute>} />
          
          {/* Fallback to marketing home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
