import { useState, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import ThemeToggle from '../ui/ThemeToggle';
import {
  User,
  BookOpen,
  LogOut,
  Sparkles,
  Menu,
  X,
} from 'lucide-react';

/** Navigation items — shared between desktop sidebar and mobile nav */
const NAV_ITEMS = [
  { path: '/profile', label: 'Profil', icon: User },
  { path: '/roadmap', label: 'Roadmap', icon: BookOpen },
] as const;

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /** Check if a nav item is currently active / Cek apakah item navigasi sedang aktif */
  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className="min-h-screen flex page-enter"
      style={{
        background: 'var(--bg-primary)',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* 
          DESKTOP SIDEBAR — Hidden on mobile (md:flex)
          Sidebar desktop — Tersembunyi di mobile
      */}
      <aside
        className="w-[260px] hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen"
        style={{
          background: 'var(--bg-sidebar)',
          borderRight: '1px solid var(--border-muted)',
        }}
      >
        {/* Logo / Branding */}
        <Link
          to="/"
          className="p-6 flex items-center gap-2 group"
          style={{
            borderBottom: '1px solid var(--border-muted)',
            textDecoration: 'none',
          }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
            style={{
              background: 'var(--gradient-button)',
              boxShadow: 'var(--shadow-button)',
            }}
          >
            <Sparkles size={14} color="white" />
          </div>
          <span
            className="text-lg font-bold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            NusaSkill
            <span style={{ color: 'var(--accent-primary-light)' }}> AI</span>
          </span>
        </Link>

        {/* Navigation Links / Tautan Navigasi */}
        <nav className="flex-1 p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm"
                style={{
                  background: active ? 'var(--glow-primary)' : 'transparent',
                  color: active ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                  border: active ? '1px solid var(--border-active)' : '1px solid transparent',
                  textDecoration: 'none',
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle + Logout / Tombol Tema + Keluar */}
        <div className="p-4 space-y-2" style={{ borderTop: '1px solid var(--border-muted)' }}>
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
              Tema
            </span>
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors cursor-pointer hover:opacity-80"
            style={{ color: 'var(--accent-rose)', background: 'transparent', border: 'none' }}
          >
            <LogOut size={18} />
            Keluar
          </button>
        </div>
      </aside>

      {/*
          MOBILE HEADER — Visible on small screens only
          Header mobile — Hanya tampil di layar kecil
      */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50"
        style={{
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-muted)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2" style={{ textDecoration: 'none' }}>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--gradient-button)' }}
            >
              <Sparkles size={12} color="white" />
            </div>
            <span className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
              NusaSkill<span style={{ color: 'var(--accent-primary-light)' }}> AI</span>
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer"
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-muted)',
                color: 'var(--text-secondary)',
              }}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/*
          MOBILE MENU OVERLAY — Hamburger dropdown
          Overlay menu mobile — Dropdown hamburger
     */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-40"
          onClick={() => setMobileMenuOpen(false)}
        >
          {/* Backdrop / Latar belakang */}
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
          />

          {/* Menu Panel / Panel Menu */}
          <div
            className="absolute top-[56px] left-0 right-0 p-4 animate-fade-in-down"
            style={{
              background: 'var(--bg-secondary)',
              borderBottom: '1px solid var(--border-muted)',
              boxShadow: 'var(--shadow-elevated)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="space-y-1 mb-4">
              {NAV_ITEMS.map((item) => {
                const active = isActive(item.path);
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm cursor-pointer"
                    style={{
                      background: active ? 'var(--glow-primary)' : 'transparent',
                      color: active ? 'var(--accent-primary-light)' : 'var(--text-secondary)',
                      border: active ? '1px solid var(--border-active)' : '1px solid transparent',
                    }}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                );
              })}
            </nav>

            <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '12px' }}>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm cursor-pointer"
                style={{ color: 'var(--accent-rose)', background: 'transparent', border: 'none' }}
              >
                <LogOut size={18} />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
          MAIN CONTENT AREA — Adapts to sidebar
          Area konten utama — Menyesuaikan dengan sidebar
       */}
      <main className="flex-1 min-w-0 overflow-y-auto relative">
        {/* Background glow decoration / Dekorasi cahaya latar */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: 'var(--accent-primary)',
              opacity: 0.03,
              filter: 'blur(120px)',
              top: 0,
              right: 0,
            }}
          />
        </div>

        {/* Content with top padding on mobile for fixed header */}
        {/* Konten dengan padding atas di mobile untuk header fixed */}
        <div className="relative z-10 pt-[72px] md:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
