import React, { useState, useEffect } from 'react';
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [list, setList] = useState<KanaCharacter[]>(characters);

  useEffect(() => {
    setList(characters);
    setCurrentIndex(0);
    setIsFlipped(false);
  }, [characters]);

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
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Cartão {currentIndex + 1} de {list.length}
          </span>
          {isStudied && (
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Estudado
            </span>
          )}
        </div>

        <button
          onClick={handleShuffle}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-sm"
          title="Embaralhar cartões"
        >
          <Shuffle className="w-3.5 h-3.5" />
          <span>Embaralhar</span>
        </button>
      </div>

      {/* Cartão Flip Central */}
      <div
        onClick={handleFlip}
        className="cursor-pointer min-h-[380px] sm:min-h-[420px] bg-white rounded-3xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between relative group select-none"
      >
        {/* Barra superior do cartão */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {current.alphabet.toUpperCase()} • {current.group.toUpperCase()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(current.character);
            }}
            className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Ouvir som"
          >
            {isPlaying ? <VolumeX className="w-5 h-5 text-brand-600" /> : <Volume2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Conteúdo Central */}
        <div className="my-auto text-center py-6">
          {!isFlipped ? (
            // Frente do Cartão
            <div className="space-y-4">
              <span className="font-jp text-8xl sm:text-9xl font-black text-slate-900 leading-none inline-block group-hover:scale-105 transition-transform">
                {current.character}
              </span>
              <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1">
                <RotateCw className="w-3.5 h-3.5" />
                <span>Toque para revelar Romaji e Pronúncia</span>
              </p>
            </div>
          ) : (
            // Verso do Cartão
            <div className="space-y-4 animate-fadeIn">
              <div className="font-jp text-5xl font-black text-slate-300">
                {current.character}
              </div>

              <div>
                <span className="text-4xl sm:text-5xl font-black text-brand-600 tracking-wider uppercase block">
                  {current.romaji}
                </span>
                <p className="text-sm font-semibold text-slate-700 mt-2 bg-slate-50 py-2 px-4 rounded-xl inline-block border border-slate-100">
                  {current.ptPronunciation}
                </p>
              </div>

              {current.mnemonicNote && (
                <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200/80 max-w-sm mx-auto text-left">
                  💡 <strong>Dica:</strong> {current.mnemonicNote}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Rodapé do Cartão */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <span>{isFlipped ? 'Clique para ocultar' : 'Clique no cartão para virar'}</span>
          <span className="font-mono">Pressione Espaço para girar</span>
        </div>
      </div>

      {/* Controles de Navegação e Aprendizado */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <button
          onClick={handlePrev}
          className="col-span-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
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
          className="col-span-1 py-3 px-4 rounded-2xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-100 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
