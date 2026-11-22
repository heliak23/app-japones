import React, { useState, useMemo } from 'react';
import type { WritingCharacterType, WritingCharacterItem } from '../../types/writing';
import { WritingCanvas } from './WritingCanvas';
import { HIRAGANA_CHARACTERS } from '../../data/hiraganaData';
import { KATAKANA_CHARACTERS } from '../../data/katakanaData';
import { KANJI_DATASET, KANJI_CATEGORIES } from '../../data/kanjiDataset';
import { WritingStorageService } from '../../services/writingStorageService';
import { useAudio } from '../../hooks/useAudio';
import {
  PenTool,
  Volume2,
  ChevronLeft,
  ChevronRight,
  Shuffle,
  CheckCircle2,
  Lightbulb,
  Award,
} from 'lucide-react';

interface WritingPracticeViewProps {
  initialType?: WritingCharacterType;
  initialCharacterId?: string;
}

export const WritingPracticeView: React.FC<WritingPracticeViewProps> = ({
  initialType = 'hiragana',
  initialCharacterId,
}) => {
  const [activeType, setActiveType] = useState<WritingCharacterType>(initialType);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  const { playKana, isPlaying } = useAudio();

  // Mapeia KanaCharacter para WritingCharacterItem
  const hiraganaList: WritingCharacterItem[] = useMemo(() => {
    return HIRAGANA_CHARACTERS.map((h) => ({
      id: h.id,
      type: 'hiragana' as const,
      character: h.character,
      romaji: h.romaji,
      ptPronunciation: h.ptPronunciation,
      categoryLabel: h.group,
      mnemonic: h.mnemonicNote,
      strokes: h.character.length,
    }));
  }, []);

  const katakanaList: WritingCharacterItem[] = useMemo(() => {
    return KATAKANA_CHARACTERS.map((k) => ({
      id: k.id,
      type: 'katakana' as const,
      character: k.character,
      romaji: k.romaji,
      ptPronunciation: k.ptPronunciation,
      categoryLabel: k.group,
      mnemonic: k.mnemonicNote,
      strokes: k.character.length,
    }));
  }, []);

  const kanjiList: WritingCharacterItem[] = useMemo(() => {
    return KANJI_DATASET.map((k) => ({
      id: k.id,
      type: 'kanji' as const,
      character: k.character,
      romaji: k.onyomi[0] || k.kunyomi[0] || '',
      meaning: k.meaning,
      strokes: k.strokes,
      categoryLabel: k.categoryLabel,
      mnemonic: k.mnemonicStory,
      onyomi: k.onyomi,
      kunyomi: k.kunyomi,
    }));
  }, []);

  // Lista atual conforme o tipo selecionado
  const currentFullList = useMemo(() => {
    if (activeType === 'hiragana') return hiraganaList;
    if (activeType === 'katakana') return katakanaList;
    return kanjiList;
  }, [activeType, hiraganaList, katakanaList, kanjiList]);

  // Lista filtrada por categoria/linha
  const filteredList = useMemo(() => {
    if (selectedCategory === 'all') return currentFullList;
    if (activeType === 'kanji') {
      const matchCat = KANJI_CATEGORIES.find((c) => c.id === selectedCategory);
      if (!matchCat) return currentFullList;
      return currentFullList.filter((k) => k.categoryLabel === matchCat.label);
    }
    return currentFullList.filter((c) => c.categoryLabel === selectedCategory);
  }, [currentFullList, selectedCategory, activeType]);

  // Ajusta o índice quando filtros ou caractere inicial mudam
  const currentFilterKey = `${activeType}_${selectedCategory}_${initialCharacterId || ''}`;
  const [prevFilterKey, setPrevFilterKey] = useState(currentFilterKey);
  if (prevFilterKey !== currentFilterKey) {
    setPrevFilterKey(currentFilterKey);
    if (initialCharacterId) {
      const idx = filteredList.findIndex((item) => item.id === initialCharacterId);
      setCurrentIndex(idx !== -1 ? idx : 0);
    } else {
      setCurrentIndex(0);
    }
  }

  const currentItem = filteredList[currentIndex] || filteredList[0] || null;

  // Estatísticas de escrita salvas
  const stats = useMemo(() => {
    void refreshKey;
    return WritingStorageService.getStats();
  }, [refreshKey]);

  const isCurrentPracticed = currentItem
    ? WritingStorageService.isCharacterPracticed(currentItem.id)
    : false;

  // Navegação
  const handleNext = () => {
    if (currentIndex < filteredList.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(filteredList.length - 1);
    }
  };

  const handleRandom = () => {
    const rand = Math.floor(Math.random() * filteredList.length);
    setCurrentIndex(rand);
  };

  const handleCompleted = (_score: number) => {
    setRefreshKey((prev) => prev + 1);
  };

  const handlePlayAudio = () => {
    if (currentItem) {
      playKana(currentItem.character);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn pb-12">
      {/* Hero Header Minimalista do Estúdio de Escrita */}
      <div className="relative overflow-hidden bg-gradient-to-r from-rose-500/10 via-brand-500/10 to-amber-500/10 dark:from-rose-950/30 dark:via-brand-950/30 dark:to-amber-950/30 border border-brand-200/60 dark:border-brand-800/60 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-600 text-white shadow-xs">
              <PenTool className="w-3.5 h-3.5" />
              <span>Estúdio de Caligrafia & Traçado</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Prática de Escrita com Guia Translúcida
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Treine sua memória motora desenhando por cima da letra em japonês com a tradicional grade de caligrafia (Genkōyōshi). Pratique Hiragana, Katakana e Kanji com avaliação automática do traço!
            </p>
          </div>

          {/* Card Resumo de Estatísticas */}
          <div className="flex items-center gap-3 sm:gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
                Total Praticado
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  {stats.totalPracticed}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.averageScore > 0 ? `${stats.averageScore}% precisão` : 'Inicie hoje'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Seletor de Alfabeto / Tipo (Hiragana | Katakana | Kanji) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Abas dos 3 Sistemas */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl max-w-fit">
          <button
            onClick={() => {
              setActiveType('hiragana');
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeType === 'hiragana'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="font-jp text-base leading-none">あ</span>
            <span>Hiragana (71)</span>
          </button>

          <button
            onClick={() => {
              setActiveType('katakana');
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeType === 'katakana'
                ? 'bg-amber-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="font-jp text-base leading-none">ア</span>
            <span>Katakana (71)</span>
          </button>

          <button
            onClick={() => {
              setActiveType('kanji');
              setSelectedCategory('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeType === 'kanji'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span className="font-jp text-base leading-none">漢</span>
            <span>Kanji ({KANJI_DATASET.length})</span>
          </button>
        </div>

        {/* Contador de Posição */}
        <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Caractere <span className="text-slate-900 dark:text-white">{currentIndex + 1}</span> de{' '}
          <span className="text-slate-900 dark:text-white">{filteredList.length}</span>
        </div>
      </div>

      {/* Carrossel / Seletor Rápido de Caracteres da Lista Atual */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto py-2 px-1 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700">
          {filteredList.map((item, idx) => {
            const isSelected = idx === currentIndex;
            const isDone = WritingStorageService.isCharacterPracticed(item.id);
            return (
              <button
                key={item.id}
                onClick={() => setCurrentIndex(idx)}
                className={`relative shrink-0 w-12 h-14 sm:w-14 sm:h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-gradient-to-tr from-brand-600 to-rose-600 text-white shadow-md scale-105 ring-2 ring-brand-400'
                    : 'bg-white dark:bg-[#131b2e] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
                }`}
              >
                <span className="font-jp text-lg sm:text-xl font-black leading-none">
                  {item.character}
                </span>
                <span className="text-[10px] font-bold opacity-80 mt-1 truncate max-w-[42px]">
                  {item.type === 'kanji' ? item.meaning?.slice(0, 5) : item.romaji}
                </span>
                {isDone && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bloco Central: Informações do Caractere + Canvas de Desenho */}
      {currentItem && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Coluna Esquerda: Ficha do Caractere */}
          <div className="lg:col-span-5 bg-white dark:bg-[#131b2e] rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {currentItem.categoryLabel || activeType}
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                  {currentItem.type === 'kanji' ? currentItem.meaning : currentItem.romaji.toUpperCase()}
                </h2>
              </div>

              {isCurrentPracticed && (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Já praticado</span>
                </span>
              )}
            </div>

            {/* Pronúncia e Áudio Nativo */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Pronúncia (PT-BR)
                </span>
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {currentItem.ptPronunciation || currentItem.romaji}
                </p>
              </div>

              <button
                onClick={handlePlayAudio}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/50 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-400 font-bold text-xs transition-colors"
                title="Ouvir pronúncia"
              >
                <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce' : ''}`} />
                <span>Ouvir</span>
              </button>
            </div>

            {/* Leituras extras para Kanji */}
            {currentItem.type === 'kanji' && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                {currentItem.onyomi && currentItem.onyomi.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">
                      Onyomi (On)
                    </span>
                    <span className="font-jp font-bold text-brand-600 dark:text-brand-400">
                      {currentItem.onyomi.join(', ')}
                    </span>
                  </div>
                )}
                {currentItem.kunyomi && currentItem.kunyomi.length > 0 && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="font-bold text-slate-400 uppercase text-[10px] block">
                      Kunyomi (Kun)
                    </span>
                    <span className="font-jp font-bold text-amber-600 dark:text-amber-400">
                      {currentItem.kunyomi.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Dica de Memorização Mnemônica */}
            {currentItem.mnemonic && (
              <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl p-4 border border-amber-200/70 dark:border-amber-900/50 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 shrink-0">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider mb-0.5">
                    Dica de Memorização
                  </h4>
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                    {currentItem.mnemonic}
                  </p>
                </div>
              </div>
            )}

            {/* Total de Traços */}
            {currentItem.strokes && (
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span>Contagem de traços:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {currentItem.strokes} {currentItem.strokes === 1 ? 'traço' : 'traços'}
                </span>
              </div>
            )}
          </div>

          {/* Coluna Direita: O Canvas Interativo de Caligrafia */}
          <div className="lg:col-span-7 bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col items-center">
            <WritingCanvas
              character={currentItem.character}
              characterId={currentItem.id}
              type={currentItem.type}
              subtitle={currentItem.type === 'kanji' ? currentItem.meaning : currentItem.romaji}
              onComplete={handleCompleted}
            />

            {/* Barra de Navegação Entre Caracteres */}
            <div className="w-full max-w-md mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
              <button
                onClick={handlePrev}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Anterior</span>
              </button>

              <button
                onClick={handleRandom}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Sortear caractere aleatório"
              >
                <Shuffle className="w-4 h-4" />
                <span className="hidden sm:inline">Aleatório</span>
              </button>

              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-sm transition-all hover:scale-105 active:scale-95"
              >
                <span>Próximo</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
