import React, { useState } from 'react';
import type { PhraseLesson, PhraseStep } from '../../types/phrase';
import { FuriganaText } from '../common/FuriganaText';
import { useAudio } from '../../hooks/useAudio';
import {
  Volume2,
  Brain,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  HelpCircle,
  SlidersHorizontal,
} from 'lucide-react';

interface PhraseStepViewerProps {
  lesson: PhraseLesson;
  onFinishSteps: () => void;
  onBackToList: () => void;
}

export const PhraseStepViewer: React.FC<PhraseStepViewerProps> = ({
  lesson,
  onFinishSteps,
  onBackToList,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showFurigana, setShowFurigana] = useState(true);
  const [showRomaji, setShowRomaji] = useState(true);
  const [selectedVariationIndex, setSelectedVariationIndex] = useState<number | null>(null);

  const { playKana, isPlaying } = useAudio();

  const currentStep: PhraseStep = lesson.steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === lesson.steps.length - 1;

  const handleNext = () => {
    if (!isLastStep) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedVariationIndex(null);
    } else {
      onFinishSteps();
    }
  };

  const handlePrev = () => {
    if (!isFirstStep) {
      setCurrentStepIndex((prev) => prev - 1);
      setSelectedVariationIndex(null);
    }
  };

  const handleAudioPlay = (textToPlay: string) => {
    playKana(textToPlay);
  };

  // Variação selecionada atualmente (se houver)
  const activeVariation =
    selectedVariationIndex !== null && lesson.variations
      ? lesson.variations[selectedVariationIndex]
      : null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Barra Superior de Navegação da Lição */}
      <div className="flex items-center justify-between gap-3 bg-white dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onBackToList}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar à Trilha</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Toggle Furigana */}
          <button
            onClick={() => setShowFurigana(!showFurigana)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              showFurigana
                ? 'bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border-brand-200 dark:border-brand-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
            }`}
            title="Ligar/Desligar leitura Furigana"
          >
            Furigana
          </button>

          {/* Toggle Romaji */}
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
              showRomaji
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-transparent'
            }`}
            title="Ligar/Desligar Romaji"
          >
            Romaji
          </button>
        </div>
      </div>

      {/* Indicador de Passos (Stepper Visual) */}
      <div className="bg-white dark:bg-[#131b2e] p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-500 dark:text-slate-400">
          <span className="text-brand-600 dark:text-brand-400 uppercase tracking-wider text-[11px] sm:text-xs">
            {lesson.moduleTitle}
          </span>
          <span>
            Passo {currentStepIndex + 1} de {lesson.steps.length}
          </span>
        </div>

        {/* Barra de Progresso Segmentada Flexível */}
        <div className="flex gap-1.5 sm:gap-2">
          {lesson.steps.map((step, idx) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                setCurrentStepIndex(idx);
                setSelectedVariationIndex(null);
              }}
              className={`flex-1 h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                idx === currentStepIndex
                  ? 'bg-amber-500 shadow-md shadow-amber-500/20 ring-2 ring-amber-400/50'
                  : idx < currentStepIndex
                  ? 'bg-emerald-500'
                  : 'bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
              title={`Ir para o Passo ${idx + 1}: ${step.title}`}
            />
          ))}
        </div>

        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white pt-1">
          {currentStep.title}
        </h2>
      </div>

      {/* Card Principal da Frase em Construção */}
      <div className="relative overflow-hidden bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg text-center space-y-6">
        {/* Badge do termo que foi adicionado neste passo */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-xs sm:text-sm font-bold">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin-slow" />
          <span>Peça adicionada agora: <strong>{currentStep.highlightedPart}</strong></span>
        </div>

        {/* Visualização da Frase Japonesa com Furigana */}
        <div className="py-4 sm:py-6 flex flex-col items-center justify-center min-h-[120px]">
          {activeVariation ? (
            <div className="space-y-2">
              <span className="font-jp text-3xl sm:text-5xl font-black text-slate-900 dark:text-white">
                {activeVariation.japanese}
              </span>
              {showRomaji && (
                <p className="text-slate-500 dark:text-slate-400 text-base font-semibold tracking-wide">
                  {activeVariation.romaji}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <FuriganaText
                fragments={currentStep.fragments}
                showFurigana={showFurigana}
                size="2xl"
                highlightNew={true}
              />
              {showRomaji && (
                <p className="text-slate-500 dark:text-slate-400 text-base sm:text-lg font-semibold tracking-wide">
                  {currentStep.romaji}
                </p>
              )}
            </div>
          )}

          {/* Botão de Áudio Nativo */}
          <button
            onClick={() =>
              handleAudioPlay(activeVariation ? activeVariation.japanese : currentStep.audioText)
            }
            disabled={isPlaying}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800/60 font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <Volume2 className={`w-4 h-4 ${isPlaying ? 'animate-bounce text-brand-500' : ''}`} />
            <span>{isPlaying ? 'Ouvindo...' : 'Ouvir Pronúncia'}</span>
          </button>
        </div>

        {/* As Duas Traduções: "Como o Japonês Pensa" vs "Tradução Natural" */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left pt-2">
          {/* Caixa: Como o Japonês Pensa (Literal) */}
          <div className="bg-amber-500/10 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/40 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-400">
              <Brain className="w-4 h-4" />
              <span>Como o Japonês Pensa (Literal)</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base italic">
              "{activeVariation ? activeVariation.meaning : currentStep.literalMeaning}"
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              A ordem e o raciocínio exato da mente japonesa.
            </p>
          </div>

          {/* Caixa: Tradução Natural (Português) */}
          <div className="bg-emerald-500/10 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-800/40 rounded-2xl p-4 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Tradução Natural (PT-BR)</span>
            </div>
            <p className="text-slate-800 dark:text-slate-200 font-bold text-sm sm:text-base">
              "{activeVariation ? activeVariation.meaning : currentStep.naturalMeaning}"
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
              Como nós falamos naturalmente em português.
            </p>
          </div>
        </div>

        {/* Explicação Didática do Livro */}
        <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 text-left space-y-2">
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            <HelpCircle className="w-4 h-4 text-brand-500" />
            <span>Explicação Descomplicada</span>
          </div>
          <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
            {activeVariation ? activeVariation.explanation : currentStep.explanation}
          </p>
        </div>

        {/* Simulador Interativo de Variações (se a lição tiver variações como formal/informal/passado) */}
        {lesson.variations && lesson.variations.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
              <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-500" />
              <span>Experimente as variações da frase em tempo real:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedVariationIndex(null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedVariationIndex === null
                    ? 'bg-indigo-600 dark:bg-white text-white dark:text-indigo-950 shadow'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Padrão da Lição
              </button>

              {lesson.variations.map((v, vIdx) => (
                <button
                  key={v.type + vIdx}
                  onClick={() => setSelectedVariationIndex(vIdx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedVariationIndex === vIdx
                      ? 'bg-indigo-600 text-white shadow'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Barra Inferior com Ações de Próximo / Anterior */}
      <div className="flex items-center justify-between gap-4 pt-2">
        <button
          onClick={handlePrev}
          disabled={isFirstStep}
          className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all ${
            isFirstStep
              ? 'opacity-40 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
              : 'bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Passo Anterior</span>
        </button>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm bg-brand-600 hover:bg-brand-500 text-white shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>{isLastStep ? 'Fazer o Quiz da Lição 🎯' : 'Próximo Passo'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
