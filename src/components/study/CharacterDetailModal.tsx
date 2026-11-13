import React, { useEffect } from 'react';
import type { KanaCharacter } from '../../types/kana';
import { Volume2, VolumeX, X, ChevronLeft, ChevronRight, CheckCircle2, Lightbulb } from 'lucide-react';

interface CharacterDetailModalProps {
  character: KanaCharacter | null;
  onClose: () => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
  isStudied: boolean;
  onMarkStudied: (characterId: string) => void;
  onPlayAudio: (char: string) => void;
  isPlaying?: boolean;
}

export const CharacterDetailModal: React.FC<CharacterDetailModalProps> = ({
  character,
  onClose,
  onNext,
  onPrev,
  hasPrev = true,
  hasNext = true,
  isStudied,
  onMarkStudied,
  onPlayAudio,
  isPlaying = false,
}) => {
  // Marca como estudado automaticamente ao abrir para estudo
  useEffect(() => {
    if (character && !isStudied) {
      onMarkStudied(character.id);
    }
  }, [character, isStudied, onMarkStudied]);

  // Teclas de atalho para navegação
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && onNext && hasNext) onNext();
      if (e.key === 'ArrowLeft' && onPrev && hasPrev) onPrev();
      if (e.key === ' ' && character) {
        e.preventDefault();
        onPlayAudio(character.character);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [character, onClose, onNext, onPrev, hasNext, hasPrev, onPlayAudio]);

  if (!character) return null;

  const isHiragana = character.alphabet === 'hiragana';
  const themeBg = isHiragana ? 'from-rose-500 to-brand-600' : 'from-amber-500 to-orange-600';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-[#131b2e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo com gradiente */}
        <div className={`p-6 bg-gradient-to-r ${themeBg} text-white flex items-center justify-between`}>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2.5 py-1 rounded-full">
              {character.alphabet === 'hiragana' ? 'Hiragana (ひらがな)' : 'Katakana (カタカナ)'}
            </span>
            {isStudied && (
              <span className="inline-flex items-center gap-1 text-xs bg-emerald-500/30 text-emerald-100 px-2 py-0.5 rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                Estudado
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            title="Fechar (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corpo com Caractere em Destaque */}
        <div className="p-6 sm:p-8 space-y-6">
          <div className="text-center">
            {/* Caractere Gigante */}
            <div className="relative inline-block my-2">
              <span className="font-jp text-8xl sm:text-9xl font-black text-slate-900 dark:text-slate-100 tracking-tight select-none">
                {character.character}
              </span>
            </div>

            {/* Romaji */}
            <div className="mt-1">
              <span className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-widest">
                {character.romaji}
              </span>
            </div>

            {/* Botão de Áudio com Atalho */}
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => onPlayAudio(character.character)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm transition-all shadow-sm ${
                  isPlaying
                    ? 'bg-brand-600 text-white animate-pulse'
                    : 'bg-slate-100 dark:bg-[#182238] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700'
                }`}
              >
                {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />}
                <span>{isPlaying ? 'Reproduzindo...' : 'Ouvir Pronúncia'}</span>
                <kbd className="hidden sm:inline-block text-[10px] bg-white/70 dark:bg-black/40 px-1.5 py-0.5 rounded font-mono text-slate-500 dark:text-slate-400">
                  Espaço
                </kbd>
              </button>
            </div>
          </div>

          {/* Pronúncia para Brasileiros */}
          <div className="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              Pronúncia em Português (PT-BR)
            </h4>
            <p className="text-base font-semibold text-slate-900 dark:text-slate-100">
              {character.ptPronunciation}
            </p>
          </div>

          {/* Dica Mnemônica */}
          {character.mnemonicNote && (
            <div className="bg-amber-50/80 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
                  Dica de Memorização
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
                  {character.mnemonicNote}
                </p>
              </div>
            </div>
          )}

          {/* Navegação entre Caracteres */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={onPrev}
              disabled={!hasPrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>

            <button
              onClick={onNext}
              disabled={!hasNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
