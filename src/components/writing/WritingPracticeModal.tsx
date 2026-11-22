import React, { useEffect, useState } from 'react';
import { X, Volume2, ChevronLeft, ChevronRight, CheckCircle2, Sparkles } from 'lucide-react';
import type { WritingCharacterItem } from '../../types/writing';
import { WritingCanvas } from './WritingCanvas';
import { useAudio } from '../../hooks/useAudio';
import { WritingStorageService } from '../../services/writingStorageService';

interface WritingPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterItem: WritingCharacterItem | null;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const WritingPracticeModal: React.FC<WritingPracticeModalProps> = ({
  isOpen,
  onClose,
  characterItem,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}) => {
  const { playKana, isPlaying } = useAudio();
  const [justPracticed, setJustPracticed] = useState(false);

  const isPracticed = Boolean(
    justPracticed ||
      (characterItem && WritingStorageService.isCharacterPracticed(characterItem.id))
  );

  // Teclas de atalho (Esc, Setas)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasNext && onNext) onNext();
      if (e.key === 'ArrowLeft' && hasPrev && onPrev) onPrev();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onNext, onPrev, hasNext, hasPrev]);

  if (!isOpen || !characterItem) return null;

  const handlePlayAudio = () => {
    playKana(characterItem.character);
  };

  const handleCompletedWriting = (_score: number) => {
    setJustPracticed(true);
  };

  const isKanji = characterItem.type === 'kanji';
  const typeBadge =
    characterItem.type === 'hiragana'
      ? 'Hiragana (ひらがな)'
      : characterItem.type === 'katakana'
      ? 'Katakana (カタカナ)'
      : 'Kanji (漢字)';

  const badgeColor =
    characterItem.type === 'hiragana'
      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
      : characterItem.type === 'katakana'
      ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-800'
      : 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border-brand-200 dark:border-brand-800';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl max-h-[95vh] flex flex-col bg-white dark:bg-[#131b2e] rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Topo do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${badgeColor}`}>
              {typeBadge}
            </span>
            {isPracticed && (
              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Praticado</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {hasPrev && onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Anterior (Seta Esquerda)"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Próximo (Seta Direita)"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-1"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informações Resumidas do Caractere */}
        <div className="px-5 pt-4 pb-2 flex items-center justify-between gap-4 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                {isKanji ? characterItem.meaning : characterItem.romaji.toUpperCase()}
              </span>
              <button
                onClick={handlePlayAudio}
                className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-950/50 text-slate-600 dark:text-slate-300 transition-all"
                title="Ouvir pronúncia"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'text-brand-600 animate-bounce' : ''}`} />
              </button>
            </div>
            {characterItem.ptPronunciation && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {characterItem.ptPronunciation}
              </p>
            )}
            {isKanji && characterItem.kunyomi && characterItem.kunyomi.length > 0 && (
              <p className="text-xs font-jp text-brand-600 dark:text-brand-400 mt-0.5">
                {characterItem.kunyomi.join(', ')}
              </p>
            )}
          </div>

          {characterItem.strokes && (
            <div className="text-right">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 block">
                Total de Traços
              </span>
              <span className="text-sm font-extrabold text-slate-700 dark:text-slate-300">
                {characterItem.strokes} traços
              </span>
            </div>
          )}
        </div>

        {/* Canvas Interativo de Traçado */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col items-center">
          <WritingCanvas
            character={characterItem.character}
            characterId={characterItem.id}
            type={characterItem.type}
            subtitle={isKanji ? characterItem.meaning : characterItem.romaji}
            onComplete={handleCompletedWriting}
          />
        </div>

        {/* Rodapé com Dica e Ação Próximo */}
        <div className="p-4 bg-slate-50/70 dark:bg-slate-900/70 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 text-xs">
          <div className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Desenhe com precisão e clique em "Avaliar Traçado"</span>
          </div>

          {hasNext && onNext && (
            <button
              onClick={onNext}
              className="inline-flex items-center gap-1 font-bold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
            >
              <span>Próximo</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
