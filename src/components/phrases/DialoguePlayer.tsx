import React, { useState, useEffect, useRef } from 'react';
import { DIALOGUES_DATA } from '../../data/dialogueData';
import type { DialogueItem } from '../../types/dialogue';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Eye,
  EyeOff,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const DialoguePlayer: React.FC = () => {
  const [selectedDialogue, setSelectedDialogue] = useState<DialogueItem>(DIALOGUES_DATA[0]);
  const [activeLineIndex, setActiveLineIndex] = useState<number | null>(null);
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [showRomaji, setShowRomaji] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [activeTab, setActiveTab] = useState<'dialogue' | 'quiz'>('dialogue');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const { playKana } = useAudio();
  const autoPlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Limpa o timer ao desmontar ou trocar de diálogo
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  const handlePlayLine = (index: number) => {
    setActiveLineIndex(index);
    const line = selectedDialogue.lines[index];
    if (line) {
      playKana(line.japanese);
    }
  };

  const handlePlayAll = () => {
    if (isPlayingAll) {
      // Pausar
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
      setIsPlayingAll(false);
      setActiveLineIndex(null);
      return;
    }

    setIsPlayingAll(true);
    let currentIdx = 0;

    const playNext = () => {
      if (currentIdx >= selectedDialogue.lines.length) {
        setIsPlayingAll(false);
        setActiveLineIndex(null);
        return;
      }

      setActiveLineIndex(currentIdx);
      const line = selectedDialogue.lines[currentIdx];
      playKana(line.japanese);

      // Estima o tempo da fala com base no tamanho da frase (mínimo 2.5s)
      const delay = Math.max(2500, line.japanese.length * 280);

      currentIdx++;
      autoPlayTimeoutRef.current = setTimeout(playNext, delay);
    };

    playNext();
  };

  const handleStopAll = () => {
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    setIsPlayingAll(false);
    setActiveLineIndex(null);
  };

  const handleSelectDialogue = (dialogue: DialogueItem) => {
    handleStopAll();
    setSelectedDialogue(dialogue);
    setActiveLineIndex(null);
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  // Quiz handlers
  const currentQuiz = selectedDialogue.comprehensionQuiz[quizIndex];

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
  };

  const handleConfirmQuizAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuiz.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < selectedDialogue.comprehensionQuiz.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header do Player de Diálogos */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
            <Sparkles className="w-3 h-3" />
            <span>Diálogos Reais da Apostila 2</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>{selectedDialogue.title}</span>
            <span className="font-jp text-lg text-slate-400 font-normal">
              {selectedDialogue.japaneseTitle}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            {selectedDialogue.description}
          </p>
        </div>

        {/* Seletor de Diálogos */}
        <div className="flex items-center gap-2 shrink-0">
          {DIALOGUES_DATA.map((d) => (
            <button
              key={d.id}
              onClick={() => handleSelectDialogue(d)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                selectedDialogue.id === d.id
                  ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                  : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
              }`}
            >
              {d.title}
            </button>
          ))}
        </div>
      </div>

      {/* Barra de Controles e Opções do Diálogo */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800">
        <div className="flex items-center gap-2">
          {/* Botão Auto-Play */}
          <button
            onClick={handlePlayAll}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold shadow-sm transition-all ${
              isPlayingAll
                ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                : 'bg-rose-600 hover:bg-rose-500 text-white'
            }`}
          >
            {isPlayingAll ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlayingAll ? 'Pausar Reprodução' : 'Ouvir Conversa Completa'}</span>
          </button>

          {isPlayingAll && (
            <button
              onClick={handleStopAll}
              className="p-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-rose-600"
              title="Parar"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Toggles de Exibição (Listening Mode) & Modo Quiz */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRomaji(!showRomaji)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              showRomaji
                ? 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                : 'bg-slate-200 dark:bg-slate-800 border-transparent text-slate-500'
            }`}
            title="Alternar visibilidade do Romaji"
          >
            {showRomaji ? <Eye className="w-3.5 h-3.5 text-rose-500" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Romaji</span>
          </button>

          <button
            onClick={() => setShowTranslation(!showTranslation)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
              showTranslation
                ? 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                : 'bg-slate-200 dark:bg-slate-800 border-transparent text-slate-500'
            }`}
            title="Alternar visibilidade da Tradução"
          >
            {showTranslation ? <Eye className="w-3.5 h-3.5 text-rose-500" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Tradução</span>
          </button>

          <button
            onClick={() => setActiveTab(activeTab === 'dialogue' ? 'quiz' : 'dialogue')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
              activeTab === 'quiz'
                ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz de Compreensão</span>
          </button>
        </div>
      </div>

      {activeTab === 'dialogue' ? (
        /* CHAT INTERATIVO DE FALAS */
        <div className="space-y-4 max-w-3xl mx-auto py-2">
          {selectedDialogue.lines.map((line, idx) => {
            const char = selectedDialogue.characters.find((c) => c.id === line.characterId);
            const isSakura = line.characterId === 'sakura';
            const isActive = activeLineIndex === idx;

            return (
              <div
                key={line.id}
                className={`flex items-start gap-3 transition-all ${
                  isSakura ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                {/* Avatar do Personagem */}
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0 border shadow-sm ${
                    isSakura
                      ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800/60'
                      : 'bg-sky-50 dark:bg-sky-950/50 border-sky-200 dark:border-sky-800/60'
                  }`}
                  title={char?.name}
                >
                  {char?.avatar || '👤'}
                </div>

                {/* Balão de Fala */}
                <div
                  className={`relative max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 border transition-all ${
                    isActive
                      ? 'ring-2 ring-rose-500 shadow-md scale-[1.01]'
                      : 'shadow-sm'
                  } ${
                    isSakura
                      ? 'bg-white dark:bg-[#131b2e] border-rose-100 dark:border-rose-950/80 rounded-tl-sm'
                      : 'bg-sky-50/50 dark:bg-[#0e1726] border-sky-100 dark:border-sky-950/80 rounded-tr-sm'
                  }`}
                >
                  {/* Nome do Personagem */}
                  <div className="flex items-center justify-between gap-2 pb-1.5 mb-1.5 border-b border-slate-100 dark:border-slate-800/60">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {char?.name} ({char?.japaneseName})
                    </span>
                    <button
                      onClick={() => handlePlayLine(idx)}
                      className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                      title="Ouvir esta fala"
                    >
                      <Volume2 className={`w-4 h-4 ${isActive ? 'text-rose-600 animate-bounce' : ''}`} />
                    </button>
                  </div>

                  {/* Texto em Japonês */}
                  <p className="font-jp text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-relaxed">
                    {line.japanese}
                  </p>

                  {/* Romaji (Toggleable) */}
                  {showRomaji && (
                    <p className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 mt-1">
                      {line.romaji}
                    </p>
                  )}

                  {/* Tradução PT-BR (Toggleable) */}
                  {showTranslation && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {line.translation}
                    </p>
                  )}

                  {/* Nota Cultural / Pedagógica da Apostila */}
                  {line.notes && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-amber-800 dark:text-amber-300/90 bg-amber-50/60 dark:bg-amber-950/20 p-2 rounded-xl">
                      <strong>💡 Nota: </strong>
                      <span>{line.notes}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* QUIZ DE COMPREENSÃO DO DIÁLOGO */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-6">
          {!quizFinished && currentQuiz ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                  Questão {quizIndex + 1} de {selectedDialogue.comprehensionQuiz.length}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Acertos: {score}
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  {currentQuiz.question}
                </h4>
              </div>

              {/* Opções */}
              <div className="space-y-2.5">
                {currentQuiz.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  let btnColor = 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-rose-300';

                  if (isAnswerSubmitted) {
                    if (opt === currentQuiz.correctAnswer) {
                      btnColor = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                    } else if (isSelected) {
                      btnColor = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                    }
                  } else if (isSelected) {
                    btnColor = 'bg-rose-50 dark:bg-rose-950/40 border-rose-600 text-rose-700 dark:text-rose-300 font-bold ring-2 ring-rose-500/20';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswerSubmitted}
                      className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm transition-all ${btnColor}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Feedback */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    selectedOption === currentQuiz.correctAnswer
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {selectedOption === currentQuiz.correctAnswer ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  )}
                  <p className="text-xs sm:text-sm">
                    <strong>{selectedOption === currentQuiz.correctAnswer ? 'Correto! ' : 'Ops: '}</strong>
                    {currentQuiz.explanation}
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleConfirmQuizAnswer}
                    disabled={!selectedOption}
                    className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    <span>
                      {quizIndex < selectedDialogue.comprehensionQuiz.length - 1
                        ? 'Próxima Questão'
                        : 'Ver Resultado'}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Conclusão do Quiz */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Quiz de Diálogo Concluído!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Você acertou <strong className="text-rose-600 font-black">{score}</strong> de{' '}
                <strong>{selectedDialogue.comprehensionQuiz.length}</strong> questões.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setQuizIndex(0);
                    setSelectedOption(null);
                    setIsAnswerSubmitted(false);
                    setScore(0);
                    setQuizFinished(false);
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
