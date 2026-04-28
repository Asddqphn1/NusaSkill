import { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ui/ThemeToggle';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center relative overflow-hidden page-enter"
      style={{
        background: 'var(--bg-primary)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '450px',
            height: '450px',
            background: 'var(--accent-primary)',
            opacity: 0.06,
            filter: 'blur(100px)',
            top: '5%',
            left: '20%',
          }}
        />
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{
            width: '350px',
            height: '350px',
            background: 'var(--accent-secondary)',
            opacity: 0.04,
            filter: 'blur(80px)',
            bottom: '10%',
            right: '15%',
            animationDelay: '2s',
          }}
        />
        {/* Grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(var(--border-subtle) 1px, transparent 1px),
              linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
            opacity: 0.2,
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* Theme toggle in corner */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Auth Card */}
      <div className="flex flex-col gap-8 items-center max-w-md w-full px-6 py-12 relative z-10">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group" style={{ textDecoration: 'none' }}>
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'var(--gradient-button)',
              boxShadow: 'var(--shadow-button)',
            }}
          >
            <Sparkles size={20} color="white" />
          </div>
          <span
            className="text-2xl font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            NusaSkill
            <span style={{ color: 'var(--accent-primary-light)' }}> AI</span>
          </span>
        </Link>

        {/* Card */}
        <div
          className="glass-card w-full p-8 animate-fade-in"
          style={{
            borderTop: '1px solid var(--border-active)',
          }}
        >
          {/* Form Header */}
          <div
            className="mb-6 pb-5"
            style={{ borderBottom: '1px solid var(--border-muted)' }}
          >
            <h2
              className="font-bold text-2xl mb-1"
              style={{ color: 'var(--text-primary)' }}
            >
              {isLogin ? 'Selamat Datang Kembali' : 'Buat Akun Baru'}
            </h2>
            <p
              className="text-sm"
              style={{ color: 'var(--text-secondary)' }}
            >
              {isLogin
                ? 'Masuk untuk melanjutkan perjalanan belajar Anda.'
                : 'Daftar untuk memulai personalisasi AI.'}
            </p>
          </div>

          {/* Google SSO Button — Dominant */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] hover:shadow-lg"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-primary)',
            }}
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-semibold text-base">
              Masuk dengan Google
            </span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px" style={{ background: 'var(--border-muted)' }} />
            <span
              className="text-xs font-medium tracking-wider uppercase"
              style={{ color: 'var(--text-muted)' }}
            >
              Atau dengan Email
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border-muted)' }} />
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm onSwitch={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onSwitch={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
}
