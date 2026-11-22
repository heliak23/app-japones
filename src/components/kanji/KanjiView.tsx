import React, { useState } from 'react';
import type { KanjiCharacter, KanjiCategory } from '../../types/kanji';
import { KANJI_DATASET, KANJI_CATEGORIES } from '../../data/kanjiDataset';
import { KanjiStorageService } from '../../services/kanjiStorageService';
import { KanjiCard } from './KanjiCard';
import { KanjiDetailModal } from './KanjiDetailModal';
import { KanjiRadicalExplorer } from './KanjiRadicalExplorer';
import { KanjiFlashcards } from './KanjiFlashcards';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Grid,
  Layers,
  Search,
  BookOpen,
  Trophy,
  Brain,
} from 'lucide-react';

type KanjiViewMode = 'grid' | 'radicals' | 'flashcards';

export const KanjiView: React.FC = () => {
  const [viewMode, setViewMode] = useState<KanjiViewMode>('grid');
  const [selectedCategory, setSelectedCategory] = useState<KanjiCategory | 'all'>('book_specials');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKanji, setSelectedKanji] = useState<KanjiCharacter | null>(null);
  const [studiedIds, setStudiedIds] = useState<string[]>(() => {
    return KanjiStorageService.getProgress().studiedKanjiIds;
  });

  const { playKana, isPlaying } = useAudio();

  const totalKanjis = KANJI_DATASET.length;
  const studiedCount = studiedIds.length;
  const progressPercent = Math.round((studiedCount / totalKanjis) * 100);

  // Toggle estudado
  const handleToggleStudied = (id: string) => {
    const updated = KanjiStorageService.toggleStudied(id);
    setStudiedIds([...updated.studiedKanjiIds]);
  };

  const handlePlayAudio = (e: React.MouseEvent | string, text?: string) => {
    const textToSpeak = typeof e === 'string' ? e : text;
    if (textToSpeak) {
      if (typeof e !== 'string') e.stopPropagation();
      playKana(textToSpeak);
    }
  };

  // Filtragem
  const filteredKanjis = KANJI_DATASET.filter((k) => {
    const matchesCategory =
      selectedCategory === 'all' || k.category === selectedCategory;

    if (!matchesCategory) return false;

    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    return (
      k.character.includes(query) ||
      k.meaning.toLowerCase().includes(query) ||
      k.kunyomi.some((kun) => kun.toLowerCase().includes(query)) ||
      k.onyomi.some((on) => on.toLowerCase().includes(query)) ||
      k.radical.name.toLowerCase().includes(query)
    );
  });

  // Navegação no Modal
  const currentIndex = selectedKanji
    ? filteredKanjis.findIndex((k) => k.id === selectedKanji.id)
    : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < filteredKanjis.length - 1 && currentIndex !== -1;

  const handleNextKanji = () => {
    if (hasNext) setSelectedKanji(filteredKanjis[currentIndex + 1]);
  };

  const handlePrevKanji = () => {
    if (hasPrev) setSelectedKanji(filteredKanjis[currentIndex - 1]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner de Apresentação e Quebra de Paradigma do Livro */}
      <section className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sistema Ideográfico Japonês</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Kanjis Essenciais</span>
              <span className="font-jp text-xl sm:text-2xl text-slate-400 dark:text-slate-500 font-normal">
                漢字
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Kanjis não são traços aleatórios e você não precisa decorar 2.000 ideogramas de uma vez! Seguindo o método do livro, você aprende através de peças de montar (radicais) e da fórmula: <strong>Forma ➔ Som ➔ Significado</strong>.
            </p>
          </div>

          {/* Card de Progresso */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                Kanjis Dominados
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-black">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>{studiedCount} de {totalKanjis} dominados</span>
              <span>JLPT N5 Fundamentais</span>
            </div>
          </div>
        </div>

        {/* Régua da Fórmula Mental do Livro */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-brand-500" />
            <span>Fórmula Mental de Leitura:</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] sm:text-xs">
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
              1. FORMA (愛)
            </span>
            <span className="text-slate-400">➔</span>
            <span className="px-2.5 py-1 rounded-lg bg-brand-50 dark:bg-brand-950/60 font-bold text-brand-700 dark:text-brand-300">
              2. SOM (あい)
            </span>
            <span className="text-slate-400">➔</span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 font-bold text-emerald-700 dark:text-emerald-300">
              3. SIGNIFICADO (Amor)
            </span>
          </div>
        </div>
      </section>

      {/* Barra de Ações: Modos de Visualização & Busca */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Alternador de Modo de Visão */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#131b2e] border border-slate-200/80 dark:border-slate-800 rounded-2xl">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Catálogo</span>
          </button>

          <button
            onClick={() => setViewMode('radicals')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'radicals'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-indigo-500" />
            <span>Lego de Radicais</span>
          </button>

          <button
            onClick={() => setViewMode('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === 'flashcards'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span>Flashcards</span>
          </button>
        </div>

        {/* Campo de Busca (Ativo no modo catálogo e flashcards) */}
        {viewMode !== 'radicals' && (
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por Kanji, som ou significado..."
              className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-colors"
            />
          </div>
        )}
      </div>

      {/* Filtros por Categoria (no modo catálogo) */}
      {viewMode === 'grid' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-rose-600 dark:bg-white text-white dark:text-slate-900 shadow-sm'
                : 'bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            Todos ({totalKanjis})
          </button>

          {KANJI_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = KANJI_DATASET.filter((k) => k.category === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-1.5 border ${
                  isSelected
                    ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                    : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Conteúdo Dinâmico por Modo */}
      {viewMode === 'grid' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>Exibindo <strong>{filteredKanjis.length}</strong> ideogramas</span>
            <span>Toque para ver a história e palavras compostas</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {filteredKanjis.map((kanji) => (
              <KanjiCard
                key={kanji.id}
                kanji={kanji}
                isStudied={studiedIds.includes(kanji.id)}
                onToggleStudied={handleToggleStudied}
                onClick={(k) => setSelectedKanji(k)}
                onPlayAudio={handlePlayAudio}
                isPlaying={isPlaying}
              />
            ))}
          </div>
        </div>
      )}

      {viewMode === 'radicals' && (
        <KanjiRadicalExplorer
          onSelectKanji={(k) => setSelectedKanji(k)}
          studiedIds={studiedIds}
        />
      )}

      {viewMode === 'flashcards' && (
        <KanjiFlashcards
          kanjis={filteredKanjis}
          studiedIds={studiedIds}
          onToggleStudied={handleToggleStudied}
          onPlayAudio={(text) => handlePlayAudio(text)}
        />
      )}

      {/* Modal de Detalhes Completo com Leituras, Mnemônico e Palavras Compostas */}
      <KanjiDetailModal
        kanji={selectedKanji}
        isOpen={selectedKanji !== null}
        onClose={() => setSelectedKanji(null)}
        isStudied={selectedKanji ? studiedIds.includes(selectedKanji.id) : false}
        onToggleStudied={handleToggleStudied}
        onPlayAudio={(text) => handlePlayAudio(text)}
        isPlaying={isPlaying}
        onNext={handleNextKanji}
        onPrev={handlePrevKanji}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </div>
  );
};
