import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { OrganizerDashboardPage } from './pages/OrganizerDashboardPage';
import { TournamentPlayersPage } from './pages/TournamentPlayersPage';
import { PlayerRegistrationPage } from './pages/PlayerRegistrationPage';

// Protected Route Component for Organizer Pages
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex flex-col items-center justify-center font-mono text-xs font-bold text-nearblack gap-3">
        <div className="w-8 h-8 border-4 border-orange-accent border-t-transparent animate-spin" />
        <span>AUTHENTICATING ORGANIZER SESSION...</span>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register/:slugOrId" element={<PlayerRegistrationPage />} />

            {/* Protected Organizer Routes */}
            <Route
              path="/organizer"
              element={
                <ProtectedRoute>
                  <OrganizerDashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/organizer/tournaments/:tournamentId/players"
              element={
                <ProtectedRoute>
                  <TournamentPlayersPage />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

