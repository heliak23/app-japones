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

  // Reseta estado local ao trocar de questão
  useEffect(() => {
    setTypedAnswer('');
    setSelectedOption(null);
    setHasAnswered(false);
    setIsCorrect(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id]);

  // Teclas de atalho para respostas e avanço
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (hasAnswered) {
        if (e.key === 'Enter') {
          e.preventDefault();
          onNextQuestion();
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
    if (hasAnswered || !typedAnswer.trim()) return;

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
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      
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
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6 transition-colors">
        
        {/* Enunciado e Prompt */}
        <div className="text-center space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {question.title}
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100">
            {question.prompt}
          </h2>
        </div>

        {/* Alvo Central (Caractere ou Palavra) */}
        <div className="text-center py-4 bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center relative transition-colors">
          <span className="font-jp text-6xl sm:text-7xl font-black text-slate-900 dark:text-slate-100 tracking-wide select-none">
            {question.displayTarget}
          </span>

          {/* Botão de Áudio */}
          <button
            onClick={() => onPlayAudio(question.displayTarget)}
            className={`mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white dark:bg-[#182238] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm ${
              isPlayingAudio ? 'animate-pulse text-brand-600 dark:text-brand-400' : ''
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400" />
            <span>Ouvir</span>
          </button>
        </div>

        {/* Área de Resposta: Múltipla Escolha */}
        {question.options && question.options.length > 0 && (
          <div className="grid grid-cols-2 gap-3 pt-2">
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
                  className={`p-4 rounded-2xl border text-base sm:text-lg font-bold transition-all flex items-center justify-between ${btnStyle}`}
                >
                  <span className="font-mono text-xs opacity-60 bg-black/10 dark:bg-white/10 px-2 py-0.5 rounded">
                    {idx + 1}
                  </span>
                  <span className="font-jp capitalize">{option}</span>
                  <span className="w-5" />
                </button>
              );
            })}
          </div>
        )}

        {/* Área de Resposta: Digitação */}
        {(!question.options || question.options.length === 0) && (
          <form onSubmit={handleTypeSubmit} className="space-y-4 pt-2">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                disabled={hasAnswered}
                value={typedAnswer}
                onChange={(e) => setTypedAnswer(e.target.value)}
                placeholder="Digite a romanização aqui (ex: ka, shi, a)..."
                className={`w-full px-5 py-4 rounded-2xl border text-lg font-bold text-center transition-colors focus:outline-none focus:ring-4 ${
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
                className="w-full py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-colors shadow-md shadow-indigo-950/20"
              >
                <span>Confirmar Resposta</span>
                <CornerDownLeft className="w-4 h-4" />
              </button>
            )}
          </form>
        )}

        {/* Banner de Feedback Imediato */}
        {hasAnswered && (
          <div
            className={`p-5 rounded-2xl border animate-fadeIn transition-colors ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 text-emerald-900 dark:text-emerald-100'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/80 text-rose-900 dark:text-rose-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                {isCorrect ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                )}
              </div>

              <div className="flex-1 space-y-1">
                <h4 className="font-extrabold text-base">
                  {isCorrect ? 'Excelente! Resposta correta!' : 'Quase lá! Resposta incorreta.'}
                </h4>
                
                {!isCorrect && (
                  <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">
                    A resposta correta esperada é:{' '}
                    <span className="font-mono text-sm underline font-bold uppercase">
                      {question.correctAnswer}
                    </span>
                  </p>
                )}

                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300 pt-1">
                  {question.explanation}
                </p>
              </div>
            </div>

            {/* Botão de Avanço */}
            <div className="mt-4 pt-3 border-t border-black/10 dark:border-white/10 flex justify-end">
              <button
                onClick={onNextQuestion}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <span>Próxima Pergunta</span>
                <ArrowRight className="w-4 h-4" />
                <kbd className="hidden sm:inline-block text-[10px] bg-white/20 dark:bg-white/10 px-1.5 py-0.5 rounded font-mono">
                  Enter
                </kbd>
              </button>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
