import React from 'react';
import type { KanaCharacter } from '../../types/kana';
import { Volume2, VolumeX, CheckCircle } from 'lucide-react';

interface CharacterCardProps {
  character: KanaCharacter;
  isStudied: boolean;
  isPlaying?: boolean;
  onPlayAudio: (e: React.MouseEvent, char: string) => void;
  onSelect: (char: KanaCharacter) => void;
}

export const CharacterCard: React.FC<CharacterCardProps> = ({
  character,
  isStudied,
  isPlaying = false,
  onPlayAudio,
  onSelect,
}) => {
  const isHiragana = character.alphabet === 'hiragana';
  const accentColor = isHiragana ? 'hover:border-brand-400' : 'hover:border-amber-400';

  return (
    <div
      onClick={() => onSelect(character)}
      className={`group relative bg-white rounded-2xl p-4 border border-slate-200/90 shadow-sm hover:shadow-md ${accentColor} transition-all duration-200 cursor-pointer flex flex-col justify-between select-none`}
    >
      {/* Topo do card: Romaji + Status */}
      <div className="flex items-center justify-between gap-1 mb-2">
        <span className="text-base font-extrabold text-slate-800 tracking-wide uppercase">
          {character.romaji}
        </span>
        <div className="flex items-center gap-1.5">
          {isStudied && (
            <span title="Caractere já estudado" className="flex items-center text-emerald-600">
              <CheckCircle className="w-4 h-4 fill-emerald-100" />
            </span>
          )}
          <button
            onClick={(e) => onPlayAudio(e, character.character)}
            title="Ouvir pronúncia"
            className={`p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ${
              isPlaying ? 'text-brand-600 bg-brand-50 animate-pulse' : ''
            }`}
          >
            {isPlaying ? <VolumeX className="w-4 h-4 text-brand-600" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Centro: Caractere Japonês */}
      <div className="my-2 text-center py-2">
        <span className="font-jp text-4xl sm:text-5xl font-black text-slate-900 group-hover:scale-110 transition-transform inline-block">
          {character.character}
        </span>
      </div>

      {/* Rodapé: Pronúncia PT-BR */}
      <div className="mt-2 pt-2 border-t border-slate-100">
        <p className="text-[11px] text-slate-500 truncate" title={character.ptPronunciation}>
          {character.ptPronunciation}
        </p>
      </div>

      {/* Indicador de clique suave */}
      <div className="absolute inset-x-0 bottom-0 h-1 bg-transparent group-hover:bg-brand-500 rounded-b-2xl transition-colors" />
    </div>
  );
};
