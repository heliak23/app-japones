import React, { useState, useEffect, useRef } from 'react';
import type { ExerciseQuestion, UserAnswerResult } from '../../types/exercise';
import { ProgressBar } from '../common/ProgressBar';
import { Volume2, CheckCircle2, XCircle, CornerDownLeft } from 'lucide-react';
import { WanakanaService } from '../../services/wanakanaService';

interface QuestionViewProps {
  question: ExerciseQuestion;
  currentIndex: number;
  totalQuestions: number;
  currentScore: number;
  onAnswer: (result: UserAnswerResult) => void;
  onNextQuestion: () => void;
  onPlayAudio: (text: string) => void;
  isPlayingAudio?: boolean;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  currentIndex,
  totalQuestions,
  currentScore,
  onAnswer,
  onNextQuestion,
  onPlayAudio,
  isPlayingAudio = false,
}) => {
  const [typedAnswer, setTypedAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAdvancingRef = useRef(false);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const handleNext = () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    const isTyping = !question.options || question.options.length === 0;
    if (!isTyping && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    onNextQuestion();
  };

  // Mantém e seleciona o input sempre focado ao entrar ou mudar de questão
  useEffect(() => {
    isAdvancingRef.current = false;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
    setTypedAnswer('');
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);

    const isTyping = !question.options || question.options.length === 0;

    if (!isTyping) {
      // Garante que nenhum elemento anterior retenha foco em telas touch
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
    } else {
      // No modo digitação, garante foco contínuo para manter o teclado aberto no celular
      focusInput();
      const rafId = requestAnimationFrame(focusInput);
      const timer = setTimeout(focusInput, 30);

      return () => {
        cancelAnimationFrame(rafId);
        clearTimeout(timer);
        if (autoAdvanceTimerRef.current) {
          clearTimeout(autoAdvanceTimerRef.current);
          autoAdvanceTimerRef.current = null;
        }
      };
    }

    return () => {
      if (autoAdvanceTimerRef.current) {
        clearTimeout(autoAdvanceTimerRef.current);
        autoAdvanceTimerRef.current = null;
      }
    };
  }, [question.id, currentIndex]);

  // Teclas de atalho para respostas e avanço
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAnswered) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleNext();
        }
        return;
      }

      // Atalhos numéricos para múltipla escolha (1, 2, 3, 4)
      if (question.options && question.options.length > 0) {
        const keyNum = parseInt(e.key, 10);
        if (keyNum >= 1 && keyNum <= question.options.length) {
          e.preventDefault();
          handleSelectOption(question.options[keyNum - 1]);
        }
      } else {
        // Para digitação: se a tecla for uma letra e o input estiver desfocado, refoca imediatamente
        if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
          if (document.activeElement !== inputRef.current) {
            inputRef.current?.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasAnswered, question, onNextQuestion]);

  const evaluateAnswer = (userAnswer: string): boolean => {
    if (question.type === 'typing') {
      return WanakanaService.validateRomajiAnswer(
        userAnswer,
        question.correctAnswer,
        question.acceptableAnswers
      );
    }

    if (question.type === 'conversion' && !question.options) {
      return WanakanaService.validateKanaAnswer(
        userAnswer,
        question.correctAnswer,
        question.targetAlphabet || 'hiragana'
      );
    }

    // Múltipla escolha padrão
    return userAnswer.trim().toLowerCase() === question.correctAnswer.trim().toLowerCase();
  };

  const handleSelectOption = (option: string) => {
    if (hasAnswered || isAdvancingRef.current) return;
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedOption(option);
    const correct = evaluateAnswer(option);
    setIsCorrect(correct);
    setHasAnswered(true);

    onAnswer({
      questionId: question.id,
      userAnswer: option,
      isCorrect: correct,
      correctAnswer: question.correctAnswer,
      characterId: question.characterInfo?.id,
    });

    // Avanço automático dinâmico:
    // - Se acertou: 450ms para ver o verde e avançar com fluidez
    // - Se errou: 750ms para visualizar a opção vermelha e a resposta correta em verde
    const delay = correct ? 450 : 750;
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, delay);
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnswered) {
      handleNext();
      return;
    }
    if (!typedAnswer.trim()) return;

    // Mantém o input focado no evento síncrono do usuário para preservar o teclado mobile
    inputRef.current?.focus();

    const correct = evaluateAnswer(typedAnswer);
    setIsCorrect(correct);
    setHasAnswered(true);

    onAnswer({
      questionId: question.id,
      userAnswer: typedAnswer,
      isCorrect: correct,
      correctAnswer: question.correctAnswer,
      characterId: question.characterInfo?.id,
    });

    // Avanço automático também para digitação
    const delay = correct ? 450 : 800;
    autoAdvanceTimerRef.current = setTimeout(() => {
      handleNext();
    }, delay);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-3 sm:space-y-6 pb-6 sm:pb-12">
      
      {/* Topo: Progresso e Pontuação */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
        <span className="uppercase tracking-wider">
          Questão {currentIndex + 1} de {totalQuestions}
        </span>
        <div className="flex items-center gap-2">
          <span className="bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full border border-indigo-200 dark:border-indigo-800/60">
            {currentScore} pts
          </span>
        </div>
      </div>

      <ProgressBar current={currentIndex + 1} total={totalQuestions} color="indigo" size="sm" showPercentage={false} />

      {/* Card da Pergunta */}
      <div 
        onClick={(e) => {
          if (!hasAnswered && (!question.options || question.options.length === 0)) {
            const target = e.target as HTMLElement;
            if (!target.closest('button')) {
              focusInput();
            }
          }
        }}
        className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-4 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-md space-y-3 sm:space-y-5 transition-colors"
      >
        
        {/* Enunciado e Prompt */}
        <div className="text-center space-y-0.5">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {question.title}
          </span>
          <h2 className="text-sm sm:text-lg font-bold text-slate-800 dark:text-slate-100">
            {question.prompt}
          </h2>
        </div>

        {/* Alvo Central (Caractere ou Palavra) */}
        <div className="text-center py-2 sm:py-3.5 bg-slate-50 dark:bg-[#0f172a] rounded-xl sm:rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative transition-colors">
          <span className="font-jp text-5xl sm:text-6xl font-black text-slate-900 dark:text-slate-100 tracking-wide select-none">
            {question.displayTarget}
          </span>

          {/* Botão de Áudio */}
          <button
            onClick={() => {
              onPlayAudio(question.displayTarget);
              setTimeout(focusInput, 50);
            }}
            className={`mt-1.5 sm:mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-white dark:bg-[#182238] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm ${
              isPlayingAudio ? 'animate-pulse text-brand-600 dark:text-brand-400' : ''
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Ouvir</span>
          </button>
        </div>

        {/* Área de Resposta: Múltipla Escolha */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 pt-1">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              const isCorrectOption = option.toLowerCase() === question.correctAnswer.toLowerCase();
              let btnStyle = 'bg-slate-50 dark:bg-[#182238] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 active:scale-[0.99] cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500';

              if (hasAnswered) {
                if (isCorrectOption) {
                  // Mantém a cor verde se o usuário apertar a opção certa (ou indica qual era a certa se errou)
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-300 dark:ring-emerald-500/50 scale-[1.02] font-black focus:outline-none';
                } else if (isSelected && !isCorrect) {
                  // Se o usuário errar, mantém a cor vermelha na opção clicada
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-lg shadow-rose-500/25 ring-2 ring-rose-300 dark:ring-rose-500/50 scale-[1.02] font-black focus:outline-none';
                } else {
                  btnStyle = 'bg-slate-100 dark:bg-slate-800/60 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-40 cursor-default focus:outline-none';
                }
              }

              return (
                <button
                  key={`${question.id}-${idx}-${option}`}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`py-3 sm:py-4 px-3 sm:px-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                >
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${
                    hasAnswered && (isCorrectOption || (isSelected && !isCorrect))
                      ? 'bg-black/20 text-white'
                      : 'opacity-60 bg-black/10 dark:bg-white/10'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-jp capitalize text-base sm:text-lg">{option}</span>
                  <span className="w-4 sm:w-5 flex items-center justify-center">
                    {hasAnswered && isCorrectOption && (
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    )}
                    {hasAnswered && isSelected && !isCorrect && (
                      <XCircle className="w-4 h-4 text-white" />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Área de Resposta: Digitação */}
        {(!question.options || question.options.length === 0) && (
          <form onSubmit={handleTypeSubmit} className="space-y-3 pt-1">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                autoFocus
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                inputMode="text"
                value={typedAnswer}
                onChange={(e) => {
                  if (hasAnswered) return;
                  setTypedAnswer(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (hasAnswered) {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleNext();
                    } else {
                      e.preventDefault();
                    }
                  }
                }}
                placeholder="Digite a romanização (ex: ka, shi)..."
                className={`w-full px-4 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl border text-base sm:text-lg font-bold text-center transition-colors focus:outline-none focus:ring-4 ${
                  hasAnswered
                    ? isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-100 ring-emerald-200 dark:ring-emerald-900/40'
                      : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-100 ring-rose-200 dark:ring-rose-900/40'
                    : 'bg-white dark:bg-[#0f172a] border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:border-indigo-500 dark:focus:border-indigo-400 ring-indigo-100 dark:ring-indigo-950/40'
                }`}
              />
            </div>

            {!hasAnswered && (
              <button
                type="submit"
                disabled={!typedAnswer.trim()}
                onMouseDown={(e) => e.preventDefault()}
                onTouchStart={() => inputRef.current?.focus()}
                className="w-full py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-950/20 cursor-pointer"
              >
                <span>Confirmar Resposta</span>
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </form>
        )}

        {/* Feedback visual sutil enquanto avança automaticamente */}
        {hasAnswered && (
          <div className="pt-1 animate-fadeIn">
            {isCorrect ? (
              <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-xs flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Correto!
                </span>
                <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Avançando...</span>
              </div>
            ) : (
              <div className="p-2.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 text-xs flex items-center justify-between">
                <span className="font-semibold flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  Correto seria: <strong className="font-mono text-sm underline uppercase ml-1">{question.correctAnswer}</strong>
                </span>
                <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Avançando...</span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};