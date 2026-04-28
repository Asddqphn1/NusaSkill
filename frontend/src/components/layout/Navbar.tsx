import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';
import { Sparkles, Menu, X } from 'lucide-react';

interface NavbarProps {
  /** If true, uses transparent/overlay style (for landing page). */
  overlay?: boolean;
}

export default function Navbar({ overlay = false }: NavbarProps) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ctaLink = isAuthenticated ? '/profile' : '/auth';
  const ctaLabel = isAuthenticated ? 'Dasbor Saya' : 'Mulai Belajar';

  return (
    <header
      className={`w-full z-50 transition-all duration-300 ${
        overlay ? 'absolute top-0 left-0' : 'sticky top-0'
      }`}
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        background: overlay
          ? 'rgba(var(--bg-primary-rgb, 18,18,18), 0.7)'
          : 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-muted)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Logo / Branding */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          style={{ textDecoration: 'none' }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
            style={{
              background: 'var(--gradient-button)',
              boxShadow: 'var(--shadow-button)',
            }}
          >
            <Sparkles size={16} color="white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            NusaSkill
            <span style={{ color: 'var(--accent-primary-light)' }}> AI</span>
          </span>
        </Link>

        {/* Desktop Right Side / Sisi kanan desktop */}
        <div className="hidden sm:flex items-center gap-3">
          <ThemeToggle />
          <Link
            to={ctaLink}
            className="btn-primary text-sm px-5 py-2.5"
            style={{ borderRadius: 'var(--radius-full)', fontSize: '14px' }}
          >
            {ctaLabel}
          </Link>
        </div>

        {/* Mobile Hamburger / Hamburger mobile */}
        <div className="sm:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-muted)',
              color: 'var(--text-secondary)',
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu / Menu dropdown mobile */}
      {mobileOpen && (
        <div
          className="sm:hidden animate-fade-in-down px-4 pb-4"
          style={{
            background: overlay ? 'var(--bg-secondary)' : 'transparent',
            borderTop: '1px solid var(--border-muted)',
          }}
        >
          <Link
            to={ctaLink}
            onClick={() => setMobileOpen(false)}
            className="btn-primary w-full text-sm py-3 mt-3"
            style={{ borderRadius: 'var(--radius-md)', fontSize: '14px' }}
          >
            {ctaLabel}
          </Link>
        </div>
      )}

      {/* Gradient accent line / Garis aksen gradien */}
      <div
        className="h-px w-full"
        style={{
          background: 'linear-gradient(to right, transparent, var(--accent-primary), transparent)',
          opacity: 0.3,
        }}
      />
    </header>
  );
}
