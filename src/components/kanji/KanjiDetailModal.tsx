import React, { useEffect } from 'react';
import type { KanjiCharacter } from '../../types/kanji';
import {
  X,
  Volume2,
  CheckCircle2,
  Circle,
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  BookOpen,
} from 'lucide-react';

interface KanjiDetailModalProps {
  kanji: KanjiCharacter | null;
  isOpen: boolean;
  onClose: () => void;
  isStudied: boolean;
  onToggleStudied: (id: string) => void;
  onPlayAudio: (text: string) => void;
  isPlaying?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  hasNext?: boolean;
  hasPrev?: boolean;
}

export const KanjiDetailModal: React.FC<KanjiDetailModalProps> = ({
  kanji,
  isOpen,
  onClose,
  isStudied,
  onToggleStudied,
  onPlayAudio,
  isPlaying = false,
  onNext,
  onPrev,
  hasNext = false,
  hasPrev = false,
}) => {
  // Fecha no Esc
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

  if (!isOpen || !kanji) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700"
      >
        {/* Header Superior com Fechar e Navegação */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200/50 dark:border-brand-800/50">
              {kanji.categoryLabel}
            </span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {kanji.strokes} traços
            </span>
          </div>

          <div className="flex items-center gap-2">
            {hasPrev && onPrev && (
              <button
                onClick={onPrev}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Kanji anterior (Seta esquerda)"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && onNext && (
              <button
                onClick={onNext}
                className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                title="Próximo Kanji (Seta direita)"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors ml-1"
              title="Fechar (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bloco 1: A Fórmula Mental do Livro (Forma ➔ Som ➔ Significado) */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-brand-700 dark:text-brand-400">
            <Sparkles className="w-4 h-4" />
            <span>Fórmula Mental: Forma ➔ Som ➔ Significado</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
            {/* 1. Forma */}
            <div className="flex flex-col items-center">
              <span className="font-jp text-6xl sm:text-7xl font-black text-slate-900 dark:text-white leading-none">
                {kanji.character}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-2">
                1. Forma (Desenho)
              </span>
            </div>

            <div className="hidden sm:block text-slate-300 dark:text-slate-600 font-bold text-xl">➔</div>

            {/* 2. Som */}
            <div className="flex flex-col items-center space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-jp text-xl sm:text-2xl font-black text-brand-600 dark:text-brand-400">
                  {kanji.kunyomi[0] || kanji.onyomi[0]}
                </span>
                <button
                  onClick={() => onPlayAudio(kanji.character)}
                  className="p-1.5 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300 hover:scale-105 transition-transform"
                  title="Ouvir leitura do Kanji"
                >
                  <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                </button>
              </div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                2. Som (Leitura)
              </span>
            </div>

            <div className="hidden sm:block text-slate-300 dark:text-slate-600 font-bold text-xl">➔</div>

            {/* 3. Significado */}
            <div className="flex flex-col items-center">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {kanji.meaning}
              </span>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                3. Significado (Ideia)
              </span>
            </div>
          </div>
        </div>

        {/* Bloco 2: Leituras On'yomi e Kun'yomi Detalhadas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Leitura Japonesa (Kun'yomi)
            </span>
            <p className="font-jp text-base font-bold text-slate-900 dark:text-white">
              {kanji.kunyomi.length > 0 ? kanji.kunyomi.join(', ') : '—'}
            </p>
            <p className="text-[11px] text-slate-400">Usada quando o Kanji aparece sozinho como uma palavra nativa.</p>
          </div>

          <div className="bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Leitura Chinesa (On'yomi)
            </span>
            <p className="font-jp text-base font-bold text-slate-900 dark:text-white">
              {kanji.onyomi.length > 0 ? kanji.onyomi.join(', ') : '—'}
            </p>
            <p className="text-[11px] text-slate-400">Usada em palavras compostas por dois ou mais Kanjis (Jukugo).</p>
          </div>
        </div>

        {/* Bloco 3: Mnemônico e Decomposição em Peças (O Lego do Livro) */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Brain className="w-4 h-4 text-amber-500" />
            <span>Como Memorizar Facilmente (Mnemônico do Livro)</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-200/80 dark:border-amber-800/40 text-slate-800 dark:text-slate-200 text-sm leading-relaxed">
            {kanji.mnemonicStory}
          </div>

          {/* Peças de Montar / Decomposição */}
          {kanji.decomposedParts && kanji.decomposedParts.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-indigo-500" />
                <span>Peças de Montar deste Kanji:</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {kanji.decomposedParts.map((part, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 shadow-sm"
                  >
                    <span className="font-jp text-base text-brand-600 dark:text-brand-400">{part.symbol}</span>
                    <span className="text-slate-400 font-normal">({part.meaning})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bloco 4: Exemplos Práticos de Vocabulário */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span>Palavras do Dia a Dia com este Kanji</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {kanji.examples.map((ex, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 transition-colors"
              >
                <div className="space-y-0.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-jp text-lg font-black text-slate-900 dark:text-white">
                      {ex.japanese}
                    </span>
                    <span className="font-jp text-xs text-brand-600 dark:text-brand-400 font-semibold">
                      ({ex.furigana})
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>{ex.meaning}</strong> • <span className="text-slate-400">{ex.romaji}</span>
                  </p>
                </div>

                <button
                  onClick={() => onPlayAudio(ex.audioText)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 hover:bg-brand-50 text-slate-500 hover:text-brand-600 dark:text-slate-400 transition-colors shadow-sm shrink-0"
                  title="Ouvir palavra"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé: Botão de Marcar como Dominado */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Radical base: <strong>{kanji.radical.symbol}</strong> ({kanji.radical.name})
          </span>

          <button
            onClick={() => onToggleStudied(kanji.id)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold transition-all shadow-sm ${
              isStudied
                ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-900/20'
            }`}
          >
            {isStudied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Kanji Dominado!</span>
              </>
            ) : (
              <>
                <Circle className="w-4 h-4" />
                <span>Marcar como Estudado</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
