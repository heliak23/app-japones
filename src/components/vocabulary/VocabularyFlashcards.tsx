import React, { useState } from 'react';
import type { VocabularyWord } from '../../types/vocabulary';
import {
  ChevronLeft,
  ChevronRight,
  Shuffle,
  Volume2,
  CheckCircle2,
  Eye,
  EyeOff,
  BookOpen,
} from 'lucide-react';

interface VocabularyFlashcardsProps {
  words: VocabularyWord[];
  learnedWordIds: string[];
  onToggleLearned: (id: string) => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio?: boolean;
}

export const VocabularyFlashcards: React.FC<VocabularyFlashcardsProps> = ({
  words,
  learnedWordIds,
  onToggleLearned,
  onPlayAudio,
  isPlayingAudio = false,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFurigana, setShowFurigana] = useState(false); // Por padrão oculto para testar a memória (Filosofia Anki da Apostila 2)
  const [shuffledList, setShuffledList] = useState<VocabularyWord[]>(words);

  if (words.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-[#131b2e] rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Nenhuma palavra disponível para este filtro.
        </p>
      </div>
    );
  }

  const currentWord = shuffledList[currentIndex] || shuffledList[0];
  const isLearned = learnedWordIds.includes(currentWord.id);
  const hasKanji = currentWord.kanji !== currentWord.kana;

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev < shuffledList.length - 1 ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : shuffledList.length - 1));
  };

  const handleShuffle = () => {
    const copy = [...words].sort(() => Math.random() - 0.5);
    setShuffledList(copy);
    setCurrentIndex(0);
    setIsFlipped(false);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Controles do Topo: Progresso, Embaralhar e Toggle de Furigana */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700 dark:text-slate-300">
            Card {currentIndex + 1} de {shuffledList.length}
          </span>
          <button
            type="button"
            onClick={handleShuffle}
            className="p-1.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-500 transition-colors inline-flex items-center gap-1"
            title="Embaralhar baralho"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Embaralhar</span>
          </button>
        </div>

        {/* Toggle Furigana (Filosofia Anki) */}
        <button
          type="button"
          onClick={() => setShowFurigana((prev) => !prev)}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
            showFurigana
              ? 'bg-brand-100 dark:bg-brand-950/70 text-brand-700 dark:text-brand-300 border border-brand-300/80 dark:border-brand-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
          title="Revelar ou esconder furigana"
        >
          {showFurigana ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>{showFurigana ? 'Furigana Visível' : 'Furigana Oculto'}</span>
        </button>
      </div>

      {/* Barra de Progresso do Baralho */}
      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-brand-600 to-rose-500 h-full transition-all duration-300 rounded-full"
          style={{ width: `${Math.round(((currentIndex + 1) / shuffledList.length) * 100)}%` }}
        />
      </div>

      {/* Cartão 3D Interativo */}
      <div
        onClick={() => setIsFlipped((prev) => !prev)}
        className="relative min-h-[340px] sm:min-h-[380px] w-full bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200/90 dark:border-slate-800 cursor-pointer flex flex-col justify-between select-none group transition-all hover:border-brand-400 dark:hover:border-brand-500"
      >
        {/* Topo do Card */}
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {currentWord.categoryLabel}
          </span>

          <div className="flex items-center gap-2">
            {isLearned && (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="w-3 h-3" />
                <span>Aprendida</span>
              </span>
            )}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPlayAudio(currentWord.audioText);
              }}
              className="p-2 rounded-xl text-brand-600 dark:text-brand-400 bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 transition-colors"
              title="Ouvir pronúncia"
            >
              <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
            </button>
          </div>
        </div>

        {/* Centro do Card: Frente (Japonês) ou Verso (Significado + Frase) */}
        {!isFlipped ? (
          <div className="my-auto text-center space-y-3 py-6">
            <span className="font-jp text-5xl sm:text-6xl font-normal text-slate-900 dark:text-white leading-relaxed select-none block">
              {currentWord.kanji}
            </span>

            {hasKanji && showFurigana && (
              <p className="font-jp text-lg font-normal text-brand-600 dark:text-brand-400 animate-fadeIn">
                {currentWord.kana}
              </p>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500">
              Toque no cartão para virar e ver a tradução 🔄
            </p>
          </div>
        ) : (
          <div className="my-auto text-center space-y-4 py-4 animate-fadeIn">
            <div>
              <span className="font-jp text-2xl font-normal text-slate-700 dark:text-slate-300">
                {currentWord.kanji}
              </span>
              <p className="font-jp text-sm text-slate-500 dark:text-slate-400">
                {currentWord.kana}
              </p>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-0.5">
                {currentWord.romaji}
              </p>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-600 dark:text-brand-400">
              {currentWord.meaning}
            </h3>

            {/* Frase de Exemplo no Verso */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-left">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <BookOpen className="w-3 h-3 text-brand-500" />
                  <span>Exemplo</span>
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onPlayAudio(currentWord.exampleSentence.audioText);
                  }}
                  className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline inline-flex items-center gap-1"
                >
                  <Volume2 className="w-3 h-3" />
                  <span>Ouvir</span>
                </button>
              </div>
              <p className="font-jp text-sm text-slate-900 dark:text-slate-100">
                {currentWord.exampleSentence.japanese}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 italic mt-0.5">
                "{currentWord.exampleSentence.meaning}"
              </p>
            </div>
          </div>
        )}

        {/* Rodapé do Card */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>{currentWord.source.split('(')[0].trim()}</span>
          <span className="text-brand-600 dark:text-brand-400 font-semibold group-hover:underline">
            {isFlipped ? 'Voltar para frente' : 'Ver tradução'}
          </span>
        </div>
      </div>

      {/* Controles de Navegação e Marcação */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 font-semibold text-xs shadow-xs transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <button
          type="button"
          onClick={() => onToggleLearned(currentWord.id)}
          className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl font-bold text-xs shadow-xs transition-all ${
            isLearned
              ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{isLearned ? 'Aprendida ✓' : 'Já aprendi!'}</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-sm shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
        >
          <span>Próximo</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
