import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { ArrowRight, Brain, Sparkles, GitBranch, Target, Zap } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

/** Feature pill data / Data pill fitur */
const FEATURES = [
  { icon: Brain, text: 'AI-Powered Roadmap' },
  { icon: GitBranch, text: 'Learning Tree Visual' },
  { icon: Target, text: 'Standar SKKNI' },
  { icon: Zap, text: 'Personalisasi Cerdas' },
];

export default function LandingPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <div
      className="flex flex-col min-h-screen overflow-hidden relative w-full page-enter"
      style={{
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* ═══ Navbar ═══ */}
      <Navbar overlay />

      {/* ═══ Animated Background Pattern / Pola Latar Animasi ═══ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs / Bola gradien */}
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{ width: '500px', height: '500px', background: 'var(--accent-primary)', opacity: 0.06, filter: 'blur(120px)', top: '10%', left: '15%' }}
        />
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{ width: '400px', height: '400px', background: 'var(--accent-cyan)', opacity: 0.04, filter: 'blur(100px)', bottom: '10%', right: '10%', animationDelay: '2s' }}
        />
        <div
          className="absolute rounded-full animate-pulse-glow"
          style={{ width: '300px', height: '300px', background: 'var(--accent-secondary)', opacity: 0.04, filter: 'blur(80px)', top: '50%', right: '30%', animationDelay: '4s' }}
        />

        {/* Orbiting AI nodes (hidden on small mobile) / Node orbit AI (disembunyikan di mobile kecil) */}
        <div className="hidden sm:block">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute"
              style={{
                width: '6px', height: '6px', borderRadius: '50%',
                background: 'var(--accent-primary-light)',
                opacity: 0.3 + i * 0.05,
                top: '50%', left: '50%',
                animation: `orbit ${20 + i * 5}s linear infinite`,
                animationDelay: `${i * 3}s`,
              }}
            />
          ))}
        </div>

        {/* Grid pattern / Pola grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(var(--border-subtle) 1px, transparent 1px), linear-gradient(90deg, var(--border-subtle) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            opacity: 0.3,
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
            WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          }}
        />
      </div>

      {/* ═══ Hero Section / Bagian Hero ═══ */}
      <main className="flex flex-1 flex-col items-center justify-center relative w-full pt-20 sm:pt-24 z-10">
        <div className="flex flex-col items-center w-full max-w-5xl px-4 sm:px-6 py-12 sm:py-16 md:py-24">
          {/* Pill Badge */}
          <div
            className="animate-fade-in-up flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full mb-6 sm:mb-8"
            style={{ background: 'var(--glow-primary)', border: '1px solid var(--border-subtle)' }}
          >
            <Sparkles size={14} style={{ color: 'var(--accent-primary-light)' }} />
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase" style={{ color: 'var(--accent-primary-light)' }}>
              Powered by AI & SKKNI
            </span>
          </div>

          {/* Headline / Judul Utama */}
          <div className="flex flex-col items-center max-w-4xl mb-6 sm:mb-8 text-center animate-fade-in-up" style={{ animationDelay: '0.1s', opacity: 0 }}>
            <h1 className="font-extrabold text-3xl sm:text-5xl md:text-7xl leading-[1.08] tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Jalur Personalisasi
              <br />
              Menuju Keahlian,
              <br />
              <span style={{ background: 'var(--gradient-hero)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Didukung oleh AI.
              </span>
            </h1>
          </div>

          {/* Subtitle / Sub judul */}
          <div className="flex flex-col items-center max-w-2xl mb-8 sm:mb-12 text-center animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <p className="text-base sm:text-lg md:text-xl leading-relaxed px-2" style={{ color: 'var(--text-secondary)' }}>
              Bangun roadmap karir Anda dengan kecerdasan buatan yang memahami potensi unik Anda dalam ekosistem digital Indonesia.
            </p>
          </div>

          {/* CTA Button / Tombol CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up" style={{ animationDelay: '0.3s', opacity: 0 }}>
            <Link
              to={isAuthenticated ? '/roadmap' : '/auth?tab=register'}
              className="btn-primary text-sm sm:text-base px-8 sm:px-10 py-3.5 sm:py-4 group w-full sm:w-auto text-center"
              style={{ borderRadius: 'var(--radius-full)', fontSize: '15px' }}
            >
              Mulai Perjalananmu
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Feature Pills / Pill Fitur */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-12 sm:mt-16 animate-fade-in-up" style={{ animationDelay: '0.4s', opacity: 0 }}>
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', backdropFilter: 'blur(8px)' }}
              >
                <feature.icon size={13} style={{ color: 'var(--accent-primary-light)' }} />
                <span className="text-[11px] sm:text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                  {feature.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* ═══ Footer ═══ */}
      <footer
        className="w-full px-4 sm:px-8 py-6 sm:py-8 flex items-center justify-center z-10"
        style={{ borderTop: '1px solid var(--border-muted)' }}
      >
        <p className="text-[10px] sm:text-xs tracking-widest uppercase text-center" style={{ color: 'var(--text-muted)', opacity: 0.6 }}>
          © 2026 NUSASKILL AI. By Team git push .env
        </p>
      </footer>
    </div>
  );
}
