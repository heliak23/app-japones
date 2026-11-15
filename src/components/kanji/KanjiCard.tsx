import React from 'react';
import type { KanjiCharacter } from '../../types/kanji';
import { Volume2, CheckCircle2, Circle } from 'lucide-react';

interface KanjiCardProps {
  kanji: KanjiCharacter;
  isStudied: boolean;
  onToggleStudied: (id: string) => void;
  onClick: (kanji: KanjiCharacter) => void;
  onPlayAudio: (e: React.MouseEvent, text: string) => void;
  isPlaying?: boolean;
}

export const KanjiCard: React.FC<KanjiCardProps> = ({
  kanji,
  isStudied,
  onToggleStudied,
  onClick,
  onPlayAudio,
  isPlaying = false,
}) => {
  return (
    <div
      onClick={() => onClick(kanji)}
      role="button"
      tabIndex={0}
      className={`group relative flex flex-col justify-between bg-white dark:bg-[#131b2e] rounded-3xl p-5 border transition-all duration-200 cursor-pointer hover:shadow-md hover:-translate-y-0.5 select-none ${
        isStudied
          ? 'border-emerald-300 dark:border-emerald-800/60 shadow-sm'
          : 'border-slate-200/90 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-700'
      }`}
    >
      {/* Topo do Card: Radical, Traços e Check de Estudado */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
            {kanji.strokes} traços
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40"
            title={`Radical principal: ${kanji.radical.name} (${kanji.radical.meaning})`}
          >
            Rad: {kanji.radical.symbol}
          </span>
        </div>

        {/* Botão de Marcar como Estudado */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStudied(kanji.id);
          }}
          className={`p-1 rounded-full transition-colors ${
            isStudied
              ? 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700'
              : 'text-slate-300 dark:text-slate-600 hover:text-slate-400'
          }`}
          title={isStudied ? 'Marcado como dominado (clique para desmarcar)' : 'Marcar como dominado'}
        >
          {isStudied ? (
            <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950/60" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Centro: O Ideograma Gigante */}
      <div className="my-4 flex flex-col items-center justify-center text-center">
        <span className="font-jp text-5xl sm:text-6xl font-black text-slate-900 dark:text-white group-hover:scale-105 transition-transform duration-200">
          {kanji.character}
        </span>
        <h4 className="mt-2 text-sm sm:text-base font-extrabold text-slate-800 dark:text-slate-200">
          {kanji.meaning}
        </h4>
      </div>

      {/* Rodapé: Leituras On / Kun e Botão de Áudio */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
        <div className="flex flex-col text-left truncate mr-2">
          {kanji.kunyomi.length > 0 && (
            <span className="font-jp text-slate-600 dark:text-slate-400 text-xs truncate">
              {kanji.kunyomi[0]}
            </span>
          )}
          {kanji.onyomi.length > 0 && (
            <span className="font-jp text-slate-400 dark:text-slate-500 text-[11px] truncate">
              {kanji.onyomi[0]}
            </span>
          )}
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            const textToSpeak = kanji.examples[0]?.audioText || kanji.character;
            onPlayAudio(e, textToSpeak);
          }}
          className="p-2 rounded-xl bg-slate-50 hover:bg-brand-50 dark:bg-slate-800/80 dark:hover:bg-brand-950/50 text-slate-500 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-400 transition-colors shrink-0"
          title="Ouvir pronúncia"
        >
          <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-pulse text-brand-500' : ''}`} />
        </button>
      </div>
    </div>
  );
};
