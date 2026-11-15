import React from 'react';
import type { RubyFragment } from '../../types/phrase';

interface FuriganaTextProps {
  fragments: RubyFragment[];
  showFurigana?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  highlightNew?: boolean;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  fragments,
  showFurigana = true,
  className = '',
  size = 'lg',
  highlightNew = true,
}) => {
  const sizeClasses = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl sm:text-3xl',
    xl: 'text-3xl sm:text-4xl',
    '2xl': 'text-4xl sm:text-5xl',
  };

  const rtSizeClasses = {
    sm: 'text-[9px] -top-2',
    md: 'text-[11px] -top-2.5',
    lg: 'text-xs sm:text-sm -top-3',
    xl: 'text-sm sm:text-base -top-3.5',
    '2xl': 'text-base sm:text-lg -top-4',
  };

  return (
    <span
      className={`font-jp inline-flex flex-wrap items-end gap-x-0.5 leading-relaxed tracking-wide ${sizeClasses[size]} ${className}`}
      lang="ja"
    >
      {fragments.map((frag, idx) => {
        const isHighlight = highlightNew && frag.isNew;
        const colorClass = isHighlight
          ? 'text-amber-600 dark:text-amber-400 font-extrabold bg-amber-500/10 dark:bg-amber-400/15 px-1 rounded-md'
          : 'text-slate-900 dark:text-white font-medium';

        if (!frag.furigana || !showFurigana) {
          return (
            <span key={idx} className={`${colorClass} transition-colors inline-block`}>
              {frag.kanji}
            </span>
          );
        }

        return (
          <ruby key={idx} className={`relative inline-flex flex-col items-center ${colorClass}`}>
            <rt
              className={`font-sans font-medium text-slate-500 dark:text-slate-400 select-none pb-0.5 leading-none ${rtSizeClasses[size]}`}
            >
              {frag.furigana}
            </rt>
            <span>{frag.kanji}</span>
          </ruby>
        );
      })}
    </span>
  );
};
