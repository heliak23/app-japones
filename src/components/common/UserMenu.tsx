import React, { useState, useRef, useEffect } from 'react';
import { LogIn, LogOut, Cloud, ChevronDown, Sparkles, KeyRound } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface UserMenuProps {
  onOpenAuthModal: (tab?: 'login' | 'register') => void;
  onOpenChangePassword?: () => void;
  isMobileDrawer?: boolean;
  onMobileClose?: () => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  onOpenAuthModal,
  onOpenChangePassword,
  isMobileDrawer = false,
  onMobileClose,
}) => {
  const { user, profile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  // Não autenticado
  if (!user) {
    if (isMobileDrawer) {
      return (
        <div className="p-3 bg-gradient-to-r from-brand-50 to-indigo-50 dark:from-brand-950/40 dark:to-indigo-950/40 rounded-2xl border border-brand-200/60 dark:border-brand-800/60 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>Salve seu progresso na nuvem</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onOpenAuthModal('login');
                onMobileClose?.();
              }}
              className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all text-center"
            >
              Entrar
            </button>
            <button
              onClick={() => {
                onOpenAuthModal('register');
                onMobileClose?.();
              }}
              className="flex-1 py-2 px-3 rounded-xl border border-brand-600 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/60 text-xs font-bold transition-all text-center"
            >
              Criar Conta
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onOpenAuthModal('login')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-700 hover:to-rose-700 text-white text-xs font-bold shadow-sm shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          title="Fazer Login ou Criar Conta"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Entrar</span>
        </button>
      </div>
    );
  }

  // Autenticado
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Estudante';
  const initial = displayName.charAt(0).toUpperCase();

  if (isMobileDrawer) {
    return (
      <div className="p-3 bg-slate-100 dark:bg-[#131b2e] rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {initial}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {displayName}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
              {user.email}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1.5 rounded-lg border border-emerald-200/50 dark:border-emerald-800/50">
          <Cloud className="w-3.5 h-3.5 shrink-0" />
          <span>Progresso salvo no Supabase</span>
        </div>

        {onOpenChangePassword && (
          <button
            onClick={() => {
              onMobileClose?.();
              onOpenChangePassword();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-200/70 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold hover:bg-slate-300/70 dark:hover:bg-slate-700 transition-colors"
          >
            <KeyRound className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Alterar senha</span>
          </button>
        )}

        <button
          onClick={() => {
            signOut();
            onMobileClose?.();
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sair da conta</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-100 dark:bg-[#131b2e] hover:bg-slate-200/80 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-200 transition-all select-none"
        aria-expanded={menuOpen}
        aria-label="Menu do usuário"
      >
        <div className="relative">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm">
            {initial}
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#0b0f19]" />
        </div>
        <span className="max-w-[100px] truncate font-semibold">{displayName}</span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#111927] border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 animate-fadeIn text-xs">
          {/* Cabeçalho do Dropdown */}
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
            <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
              {displayName}
            </div>
            <div className="text-slate-500 dark:text-slate-400 truncate text-[11px]">
              {user.email}
            </div>
          </div>

          {/* Status da Nuvem */}
          <div className="px-4 py-2.5 flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium bg-emerald-50/50 dark:bg-emerald-950/20 my-1">
            <Cloud className="w-4 h-4 shrink-0" />
            <span className="text-[11px]">Sincronização na nuvem ativa</span>
          </div>

          {/* Ações */}
          <div className="px-2 pt-1 space-y-1">
            {onOpenChangePassword && (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onOpenChangePassword();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors text-left"
              >
                <KeyRound className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Alterar senha</span>
              </button>
            )}

            <button
              onClick={() => {
                setMenuOpen(false);
                signOut();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition-colors text-left"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da conta</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
