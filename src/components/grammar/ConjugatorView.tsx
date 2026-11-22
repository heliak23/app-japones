import React, { useState } from 'react';
import {
  ADJECTIVES_DATA,
  VERBS_DATA,
} from '../../data/conjugationData';
import type { AdjectiveItem, VerbItem } from '../../types/grammar';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Volume2,
  BookOpen,
  Layers,
  Info,
} from 'lucide-react';

export const ConjugatorView: React.FC = () => {
  const [conjugationType, setConjugationType] = useState<'verbs' | 'adjectives'>('verbs');
  const [selectedVerb, setSelectedVerb] = useState<VerbItem>(VERBS_DATA[0]);
  const [selectedAdj, setSelectedAdj] = useState<AdjectiveItem>(ADJECTIVES_DATA[0]);
  const [verbGroupFilter, setVerbGroupFilter] = useState<'all' | 'g1' | 'g2' | 'g3'>('all');
  const [adjTypeFilter, setAdjTypeFilter] = useState<'all' | 'i' | 'na'>('all');

  const { playKana } = useAudio();

  const filteredVerbs = VERBS_DATA.filter((v) => {
    if (verbGroupFilter === 'all') return true;
    return v.group === verbGroupFilter;
  });

  const filteredAdjectives = ADJECTIVES_DATA.filter((a) => {
    if (adjTypeFilter === 'all') return true;
    return a.type === adjTypeFilter;
  });

  return (
    <div className="space-y-6">
      {/* Sub-header do Conjugador */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Capítulos 4 & 6 da Apostila 1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2 flex-wrap">
            <span>Conjugador Visual de Verbos & Adjetivos</span>
            <span className="font-jp text-lg text-slate-400 font-normal whitespace-nowrap">活用の道</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Veja as regras de flexão passo a passo: a base da palavra permanece e a desinência muda conforme o tempo e polidez.
          </p>
        </div>

        {/* Alternador de Modo: Verbos vs Adjetivos */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setConjugationType('verbs')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              conjugationType === 'verbs'
                ? 'bg-white dark:bg-[#131b2e] text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Verbos (3 Grupos)</span>
          </button>
          <button
            onClick={() => setConjugationType('adjectives')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              conjugationType === 'adjectives'
                ? 'bg-white dark:bg-[#131b2e] text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Adjetivos (Tipo い & な)</span>
          </button>
        </div>
      </div>

      {conjugationType === 'verbs' ? (
        /* CONJUGADOR DE VERBOS */
        <div className="space-y-6">
          {/* Filtros de Grupos Verbais */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `Todos os Verbos (${VERBS_DATA.length})` },
              { id: 'g1', label: 'Grupo 1 (Godan / 5 Graus)' },
              { id: 'g2', label: 'Grupo 2 (Ichidan / -iru / -eru)' },
              { id: 'g3', label: 'Grupo 3 (Irregulares: suru & kuru)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setVerbGroupFilter(f.id as 'all' | 'g1' | 'g2' | 'g3')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  verbGroupFilter === f.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Seletor de Verbos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {filteredVerbs.map((verb) => {
              const isSelected = selectedVerb.id === verb.id;
              return (
                <button
                  key={verb.id}
                  onClick={() => {
                    setSelectedVerb(verb);
                    playKana(verb.kanji);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span className="font-jp text-xl font-black text-slate-900 dark:text-white block">
                    {verb.kanji}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    {verb.romaji}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {verb.meaning}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Painel de Conjugação do Verbo Selecionado */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-jp font-black shadow-lg shadow-emerald-600/20">
                  <span className="text-2xl">{selectedVerb.kanji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedVerb.kanji} ({selectedVerb.romaji})
                    </h3>
                    <button
                      onClick={() => playKana(selectedVerb.kanji)}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Significado: {selectedVerb.meaning}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedVerb.groupName}
                  </p>
                </div>
              </div>
            </div>

            {/* Regra de Conjugação do Grupo */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-xs sm:text-sm text-emerald-900 dark:text-emerald-200/90 leading-relaxed">
                <strong className="block text-emerald-950 dark:text-emerald-100 font-extrabold">
                  Lógica Pedagógica da Apostila:
                </strong>
                {selectedVerb.conjugationRule}
              </div>
            </div>

            {/* Matriz das 7 Formas do Verbo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'dictionary', title: '1. Forma Dicionário', desc: 'Informal presente / afirmativo', data: selectedVerb.forms.dictionary },
                { key: 'masu', title: '2. Forma ます (Masu)', desc: 'Polido presente / afirmação', data: selectedVerb.forms.masu },
                { key: 'masuNegative', title: '3. Forma ません (Masen)', desc: 'Polido negativo', data: selectedVerb.forms.masuNegative },
                { key: 'masuPast', title: '4. Forma ました (Mashita)', desc: 'Polido passado', data: selectedVerb.forms.masuPast },
                { key: 'nai', title: '5. Forma ない (Nai)', desc: 'Informal negativo', data: selectedVerb.forms.nai },
                { key: 'ta', title: '6. Forma た (Ta)', desc: 'Informal passado', data: selectedVerb.forms.ta },
                { key: 'te', title: '7. Forma て (Te)', desc: 'Conexão, pedidos & gerúndio', data: selectedVerb.forms.te },
              ].map((item) => (
                <div
                  key={item.key}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3 group hover:border-emerald-300 dark:hover:border-emerald-800 transition-all"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      {item.title}
                    </span>
                    <p className="font-jp text-xl font-extrabold text-slate-900 dark:text-white">
                      {item.data.japanese}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {item.data.romaji}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => playKana(item.data.japanese)}
                    className="p-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-emerald-600 shrink-0"
                    title="Ouvir conjugação"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Frase Contextual Modelo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Exemplo de Frase Real
                </span>
                <p className="font-jp text-base font-bold text-slate-900 dark:text-white">
                  {selectedVerb.exampleSentence.japanese}
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {selectedVerb.exampleSentence.romaji} &bull; &ldquo;{selectedVerb.exampleSentence.translation}&rdquo;
                </p>
              </div>
              <button
                onClick={() => playKana(selectedVerb.exampleSentence.japanese)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 hover:text-emerald-600 shrink-0 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* CONJUGADOR DE ADJETIVOS */
        <div className="space-y-6">
          {/* Filtros de Tipo de Adjetivo */}
          <div className="flex items-center gap-2 pb-1">
            {[
              { id: 'all', label: `Todos os Adjetivos (${ADJECTIVES_DATA.length})` },
              { id: 'i', label: 'Adjetivos do Tipo い (i-keiyoushi)' },
              { id: 'na', label: 'Adjetivos do Tipo な (na-keiyoushi)' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setAdjTypeFilter(f.id as 'all' | 'i' | 'na')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  adjTypeFilter === f.id
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Seletor de Adjetivos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {filteredAdjectives.map((adj) => {
              const isSelected = selectedAdj.id === adj.id;
              return (
                <button
                  key={adj.id}
                  onClick={() => {
                    setSelectedAdj(adj);
                    playKana(adj.kana);
                  }}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-2 ring-emerald-500/30'
                      : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-emerald-300'
                  }`}
                >
                  <span className="font-jp text-xl font-black text-slate-900 dark:text-white block">
                    {adj.kanji}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block">
                    {adj.romaji}
                  </span>
                  <span className="text-[10px] text-slate-500 truncate block">
                    {adj.meaning}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Painel do Adjetivo Selecionado */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-jp font-black shadow-lg shadow-emerald-600/20">
                  <span className="text-2xl">{selectedAdj.kanji}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {selectedAdj.kanji} ({selectedAdj.romaji})
                    </h3>
                    <button
                      onClick={() => playKana(selectedAdj.kana)}
                      className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 hover:bg-emerald-100"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    Significado: {selectedAdj.meaning}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Tipo: {selectedAdj.type === 'i' ? 'Adjetivo do Tipo い (i-keiyoushi)' : 'Adjetivo do Tipo な (na-keiyoushi)'}
                  </p>
                </div>
              </div>
            </div>

            {/* Dica da Apostila */}
            {selectedAdj.notes && (
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
                  <strong>Anotação da Apostila: </strong>
                  {selectedAdj.notes}
                </p>
              </div>
            )}

            {/* As 4 Formas do Adjetivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { title: 'Presente Afirmativo', data: selectedAdj.forms.presentAffirmative, desc: 'Afirmação no presente/futuro' },
                { title: 'Presente Negativo', data: selectedAdj.forms.presentNegative, desc: selectedAdj.type === 'i' ? 'Remove "-i" e adiciona "-kunai"' : 'Acrescenta "janai / janai desu"' },
                { title: 'Passado Afirmativo', data: selectedAdj.forms.pastAffirmative, desc: selectedAdj.type === 'i' ? 'Remove "-i" e adiciona "-katta"' : 'Acrescenta "deshita / datta"' },
                { title: 'Passado Negativo', data: selectedAdj.forms.pastNegative, desc: selectedAdj.type === 'i' ? 'Remove "-i" e adiciona "-kunakatta"' : 'Acrescenta "janakatta"' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                      {item.title}
                    </span>
                    <p className="font-jp text-lg font-extrabold text-slate-900 dark:text-white">
                      {item.data.japanese}
                    </p>
                    <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      {item.data.romaji}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                  <button
                    onClick={() => playKana(item.data.japanese)}
                    className="p-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-emerald-600 shrink-0"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Frase Contextual Modelo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Exemplo de Frase Real
                </span>
                <p className="font-jp text-base font-bold text-slate-900 dark:text-white">
                  {selectedAdj.exampleSentence.japanese}
                </p>
                <p className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {selectedAdj.exampleSentence.romaji} &bull; &ldquo;{selectedAdj.exampleSentence.translation}&rdquo;
                </p>
              </div>
              <button
                onClick={() => playKana(selectedAdj.exampleSentence.japanese)}
                className="p-2.5 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 hover:text-emerald-600 shrink-0 shadow-sm"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
