import React, { useState } from 'react';
import type { KanaCharacter } from '../../types/kana';
import { Volume2, VolumeX, RotateCw, CheckCircle2, ChevronLeft, ChevronRight, Shuffle } from 'lucide-react';

interface FlashcardViewProps {
  characters: KanaCharacter[];
  studiedIds: string[];
  onMarkStudied: (characterId: string) => void;
  onPlayAudio: (char: string) => void;
  isPlaying?: boolean;
}

export const FlashcardView: React.FC<FlashcardViewProps> = ({
  characters,
  studiedIds,
  onMarkStudied,
  onPlayAudio,
  isPlaying = false,
}) => {
  const [prevCharacters, setPrevCharacters] = useState(characters);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [list, setList] = useState<KanaCharacter[]>(characters);

  // Sincroniza estado durante o render quando as props mudam (padrão oficial React para ajuste de estado)
  if (characters !== prevCharacters) {
    setPrevCharacters(characters);
    setList(characters);
    setCurrentIndex(0);
    setIsFlipped(false);
  }

  const current = list[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % list.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + list.length) % list.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    setList((prev) => [...prev].sort(() => 0.5 - Math.random()));
    setCurrentIndex(0);
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleMarkKnown = () => {
    if (current) {
      onMarkStudied(current.id);
      handleNext();
    }
  };

  if (!current) return null;

  const isStudied = studiedIds.includes(current.id);

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Controles de Cabeçalho dos Flashcards */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Cartão {currentIndex + 1} de {list.length}
          </span>
          {isStudied && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
              <CheckCircle2 className="w-3 h-3" />
              Estudado
            </span>
          )}
        </div>

        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
          title="Embaralhar cartões"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Embaralhar</span>
        </button>
      </div>

      {/* Cartão Flip Central */}
      <div
        onClick={handleFlip}
        className="cursor-pointer min-h-[360px] sm:min-h-[420px] bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group select-none"
      >
        {/* Barra superior do cartão */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
            {current.alphabet.toUpperCase()} • {current.group.toUpperCase()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(current.character);
            }}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-[#182238] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Ouvir som"
          >
            {isPlaying ? <VolumeX className="w-5 h-5 text-brand-600 dark:text-brand-400" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Conteúdo Central */}
        <div className="my-auto text-center py-6">
          {!isFlipped ? (
            // Frente do Cartão
            <div className="space-y-4">
              <span className="font-jp text-8xl sm:text-9xl font-black text-slate-900 dark:text-slate-100 leading-none inline-block group-hover:scale-105 transition-transform">
                {current.character}
              </span>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium flex items-center justify-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Toque para revelar Romaji e Pronúncia</span>
              </p>
            </div>
          ) : (
            // Verso do Cartão
            <div className="space-y-4 animate-fadeIn">
              <div className="font-jp text-5xl font-black text-slate-300 dark:text-slate-600">
                {current.character}
              </div>

              <div>
                <span className="text-4xl sm:text-5xl font-black text-brand-600 dark:text-brand-400 tracking-wider uppercase block">
                  {current.romaji}
                </span>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mt-2 bg-slate-50 dark:bg-[#0f172a] py-2 px-4 rounded-xl inline-block border border-slate-100 dark:border-slate-800">
                  {current.ptPronunciation}
                </p>
              </div>

              {current.mnemonicNote && (
                <p className="text-xs text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200/80 dark:border-amber-900/50 max-w-sm mx-auto text-left">
                  💡 <strong>Dica:</strong> {current.mnemonicNote}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do Cartão */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
          <span>{isFlipped ? 'Toque para ocultar' : 'Toque no cartão para virar'}</span>
          <span className="font-mono hidden sm:inline">Pressione Espaço para girar</span>
        </div>
      </div>

      {/* Controles de Navegação e Aprendizado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={handlePrev}
          className="col-span-1 py-3 px-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          onClick={handleMarkKnown}
          className="col-span-2 sm:col-span-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-950/20 order-first sm:order-none"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Já Aprendi!</span>
        </button>

        <button
          onClick={handleNext}
          className="col-span-1 py-3 px-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
