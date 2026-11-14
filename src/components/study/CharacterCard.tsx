import React from 'react';
import type { KanaCharacter } from '../../types/kana';
import { Volume2, VolumeX, CheckCircle } from 'lucide-react';

interface CharacterCardProps {
  character: KanaCharacter;
  isStudied: boolean;
  isPlaying?: boolean;
  onPlayAudio: (e: React.MouseEvent, char: string) => void;
  onSelect: (char: KanaCharacter) => void;
  onToggleStudied?: (characterId: string) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isStudied,
  isPlaying = false,
  onPlayAudio,
  onSelect,
  onToggleStudied,
}) => {
  const isHiragana = character.alphabet === 'hiragana';
  const accentColor = isHiragana ? 'hover:border-brand-400 dark:hover:border-brand-500' : 'hover:border-amber-400 dark:hover:border-amber-500';

  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative bg-white dark:bg-[#131b2e] rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md ${accentColor} transition-all duration-200 cursor-pointer flex flex-col justify-between select-none`}
    >
      {/* Topo do card: Romaji + Status */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-base font-extrabold text-slate-800 dark:text-slate-200 tracking-wide uppercase">
          {character.romaji}
        </span>
        <div className="flex items-center gap-1.5">
          {onToggleStudied ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleStudied(character.id);
              }}
              title={isStudied ? 'Clique para desmarcar' : 'Marcar como estudado'}
              className="p-1 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
            >
              {isStudied ? (
                <CheckCircle className="w-4 h-4 fill-emerald-100 dark:fill-emerald-950/60" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 block opacity-40 group-hover:opacity-100" />
              )}
            </button>
          ) : isStudied ? (
            <span title="Caractere já estudado" className="flex items-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle className="w-4 h-4 fill-emerald-100 dark:fill-emerald-950/60" />
            </span>
          ) : null}
          <button
            onClick={(e) => onPlayAudio(e, character.character)}
            title="Ouvir pronúncia"
            className={`p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
              isPlaying ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 animate-pulse' : ''
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4 text-brand-600 dark:text-brand-400" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Centro: Caractere Japonês */}
      <div className="my-2 text-center py-2">
        <span className="font-jp text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100 group-hover:scale-110 transition-transform inline-block">
          {character.character}
        </span>
      </div>

      {/* Rodapé: Pronúncia PT-BR */}
      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate" title={character.ptPronunciation}>
          {character.ptPronunciation}
        </p>
      </div>

      {/* Indicador de clique suave */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-hover:bg-brand-500 rounded-b-2xl transition-colors" />
    </div>
  );
};
