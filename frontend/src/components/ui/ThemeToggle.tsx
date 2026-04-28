import { useThemeStore } from '../../store/themeStore';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <button
      onClick={toggleTheme}
      id="theme-toggle"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      className="relative w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110"
      style={{
        background: theme === 'dark'
          ? 'rgba(99, 102, 241, 0.1)'
          : 'rgba(99, 102, 241, 0.08)',
        border: `1px solid ${theme === 'dark' ? 'rgba(99,102,241,0.2)' : 'rgba(99,102,241,0.15)'}`,
      }}
    >
      <div
        className="transition-all duration-500"
        style={{
          transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(180deg)',
          opacity: 1,
        }}
      >
        {theme === 'dark' ? (
          <Sun size={18} style={{ color: 'var(--accent-amber)' }} />
        ) : (
          <Moon size={18} style={{ color: 'var(--accent-primary)' }} />
        )}
      </div>
    </button>
  );
}
