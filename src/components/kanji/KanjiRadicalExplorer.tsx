import React, { useState } from 'react';
import type { KanjiCharacter } from '../../types/kanji';
import { KANJI_RADICAL_GROUPS, KANJI_DATASET } from '../../data/kanjiDataset';
import { Sparkles, ArrowRight, Brain } from 'lucide-react';

interface KanjiRadicalExplorerProps {
  onSelectKanji: (kanji: KanjiCharacter) => void;
  studiedIds: string[];
}

export const KanjiRadicalExplorer: React.FC<KanjiRadicalExplorerProps> = ({
  onSelectKanji,
  studiedIds,
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState(KANJI_RADICAL_GROUPS[0].id);

  const activeGroup =
    KANJI_RADICAL_GROUPS.find((g) => g.id === selectedGroupId) || KANJI_RADICAL_GROUPS[0];

  // Kanjis pertencentes a este grupo de radicais
  const relatedKanjis = KANJI_DATASET.filter((k) =>
    activeGroup.kanjiCharacters.includes(k.character)
  );

  return (
    <div className="space-y-6">
      {/* Seletor de Radicais */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {KANJI_RADICAL_GROUPS.map((group) => {
          const isSelected = selectedGroupId === group.id;

          return (
            <button
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`px-4 py-3 rounded-2xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all flex items-center gap-2.5 border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-900/20'
                  : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className="font-jp text-lg font-black">{group.symbol}</span>
              <span>{group.name}</span>
            </button>
          );
        })}
      </div>

      {/* Card de Destaque da Peça de Montar */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white rounded-3xl p-6 sm:p-8 border border-slate-700/60 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center font-jp text-4xl font-black text-brand-300 shadow-lg">
              {activeGroup.symbol}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-400">
                Peça Base (Radical)
              </span>
              <h3 className="text-2xl font-extrabold">{activeGroup.name}</h3>
              <p className="text-xs sm:text-sm text-slate-300">{activeGroup.meaning}</p>
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{relatedKanjis.length} ideogramas gerados</span>
          </div>
        </div>

        {/* Nota pedagógica do livro */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs sm:text-sm text-slate-200 leading-relaxed flex items-start gap-3">
          <Brain className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong className="text-amber-300">Explicação do Livro: </strong>
            <span>{activeGroup.bookNote}</span>
          </div>
        </div>
      </div>

      {/* Grid de Kanjis Gerados pela Peça de Montar */}
      <div className="space-y-3">
        <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Kanjis que usam a peça "{activeGroup.symbol}"</span>
          <span className="text-xs font-medium text-slate-400">
            (Clique em qualquer ideograma para ver a história e palavras compostas)
          </span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedKanjis.map((k) => {
            const isStudied = studiedIds.includes(k.id);

            return (
              <div
                key={k.id}
                onClick={() => onSelectKanji(k)}
                role="button"
                tabIndex={0}
                className={`flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#131b2e] border transition-all cursor-pointer hover:shadow-md hover:border-brand-400 group ${
                  isStudied
                    ? 'border-emerald-300 dark:border-emerald-800/60'
                    : 'border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span className="font-jp text-4xl font-black text-slate-900 dark:text-white group-hover:scale-110 transition-transform">
                    {k.character}
                  </span>
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white text-sm">
                      {k.meaning}
                    </h5>
                    <p className="font-jp text-xs text-brand-600 dark:text-brand-400">
                      {k.kunyomi[0] || k.onyomi[0]}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  <span className="text-xs font-semibold hidden sm:inline">Ver detalhes</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
