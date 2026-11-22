import React, { useState } from 'react';
import {
  KOSOADO_ITEMS,
  KOSOADO_QUIZ_QUESTIONS,
  type KosoadoItem,
} from '../../data/kosoadoData';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Compass,
  ArrowRight,
} from 'lucide-react';

export const KosoadoVisualizer: React.FC = () => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<KosoadoItem>(KOSOADO_ITEMS[0]);
  const [activeTab, setActiveTab] = useState<'visual' | 'table' | 'quiz'>('visual');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const { playKana } = useAudio();

  const currentQuiz = KOSOADO_QUIZ_QUESTIONS[quizIndex];

  const handleSelectOption = (label: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(label);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < KOSOADO_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="p-4 sm:p-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 text-white border border-white/30 mb-1.5">
            <Compass className="w-3.5 h-3.5" />
            <span>Sistema Espacial Mnemônico</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Laboratório Visual: Ko-So-A-Do (こそあど)
          </h2>
          <p className="text-xs sm:text-sm text-emerald-50 max-w-2xl mt-0.5 leading-relaxed">
            Entenda como a língua japonesa divide o espaço ao redor das pessoas: <strong>KO</strong> (perto de mim), <strong>SO</strong> (perto de você), <strong>A</strong> (longe de ambos) e <strong>DO</strong> (pergunta).
          </p>
        </div>

        {/* Tab Navigator */}
        <div className="flex items-center p-1 bg-black/20 backdrop-blur-md rounded-xl self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'visual'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Mapa Espacial
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'table'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Matriz Completa
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-white text-emerald-900 shadow-sm'
                : 'text-white/80 hover:text-white'
            }`}
          >
            Quiz Prático
          </button>
        </div>
      </div>

      {/* Conteúdo Aba 1: Mapa Espacial Interativo */}
      {activeTab === 'visual' && (
        <div className="p-4 sm:p-6 space-y-6">
          {/* 4 Quadrantes Interativos de Distância */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {KOSOADO_ITEMS.map((item) => {
              const isSelected = selectedQuadrant.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedQuadrant(item)}
                  className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 shadow-md scale-102 ring-2 ring-emerald-500/20'
                      : 'bg-slate-50 dark:bg-[#182238] border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-jp text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                      {item.prefix}
                    </span>
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isSelected
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.romajiPrefix}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white">
                      {item.objectWord.japanese} ({item.objectWord.romaji})
                    </h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {item.spatialMeaning}
                    </p>
                  </div>

                  <div className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-100/60 dark:bg-emerald-950/60 px-2 py-1 rounded-md">
                    💡 {item.mnemonic}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Área de Detalhamento do Quadrante Selecionado */}
          <div className="bg-slate-50 dark:bg-[#0f172a] rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                  Zona Selecionada: {selectedQuadrant.romajiPrefix} ({selectedQuadrant.prefix})
                </span>
                <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white mt-0.5">
                  {selectedQuadrant.spatialMeaning}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => playKana(selectedQuadrant.exampleSentence.japanese)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#182238] border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-600 hover:border-emerald-500 transition-colors self-start sm:self-auto shadow-xs"
              >
                <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Ouvir Frase Modelo</span>
              </button>
            </div>

            {/* As 4 Variações da Família */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-white dark:bg-[#182238] p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Objeto / Coisa</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-jp text-lg font-black text-slate-900 dark:text-white">
                    {selectedQuadrant.objectWord.japanese}
                  </span>
                  <button
                    onClick={() => playKana(selectedQuadrant.objectWord.japanese)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {selectedQuadrant.objectWord.romaji}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {selectedQuadrant.objectWord.translation}
                </span>
              </div>

              <div className="bg-white dark:bg-[#182238] p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">+ Substantivo</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-jp text-lg font-black text-slate-900 dark:text-white">
                    {selectedQuadrant.modifierWord.japanese}
                  </span>
                  <button
                    onClick={() => playKana(selectedQuadrant.modifierWord.japanese)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {selectedQuadrant.modifierWord.romaji}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {selectedQuadrant.modifierWord.translation}
                </span>
              </div>

              <div className="bg-white dark:bg-[#182238] p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Lugar / Local</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-jp text-lg font-black text-slate-900 dark:text-white">
                    {selectedQuadrant.placeWord.japanese}
                  </span>
                  <button
                    onClick={() => playKana(selectedQuadrant.placeWord.japanese)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {selectedQuadrant.placeWord.romaji}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {selectedQuadrant.placeWord.translation}
                </span>
              </div>

              <div className="bg-white dark:bg-[#182238] p-3 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Direção / Cortês</span>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-jp text-lg font-black text-slate-900 dark:text-white">
                    {selectedQuadrant.directionWord.japanese}
                  </span>
                  <button
                    onClick={() => playKana(selectedQuadrant.directionWord.japanese)}
                    className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                  {selectedQuadrant.directionWord.romaji}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                  {selectedQuadrant.directionWord.translation}
                </span>
              </div>
            </div>

            {/* Frase Modelo em Destaque */}
            <div className="bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="font-jp text-xl sm:text-2xl font-black text-slate-900 dark:text-white block">
                  {selectedQuadrant.exampleSentence.japanese}
                </span>
                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 block">
                  {selectedQuadrant.exampleSentence.romaji}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 block">
                  Tradução: "{selectedQuadrant.exampleSentence.translation}"
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {selectedQuadrant.exampleSentence.explanation}
                </p>
              </div>

              <button
                type="button"
                onClick={() => playKana(selectedQuadrant.exampleSentence.japanese)}
                className="p-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all shrink-0 active:scale-95"
                title="Tocar áudio da frase"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Aba 2: Matriz Comparativa Completa */}
      {activeTab === 'table' && (
        <div className="p-4 sm:p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-xs font-extrabold uppercase text-slate-500 dark:text-slate-400">
                <th className="py-3 px-3">Distância / Posição</th>
                <th className="py-3 px-3">Objeto (..れ)</th>
                <th className="py-3 px-3">+ Nome (..の)</th>
                <th className="py-3 px-3">Lugar (..こ)</th>
                <th className="py-3 px-3">Cortês (..ちら)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs sm:text-sm">
              {KOSOADO_ITEMS.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3">
                    <span className="font-extrabold text-slate-900 dark:text-white block">
                      {item.romajiPrefix} ({item.prefix})
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {item.spatialMeaning}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => playKana(item.objectWord.japanese)}
                      className="font-jp font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{item.objectWord.japanese}</span>
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {item.objectWord.romaji}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => playKana(item.modifierWord.japanese)}
                      className="font-jp font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{item.modifierWord.japanese}</span>
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {item.modifierWord.romaji}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => playKana(item.placeWord.japanese)}
                      className="font-jp font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{item.placeWord.japanese}</span>
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {item.placeWord.romaji}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <button
                      onClick={() => playKana(item.directionWord.japanese)}
                      className="font-jp font-black text-slate-900 dark:text-white hover:text-emerald-600 transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>{item.directionWord.japanese}</span>
                      <Volume2 className="w-3 h-3 text-slate-400" />
                    </button>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500 block">
                      {item.directionWord.romaji}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Conteúdo Aba 3: Quiz Prático com Cenários Reais */}
      {activeTab === 'quiz' && (
        <div className="p-4 sm:p-6 max-w-2xl mx-auto space-y-6">
          {!quizFinished ? (
            <div className="space-y-5">
              {/* Progresso do Quiz */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                <span>Pergunta {quizIndex + 1} de {KOSOADO_QUIZ_QUESTIONS.length}</span>
                <span>Pontuação: {score} acertos</span>
              </div>

              {/* Cenário Descritivo */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" /> Cenário no Dia a Dia:
                </span>
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {currentQuiz.scenario}
                </p>
              </div>

              {/* Pergunta */}
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                {currentQuiz.question}
              </h3>

              {/* Opções */}
              <div className="space-y-2.5">
                {currentQuiz.options.map((opt) => {
                  const isSelected = selectedOption === opt.label;
                  const isCorrect = opt.label === currentQuiz.correctAnswer;

                  let borderStyle = 'border-slate-200 dark:border-slate-700 hover:border-slate-300';
                  let bgStyle = 'bg-white dark:bg-[#182238]';

                  if (isAnswerSubmitted) {
                    if (isCorrect) {
                      borderStyle = 'border-emerald-500 ring-2 ring-emerald-500/20';
                      bgStyle = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200';
                    } else if (isSelected && !isCorrect) {
                      borderStyle = 'border-rose-500 ring-2 ring-rose-500/20';
                      bgStyle = 'bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200';
                    }
                  } else if (isSelected) {
                    borderStyle = 'border-emerald-500 ring-2 ring-emerald-500/20';
                    bgStyle = 'bg-emerald-50/50 dark:bg-emerald-950/30';
                  }

                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={isAnswerSubmitted}
                      onClick={() => handleSelectOption(opt.label)}
                      className={`w-full p-3.5 rounded-xl border text-left flex flex-col justify-between transition-all ${borderStyle} ${bgStyle}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-jp text-base font-bold">
                          {opt.label}
                        </span>
                        {isAnswerSubmitted && isCorrect && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        )}
                        {isAnswerSubmitted && isSelected && !isCorrect && (
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 mt-0.5">
                        {opt.romaji}
                      </span>
                      {isAnswerSubmitted && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                          {opt.explanation}
                        </p>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Botão de Ação */}
              <div className="pt-2">
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    disabled={!selectedOption}
                    onClick={handleConfirmAnswer}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm transition-all shadow-sm"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuiz}
                    className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>{quizIndex < KOSOADO_QUIZ_QUESTIONS.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Tela de Resultado do Quiz */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto text-2xl font-black">
                {score} / {KOSOADO_QUIZ_QUESTIONS.length}
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {score === KOSOADO_QUIZ_QUESTIONS.length
                  ? 'Incrível! Você dominou o Ko-So-A-Do!'
                  : score >= 4
                  ? 'Muito bem! Bom domínio espacial!'
                  : 'Vale a pena revisar o mapa espacial!'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Você acertou {score} de {KOSOADO_QUIZ_QUESTIONS.length} cenários práticos.
              </p>
              <button
                type="button"
                onClick={handleRestartQuiz}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-all shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Refazer Desafio</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
