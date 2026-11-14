import React, { useState, useEffect, useRef } from 'react';
import type { ExerciseQuestion, UserAnswerResult } from '../../types/exercise';
import { ProgressBar } from '../common/ProgressBar';
import { Volume2, CheckCircle2, XCircle, ArrowRight, CornerDownLeft } from 'lucide-react';
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

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  };

  const handleNext = () => {
    if (isAdvancingRef.current) return;
    isAdvancingRef.current = true;
    onNextQuestion();
  };

  // Mantém e seleciona o input sempre focado ao entrar ou mudar de questão
  useEffect(() => {
    isAdvancingRef.current = false;
    setTypedAnswer('');
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);

    focusInput();
    const rafId = requestAnimationFrame(focusInput);
    const timer = setTimeout(focusInput, 50);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
    };
  }, [question.id]);

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
    if (hasAnswered) return;
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
  };

  const handleTypeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAnswered) {
      handleNext();
      return;
    }
    if (!typedAnswer.trim()) return;

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
          <div className="grid grid-cols-2 gap-2 sm:gap-3 pt-1">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === option;
              let btnStyle = 'bg-slate-50 dark:bg-[#182238] hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700';

              if (hasAnswered) {
                if (option.toLowerCase() === question.correctAnswer.toLowerCase()) {
                  btnStyle = 'bg-emerald-500 text-white border-emerald-600 shadow-md';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'bg-rose-500 text-white border-rose-600 shadow-md';
                } else {
                  btnStyle = 'bg-slate-100 dark:bg-slate-800/80 text-slate-400 dark:text-slate-600 border-slate-200 dark:border-slate-800 opacity-60';
                }
              }

              return (
                <button
                  key={option}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelectOption(option)}
                  className={`py-2.5 sm:py-3.5 px-3 sm:px-4 rounded-xl sm:rounded-2xl border text-sm sm:text-base font-bold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="font-mono text-xs opacity-60 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded">
                    {idx + 1}
                  </span>
                  <span className="font-jp capitalize">{option}</span>
                  <span className="w-4 sm:w-5" />
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
                readOnly={hasAnswered}
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
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
                className="w-full py-3 rounded-xl sm:rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-950/20"
              >
                <span>Confirmar Resposta</span>
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </form>
        )}

        {/* Bloco de Ação Rápida & Feedback Imediato */}
        {hasAnswered && (
          <div className="space-y-2.5 animate-fadeIn">
            {/* Botão de Avanço Rápido - Posicionado MAIS PARA CIMA para dinamismo imediato sem scroll */}
            <button
              type="button"
              onClick={handleNext}
              className={`w-full py-3.5 px-4 rounded-xl sm:rounded-2xl font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer ${
                isCorrect
                  ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/20'
                  : 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white shadow-slate-950/20'
              }`}
            >
              <span>Próxima Pergunta</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
              <kbd className="hidden sm:inline-block text-[10px] bg-white/20 dark:bg-white/10 px-2 py-0.5 rounded font-mono ml-2">
                Enter ↵
              </kbd>
            </button>

            {/* Banner de Feedback e Explicação */}
            <div
              className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl border text-xs transition-colors ${
                isCorrect
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                  : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
              }`}
            >
              <div className="flex items-start gap-2.5">
                <div className="shrink-0 mt-0.5">
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                </div>

                <div className="flex-1 space-y-1 min-w-0">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <span className="font-extrabold text-xs sm:text-sm">
                      {isCorrect ? 'Excelente! Resposta correta!' : 'Quase lá! Resposta incorreta.'}
                    </span>
                    {!isCorrect && (
                      <span className="font-semibold text-rose-700 dark:text-rose-300">
                        Esperado:{' '}
                        <span className="font-mono text-xs sm:text-sm font-black underline uppercase">
                          {question.correctAnswer}
                        </span>
                      </span>
                    )}
                  </div>

                  {question.explanation && (
                    <p className="text-[11px] sm:text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                      {question.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
