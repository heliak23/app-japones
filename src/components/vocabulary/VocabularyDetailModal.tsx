import React, { useEffect } from 'react';
import type { VocabularyWord } from '../../types/vocabulary';
import { FuriganaText } from '../common/FuriganaText';
import {
  X,
  Volume2,
  Bookmark,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Lightbulb,
} from 'lucide-react';

interface VocabularyDetailModalProps {
  word: VocabularyWord | null;
  isOpen: boolean;
  onClose: () => void;
  isLearned: boolean;
  isBookmarked: boolean;
  onToggleLearned: (id: string) => void;
  onToggleBookmarked: (id: string) => void;
  onPlayAudio: (text: string) => void;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
  isPlayingAudio?: boolean;
}

export const VocabularyDetailModal: React.FC<VocabularyDetailModalProps> = ({
  word,
  isOpen,
  onClose,
  isLearned,
  isBookmarked,
  onToggleLearned,
  onToggleBookmarked,
  onPlayAudio,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
  isPlayingAudio = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !word) return null;

  const hasKanji = word.kanji !== word.kana;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[92vh] flex flex-col bg-white dark:bg-[#131b2e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60">
              {word.categoryLabel}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
              {word.source}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {hasPrev && onPrev && (
              <button
                type="button"
                onClick={onPrev}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Palavra anterior (Seta Esquerda)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && onNext && (
              <button
                type="button"
                onClick={onNext}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Próxima palavra (Seta Direita)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-1"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {/* Apresentação Principal da Palavra */}
          <div className="bg-gradient-to-br from-slate-50 to-brand-50/30 dark:from-slate-900/80 dark:to-brand-950/20 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 text-center relative">
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleBookmarked(word.id)}
                className={`p-2 rounded-2xl transition-colors ${
                  isBookmarked
                    ? 'text-amber-500 bg-amber-100 dark:bg-amber-950/80'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 bg-white/80 dark:bg-slate-800/80'
                }`}
                title={isBookmarked ? 'Remover dos favoritos' : 'Favoritar'}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </button>
              <button
                type="button"
                onClick={() => onToggleLearned(word.id)}
                className={`p-2 rounded-2xl transition-colors ${
                  isLearned
                    ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/80'
                    : 'text-slate-400 hover:text-emerald-600 bg-white/80 dark:bg-slate-800/80'
                }`}
                title={isLearned ? 'Palavra dominada' : 'Marcar como aprendida'}
              >
                <CheckCircle2 className={`w-4 h-4 ${isLearned ? 'fill-emerald-500 text-white dark:text-emerald-950' : ''}`} />
              </button>
            </div>

            <span className="font-jp text-4xl sm:text-5xl font-normal text-slate-900 dark:text-white leading-relaxed select-none block">
              {word.kanji}
            </span>

            {hasKanji && (
              <p className="font-jp text-base font-normal text-slate-600 dark:text-slate-300 mt-1">
                {word.kana}
              </p>
            )}

            <p className="text-sm font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">
              {word.romaji}
            </p>

            <h3 className="text-xl sm:text-2xl font-extrabold text-brand-600 dark:text-brand-400 mt-3">
              {word.meaning}
            </h3>

            <div className="mt-4 flex items-center justify-center">
              <button
                type="button"
                onClick={() => onPlayAudio(word.audioText)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/60 text-slate-700 dark:text-slate-200 text-xs font-bold shadow-xs border border-slate-200 dark:border-slate-700 transition-all hover:scale-105 active:scale-95"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce text-brand-600' : ''}`} />
                <span>Ouvir Pronúncia</span>
              </button>
            </div>
          </div>

          {/* Frase de Exemplo em Contexto (Filosofia das Apostilas) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Exemplo em Contexto Real</span>
              </h4>
              <button
                type="button"
                onClick={() => onPlayAudio(word.exampleSentence.audioText)}
                className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Ouvir Frase</span>
              </button>
            </div>

            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 space-y-2">
              <div className="py-1">
                <FuriganaText
                  fragments={word.exampleSentence.furiganaFragments}
                  size="md"
                  highlightNew={true}
                />
              </div>

              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                {word.exampleSentence.romaji}
              </p>

              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                "{word.exampleSentence.meaning}"
              </p>
            </div>
          </div>

          {/* Notas Pedagógicas / Dicas do Material */}
          {word.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 flex items-start gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
                  Dica de Fixação & Gramática
                </h5>
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  {word.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé com Ação Rápida */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500 dark:text-slate-400">
            Nível recomendado: <strong className="text-slate-700 dark:text-slate-300">{word.jlptLevel}</strong>
          </span>

          <button
            type="button"
            onClick={() => onToggleLearned(word.id)}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold transition-all shadow-xs ${
              isLearned
                ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-brand-600 text-white hover:bg-brand-500'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isLearned ? 'Já sei esta palavra' : 'Marcar como Aprendida'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
