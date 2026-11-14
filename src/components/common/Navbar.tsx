import React, { useState } from 'react';
import { BookOpen, Sparkles, RotateCcw, Home, Menu, X, Trash2 } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export type ActiveTab = 'dashboard' | 'hiragana' | 'katakana' | 'practice' | 'review';

interface NavbarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  studiedCount: number;
  totalCount?: number;
  onResetProgress?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  studiedCount,
  totalCount = 92,
  onResetProgress,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabChange = (tab: ActiveTab) => {
    onSelectTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Header Fixo Principal */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800/80 shadow-sm transition-colors duration-200 pt-[env(safe-area-inset-top,0px)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo / Marca */}
          <div 
            onClick={() => handleTabChange('dashboard')} 
            className="flex items-center gap-3 cursor-pointer group select-none"
            role="button"
            tabIndex={0}
            title="Ir para o início"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white font-bold text-xl shadow-md group-hover:scale-105 transition-transform">
              あ
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-slate-900 dark:text-white tracking-tight text-lg">
                <span>NihonGo!</span>
                <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-full bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">PT-BR</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">Aprenda Hiragana & Katakana</p>
            </div>
          </div>

          {/* Navegação Desktop */}
          <nav className="hidden md:flex items-center gap-1.5">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 dark:bg-slate-800 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Início</span>
            </button>

            <button
              onClick={() => handleTabChange('hiragana')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'hiragana'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="font-jp font-bold text-xs bg-black/10 dark:bg-black/30 px-1.5 py-0.5 rounded">あ</span>
              <span>Hiragana</span>
            </button>

            <button
              onClick={() => handleTabChange('katakana')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'katakana'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <span className="font-jp font-bold text-xs bg-black/10 dark:bg-black/30 px-1.5 py-0.5 rounded">ア</span>
              <span>Katakana</span>
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'practice'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <Sparkles className="w-4 h-4 text-indigo-300" />
              <span>Exercícios</span>
            </button>

            <button
              onClick={() => handleTabChange('review')}
              className={`px-3 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'review'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/80'
              }`}
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revisão</span>
            </button>
          </nav>

          {/* Progresso Desktop + Alternador de Tema + Reset */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-700/80 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors">
              <BookOpen className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
              <span>{studiedCount} / {totalCount} estudados</span>
            </div>

            {/* Seletor de Tema Light / Dark */}
            <ThemeToggle />

            {onResetProgress && (
              <button
                onClick={() => {
                  if (window.confirm('Deseja realmente reiniciar todo o progresso dos estudos neste navegador?')) {
                    onResetProgress();
                  }
                }}
                title="Reiniciar progresso salvo"
                className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                aria-label="Reiniciar progresso salvo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Área de Ações Mobile (Progresso, Seletor de Tema e Hambúrguer) */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#131b2e] text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-brand-600 dark:text-brand-400">{studiedCount}</span>/{totalCount}
            </div>

            <ThemeToggle />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-none transition-colors"
              aria-label="Abrir menu de navegação"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Dropdown Menu Mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0f172a] px-4 pt-3 pb-6 space-y-2 shadow-lg animate-fadeIn transition-colors">
            <button
              onClick={() => handleTabChange('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-slate-900 dark:bg-slate-800 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Início (Dashboard)</span>
            </button>

            <button
              onClick={() => handleTabChange('hiragana')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'hiragana'
                  ? 'bg-brand-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-jp font-bold text-base bg-black/10 dark:bg-black/30 px-2 py-0.5 rounded">あ</span>
              <span>Hiragana (46 caracteres)</span>
            </button>

            <button
              onClick={() => handleTabChange('katakana')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'katakana'
                  ? 'bg-amber-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-jp font-bold text-base bg-black/10 dark:bg-black/30 px-2 py-0.5 rounded">ア</span>
              <span>Katakana (46 caracteres)</span>
            </button>

            <button
              onClick={() => handleTabChange('practice')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'practice'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-5 h-5 text-indigo-300" />
              <span>Exercícios Interativos</span>
            </button>

            <button
              onClick={() => handleTabChange('review')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                activeTab === 'review'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <RotateCcw className="w-5 h-5" />
              <span>Revisão de Dificuldades</span>
            </button>

            {/* Seletor explícito de Tema no menu mobile */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between px-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Aparência Visual:
              </span>
              <ThemeToggle variant="segmented" />
            </div>

            {onResetProgress && (
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => {
                    if (window.confirm('Deseja realmente reiniciar todo o progresso dos estudos?')) {
                      onResetProgress();
                      setMobileMenuOpen(false);
                    }
                  }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Limpar todo o progresso local</span>
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Barra de Navegação Inferior Móvel Rápida (Estilo App Nativo para Smartphones com suporte a Safe Area iOS) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#0b0f19]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] px-3 flex justify-around items-center md:hidden shadow-lg transition-colors duration-200">
        <button
          onClick={() => handleTabChange('dashboard')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            activeTab === 'dashboard'
              ? 'text-slate-900 dark:text-white font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Início</span>
        </button>

        <button
          onClick={() => handleTabChange('hiragana')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            activeTab === 'hiragana'
              ? 'text-brand-600 dark:text-brand-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span className="font-jp text-base leading-none font-bold">あ</span>
          <span>Hiragana</span>
        </button>

        <button
          onClick={() => handleTabChange('katakana')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            activeTab === 'katakana'
              ? 'text-amber-600 dark:text-amber-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <span className="font-jp text-base leading-none font-bold">ア</span>
          <span>Katakana</span>
        </button>

        <button
          onClick={() => handleTabChange('practice')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            activeTab === 'practice'
              ? 'text-indigo-600 dark:text-indigo-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Exercícios</span>
        </button>

        <button
          onClick={() => handleTabChange('review')}
          className={`flex flex-col items-center gap-0.5 p-1 text-[11px] font-medium transition-colors ${
            activeTab === 'review'
              ? 'text-rose-600 dark:text-rose-400 font-bold'
              : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Revisão</span>
        </button>
      </nav>
    </>
  );
};
