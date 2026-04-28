import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './features/auth/AuthPage';
import LandingPage from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import AssessmentPage from './pages/AssessmentPage';
import ProfilePage from './pages/ProfilePage';
import RoadmapPage from './pages/RoadmapPage';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';

/**
 * ProtectedRoute — Redirects to /auth if not authenticated.
 * Mengarahkan ke /auth jika belum terautentikasi.
 */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/auth" />;
  return <>{children}</>;
}

/**
 * OnboardingGuard — Checks if user has a profile; redirects to /onboarding if not.
 * Memeriksa apakah pengguna memiliki profil; mengarahkan ke /onboarding jika belum.
 */
function OnboardingGuard({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const profile = useAuthStore((s) => s.profile);
  const checkOnboarding = useAuthStore((s) => s.checkOnboarding);

  useEffect(() => {
    if (isAuthenticated) {
      checkOnboarding().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, checkOnboarding]);

  if (!isAuthenticated) return <Navigate to="/auth" />;

  // Loading spinner while checking profile / Spinner saat memeriksa profil
  if (loading) return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center gap-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full" style={{ border: '3px solid var(--border-muted)' }} />
        <div
          className="absolute inset-0 w-12 h-12 rounded-full animate-spin"
          style={{ border: '3px solid transparent', borderTopColor: 'var(--accent-primary)', borderRadius: '50%' }}
        />
      </div>
      <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
        Memeriksa profil...
      </span>
    </div>
  );

  if (!profile) return <Navigate to="/onboarding" />;
  return <>{children}</>;
}

export default function App() {
  // Initialize theme on mount / Inisialisasi tema saat mount
  const theme = useThemeStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card-solid)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-muted)',
            borderRadius: 'var(--radius-md)',
            fontFamily: "'Poppins', sans-serif",
            fontSize: '14px',
          },
        }}
      />
      <Router>
        <Routes>
          {/* Public routes / Rute publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Auth-only routes / Rute yang memerlukan auth */}
          <Route path="/onboarding" element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>} />
          <Route path="/assessment" element={<ProtectedRoute><AssessmentPage /></ProtectedRoute>} />

          {/* Fully guarded routes (auth + profile required) */}
          {/* Rute yang dijaga penuh (auth + profil diperlukan) */}
          <Route path="/profile" element={<OnboardingGuard><ProfilePage /></OnboardingGuard>} />
          <Route path="/roadmap" element={<OnboardingGuard><RoadmapPage /></OnboardingGuard>} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}
