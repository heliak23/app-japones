import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  variant?: 'button' | 'segmented';
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  variant = 'button',
  showLabel = false,
}) => {
  const { isDark, toggleTheme, setTheme } = useTheme();

  if (variant === 'segmented') {
    return (
      <div
        className={`inline-flex items-center p-1 rounded-full bg-slate-200/80 dark:bg-slate-800 border border-slate-300/60 dark:border-slate-700/60 transition-colors ${className}`}
        role="group"
        aria-label="Seleção de tema"
      >
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme('light');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            !isDark
              ? 'bg-white text-amber-600 shadow-sm'
              : 'text-slate-500 hover:text-slate-200'
          }`}
          aria-pressed={!isDark}
          title="Ativar tema claro"
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Claro</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme('dark');
          }}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isDark
              ? 'bg-[#182238] text-indigo-300 shadow-sm border border-indigo-500/30'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          aria-pressed={isDark}
          title="Ativar tema escuro"
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Escuro</span>
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTheme();
      }}
      className={`relative inline-flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-[#131b2e] hover:bg-slate-200/80 dark:hover:bg-[#182238] border border-slate-200 dark:border-slate-700/80 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm group active:scale-95 cursor-pointer ${className}`}
      aria-label={isDark ? 'Mudar para tema claro (Light Mode)' : 'Mudar para tema escuro (Dark Mode)'}
      title={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      <div className="relative w-5 h-5 flex items-center justify-center pointer-events-none">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" />
        ) : (
          <Moon className="w-4 h-4 text-indigo-600 group-hover:-rotate-12 transition-transform duration-300" />
        )}
      </div>

      {showLabel && (
        <span className="ml-2 text-xs font-semibold pointer-events-none">
          {isDark ? 'Modo Claro' : 'Modo Escuro'}
        </span>
      )}
    </button>
  );
};
