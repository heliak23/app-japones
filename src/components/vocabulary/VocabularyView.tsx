import React, { useState, useMemo } from 'react';
import type { VocabularyCategory, VocabularyWord } from '../../types/vocabulary';
import { VOCABULARY_DATASET, VOCABULARY_CATEGORIES } from '../../data/vocabularyData';
import { VocabularyStorageService } from '../../services/vocabularyStorageService';
import { VocabularyCard } from './VocabularyCard';
import { VocabularyDetailModal } from './VocabularyDetailModal';
import { VocabularyFlashcards } from './VocabularyFlashcards';
import { VocabularyQuizView } from './VocabularyQuizView';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Search,
  BookOpen,
  Layers,
  GraduationCap,
} from 'lucide-react';

type VocabularyViewTab = 'explore' | 'flashcards' | 'quiz';

export const VocabularyView: React.FC = () => {
  const [viewTab, setViewTab] = useState<VocabularyViewTab>('explore');
  const [selectedCategory, setSelectedCategory] = useState<VocabularyCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  // Estados de progresso persistidos no Storage
  const [progress, setProgress] = useState(() => VocabularyStorageService.getProgress());
  const { playKana, isPlaying } = useAudio();

  const totalWords = VOCABULARY_DATASET.length;
  const learnedCount = progress.learnedWordIds.length;
  const progressPercent = Math.round((learnedCount / totalWords) * 100);

  // Toggle Aprendida
  const handleToggleLearned = (wordId: string) => {
    const updated = VocabularyStorageService.toggleLearned(wordId);
    setProgress(updated);
  };

  // Toggle Favorita
  const handleToggleBookmarked = (wordId: string) => {
    const updated = VocabularyStorageService.toggleBookmarked(wordId);
    setProgress(updated);
  };

  // Reproduzir Áudio
  const handlePlayAudio = (text: string) => {
    playKana(text);
  };

  // Filtragem de Palavras por Categoria e Busca
  const filteredWords = useMemo(() => {
    return VOCABULARY_DATASET.filter((w) => {
      const matchCat = selectedCategory === 'all' || w.category === selectedCategory;
      if (!matchCat) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      return (
        w.kanji.includes(q) ||
        w.kana.includes(q) ||
        w.romaji.toLowerCase().includes(q) ||
        w.meaning.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  // Navegação no Modal de Detalhes
  const currentDetailIndex = selectedWord
    ? filteredWords.findIndex((w) => w.id === selectedWord.id)
    : -1;
  const hasPrev = currentDetailIndex > 0;
  const hasNext = currentDetailIndex < filteredWords.length - 1 && currentDetailIndex !== -1;

  const handleNextWord = () => {
    if (hasNext) setSelectedWord(filteredWords[currentDetailIndex + 1]);
  };

  const handlePrevWord = () => {
    if (hasPrev) setSelectedWord(filteredWords[currentDetailIndex - 1]);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Banner Principal com Apresentação dos Materiais */}
      <section className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Baseado nas Apostilas 1 & 2 e Leituras Tadoku</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-3 flex-wrap">
              <span>Banco de Palavras</span>
              <span className="font-jp text-xl sm:text-2xl text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap">
                単語
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Aprenda o vocabulário essencial em japonês direto no contexto das lições reais. Estude com pronúncia em áudio nativo, frases de exemplo, flashcards no estilo Anki e exercícios com feedback instantâneo.
            </p>
          </div>

          {/* Card de Progresso Geral */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3 min-w-[240px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Palavras Aprendidas
              </span>
              <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-brand-600 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span><strong>{learnedCount}</strong> de {totalWords} palavras</span>
              {progress.totalQuizzesCompleted > 0 && (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {progress.totalQuizzesCompleted} {progress.totalQuizzesCompleted === 1 ? 'treino' : 'treinos'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Abas Superiores de Navegação */}
        <div className="flex items-center gap-2 mt-8 border-t border-slate-100 dark:border-slate-800/80 pt-6 flex-wrap">
          <button
            type="button"
            onClick={() => setViewTab('explore')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              viewTab === 'explore'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Explorar Palavras</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('flashcards')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              viewTab === 'flashcards'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modo Flashcards (Anki)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewTab('quiz')}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs sm:text-sm transition-all ${
              viewTab === 'quiz'
                ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/20'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Exercícios & Treinos</span>
          </button>
        </div>
      </section>

      {/* 1. MODO EXPLORAR: LISTA COM BUSCA & FILTRO POR CATEGORIA */}
      {viewTab === 'explore' && (
        <div className="space-y-6">
          {/* Barra de Pesquisa e Filtros */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Campo de Busca */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por palavra em japonês, romaji ou tradução..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
              Mostrando {filteredWords.length} de {totalWords} palavras
            </div>
          </div>

          {/* Categorias Temáticas das Apostilas */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {VOCABULARY_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id as VocabularyCategory | 'all')}
                  className={`px-3 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 shrink-0 border ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                      : 'bg-white dark:bg-[#131b2e] border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Grade de Cards de Palavras */}
          {filteredWords.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 p-8 space-y-2">
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Nenhuma palavra encontrada para "{searchQuery}".
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Tente buscar por termos em português, romaji ou caracteres em hiragana/katakana.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredWords.map((word) => (
                <VocabularyCard
                  key={word.id}
                  word={word}
                  isLearned={progress.learnedWordIds.includes(word.id)}
                  isBookmarked={progress.bookmarkedWordIds.includes(word.id)}
                  onToggleLearned={handleToggleLearned}
                  onToggleBookmarked={handleToggleBookmarked}
                  onPlayAudio={handlePlayAudio}
                  onOpenDetails={(w) => setSelectedWord(w)}
                  isPlayingAudio={isPlaying}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. MODO FLASHCARDS (ANKI) */}
      {viewTab === 'flashcards' && (
        <VocabularyFlashcards
          words={filteredWords}
          learnedWordIds={progress.learnedWordIds}
          onToggleLearned={handleToggleLearned}
          onPlayAudio={handlePlayAudio}
          isPlayingAudio={isPlaying}
        />
      )}

      {/* 3. MODO EXERCÍCIOS & TREINOS */}
      {viewTab === 'quiz' && (
        <VocabularyQuizView
          words={filteredWords.length >= 4 ? filteredWords : VOCABULARY_DATASET}
          onPlayAudio={handlePlayAudio}
          isPlayingAudio={isPlaying}
        />
      )}

      {/* Modal de Detalhes da Palavra com Contexto da Apostila */}
      <VocabularyDetailModal
        word={selectedWord}
        isOpen={Boolean(selectedWord)}
        onClose={() => setSelectedWord(null)}
        isLearned={Boolean(selectedWord && progress.learnedWordIds.includes(selectedWord.id))}
        isBookmarked={Boolean(selectedWord && progress.bookmarkedWordIds.includes(selectedWord.id))}
        onToggleLearned={handleToggleLearned}
        onToggleBookmarked={handleToggleBookmarked}
        onPlayAudio={handlePlayAudio}
        onNext={handleNextWord}
        onPrev={handlePrevWord}
        hasNext={hasNext}
        hasPrev={hasPrev}
        isPlayingAudio={isPlaying}
      />
    </div>
  );
};
