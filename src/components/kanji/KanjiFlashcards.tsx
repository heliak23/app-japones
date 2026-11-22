import React, { useState } from 'react';
import type { KanjiCharacter } from '../../types/kanji';
import {
  Volume2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';

interface KanjiFlashcardsProps {
  kanjis: KanjiCharacter[];
  studiedIds: string[];
  onToggleStudied: (id: string) => void;
  onPlayAudio: (text: string) => void;
}

export const KanjiFlashcards: React.FC<KanjiFlashcardsProps> = ({
  kanjis,
  studiedIds,
  onToggleStudied,
  onPlayAudio,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hideFurigana, setHideFurigana] = useState(false);
  const [revealedWords, setRevealedWords] = useState<string[]>([]);

  if (kanjis.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        Nenhum kanji encontrado para esta categoria.
      </div>
    );
  }

  const currentKanji = kanjis[currentIndex];
  const isStudied = studiedIds.includes(currentKanji.id);

  const handleNext = () => {
    setIsFlipped(false);
    setRevealedWords([]);
    setCurrentIndex((prev) => (prev < kanjis.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setRevealedWords([]);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : kanjis.length - 1));
  };

  const handleMarkKnown = () => {
    if (!isStudied) {
      onToggleStudied(currentKanji.id);
    }
    handleNext();
  };

  const handleToggleRevealWord = (word: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRevealedWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  };

  return (
    <div className="max-w-xl mx-auto space-y-4">
      {/* Barra de Modo de Estudo Anki e Toggle de Furigana */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
          <span>Método Anki da Apostila 2</span>
        </div>

        <button
          onClick={() => setHideFurigana(!hideFurigana)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold transition-all border ${
            hideFurigana
              ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
          }`}
          title="Ocultar Furigana para forçar a recuperação ativa da memória"
        >
          {hideFurigana ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{hideFurigana ? 'Furigana Oculto (Modo Anki)' : 'Furigana Visível'}</span>
        </button>
      </div>

      {/* Indicador de Cartão */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 px-2">
        <span>
          Cartão {currentIndex + 1} de {kanjis.length}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-brand-600 dark:text-brand-400">
            {currentKanji.categoryLabel}
          </span>
          {isStudied && (
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              • Dominado ✅
            </span>
          )}
        </div>
      </div>

      {/* Cartão de Flashcard */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        role="button"
        tabIndex={0}
        className="relative min-h-[420px] bg-white dark:bg-[#131b2e] rounded-3xl border-2 border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 flex flex-col items-center justify-between text-center cursor-pointer select-none transition-all hover:border-brand-400 group"
      >
        <div className="w-full flex items-center justify-between text-xs text-slate-400">
          <span>{currentKanji.strokes} traços</span>
          <span className="text-[11px] font-bold text-brand-500">Toque para virar ↺</span>
        </div>

        {/* Frente do Flashcard */}
        {!isFlipped ? (
          <div className="my-auto space-y-4">
            <span className="font-jp text-8xl font-black text-slate-900 dark:text-white group-hover:scale-105 transition-transform block">
              {currentKanji.character}
            </span>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              {hideFurigana
                ? 'Modo Anki: Consegue lembrar a leitura e o significado deste ideograma em palavras reais?'
                : 'Você lembra a leitura e o significado deste ideograma?'}
            </p>
          </div>
        ) : (
          /* Verso do Flashcard (Resposta Revelada) */
          <div className="my-auto space-y-4 animate-fadeIn w-full">
            <span className="font-jp text-5xl font-black text-brand-600 dark:text-brand-400">
              {currentKanji.character}
            </span>

            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">
                {currentKanji.meaning}
              </h3>
              <p className="font-jp text-base font-bold text-slate-600 dark:text-slate-300 mt-1">
                {currentKanji.kunyomi.concat(currentKanji.onyomi).join(' • ')}
              </p>
            </div>

            {/* Palavras em Contexto Real (Filosofia Anki da Apostila 2) */}
            {currentKanji.examples.length > 0 && (
              <div className="space-y-2 text-left w-full pt-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block text-center">
                  Vocabulário Real em Contexto
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-none">
                  {currentKanji.examples.slice(0, 3).map((ex, idx) => {
                    const isWordRevealed = !hideFurigana || revealedWords.includes(ex.japanese);
                    return (
                      <div
                        key={idx}
                        onClick={(e) => handleToggleRevealWord(ex.japanese, e)}
                        className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2 hover:border-brand-300 transition-colors"
                        title={hideFurigana ? 'Toque para revelar ou ocultar a leitura' : undefined}
                      >
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-jp font-bold text-slate-900 dark:text-white text-base">
                              {ex.japanese}
                            </span>
                            {isWordRevealed ? (
                              <span className="text-xs font-bold text-brand-600 dark:text-brand-400">
                                ({ex.furigana} • {ex.romaji})
                              </span>
                            ) : (
                              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400">
                                👁️ Toque p/ revelar
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500 block">
                            {ex.meaning}
                          </span>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onPlayAudio(ex.audioText || ex.japanese);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-200/60 dark:border-amber-800/40 text-left text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              <strong className="text-amber-700 dark:text-amber-400">Mnemônico: </strong>
              <span>{currentKanji.mnemonicStory}</span>
            </div>
          </div>
        )}

        <div className="w-full pt-4 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-400">
          Radical: {currentKanji.radical.symbol} ({currentKanji.radical.name} - {currentKanji.radical.meaning})
        </div>
      </div>

      {/* Ações Inferiores do Flashcard */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handlePrev}
          className="p-3 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          title="Anterior"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 flex-1">
          <button
            onClick={handleNext}
            className="flex-1 py-3 px-4 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-bold text-xs sm:text-sm hover:bg-rose-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <XCircle className="w-4 h-4" />
            <span>Ainda Não Lembro</span>
          </button>

          <button
            onClick={handleMarkKnown}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-950/20 transition-all flex items-center justify-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Já Sei! (Dominado)</span>
          </button>
        </div>

        <button
          onClick={handleNext}
          className="p-3 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          title="Próximo"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
