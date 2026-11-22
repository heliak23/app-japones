import React from 'react';
import type { VocabularyWord } from '../../types/vocabulary';
import { Volume2, CheckCircle2, Bookmark, ArrowRight } from 'lucide-react';

interface VocabularyCardProps {
  word: VocabularyWord;
  isLearned: boolean;
  isBookmarked: boolean;
  onToggleLearned: (id: string) => void;
  onToggleBookmarked: (id: string) => void;
  onPlayAudio: (text: string) => void;
  onOpenDetails: (word: VocabularyWord) => void;
  isPlayingAudio?: boolean;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  word,
  isLearned,
  isBookmarked,
  onToggleLearned,
  onToggleBookmarked,
  onPlayAudio,
  onOpenDetails,
  isPlayingAudio = false,
}) => {
  const hasKanji = word.kanji !== word.kana;

  return (
    <div
      onClick={() => onOpenDetails(word)}
      className={`group relative flex flex-col justify-between p-5 rounded-3xl transition-all duration-200 cursor-pointer border ${
        isLearned
          ? 'bg-emerald-50/40 dark:bg-[#132328] border-emerald-300/80 dark:border-emerald-800/80 shadow-xs'
          : 'bg-white dark:bg-[#131b2e] border-slate-200/90 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-brand-400 dark:hover:border-brand-500'
      }`}
    >
      {/* Topo do Card: Categoria, Origem e Ações Rápidas */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {word.categoryLabel}
          </span>
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 truncate max-w-[140px]">
            {word.source.split('(')[0].trim()}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmarked(word.id);
            }}
            className={`p-1.5 rounded-xl transition-colors ${
              isBookmarked
                ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/60'
                : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            title={isBookmarked ? 'Remover dos favoritos' : 'Favoritar palavra'}
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleLearned(word.id);
            }}
            className={`p-1.5 rounded-xl transition-colors ${
              isLearned
                ? 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/50'
                : 'text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40'
            }`}
            title={isLearned ? 'Palavra dominada' : 'Marcar como aprendida'}
          >
            <CheckCircle2 className={`w-4 h-4 ${isLearned ? 'fill-emerald-500 text-white dark:text-emerald-950' : ''}`} />
          </button>
        </div>
      </div>

      {/* Centro: Palavra em Japonês e Leitura */}
      <div className="my-2 space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-jp text-2xl sm:text-3xl font-medium text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-tight">
            {word.kanji}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onPlayAudio(word.audioText);
            }}
            className="p-2 rounded-xl text-brand-600 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 transition-colors"
            title="Ouvir pronúncia"
          >
            <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
          </button>
        </div>

        {hasKanji && (
          <p className="font-jp text-xs font-normal text-slate-500 dark:text-slate-400">
            {word.kana}
          </p>
        )}

        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 tracking-wide">
          {word.romaji}
        </p>
      </div>

      {/* Rodapé: Significado em Português */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between mt-2">
        <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate pr-2">
          {word.meaning}
        </p>
        <span className="text-brand-600 dark:text-brand-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <ArrowRight className="w-4 h-4" />
        </span>
      </div>
    </div>
  );
};
