import React, { useState } from 'react';
import type { PhraseLesson } from '../../types/phrase';
import { PhraseStorageService } from '../../services/phraseStorageService';
import {
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

interface PhraseQuizViewerProps {
  lesson: PhraseLesson;
  onLessonCompleted: () => void;
  onBackToSteps: () => void;
}

export const PhraseQuizViewer: React.FC<PhraseQuizViewerProps> = ({
  lesson,
  onLessonCompleted,
  onBackToSteps,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = lesson.quiz;
  const currentQuestion = questions[currentQuestionIndex];

  // ==========================
  // Resposta: Múltipla Escolha / Gap
  // ==========================
  const handleSelectOption = (optionId: string, correct: boolean) => {
    if (isAnswered) return;
    setSelectedOptionId(optionId);
    setIsAnswered(true);
    setIsCorrect(correct);
    if (correct) {
      setScore((prev) => prev + 1);
    }
  };

  // ==========================
  // Resposta: Ordenação de Blocos
  // ==========================
  const handleToggleBlock = (block: string) => {
    if (isAnswered) return;
    if (selectedBlocks.includes(block)) {
      setSelectedBlocks(selectedBlocks.filter((b) => b !== block));
    } else {
      setSelectedBlocks([...selectedBlocks, block]);
    }
  };

  const handleCheckOrderBlocks = () => {
    if (isAnswered || !currentQuestion.correctBlockOrder) return;
    const isOrderCorrect =
      selectedBlocks.length === currentQuestion.correctBlockOrder.length &&
      selectedBlocks.every((val, index) => val === currentQuestion.correctBlockOrder![index]);

    setIsAnswered(true);
    setIsCorrect(isOrderCorrect);
    if (isOrderCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  // ==========================
  // Avançar Questão / Concluir
  // ==========================
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOptionId(null);
      setSelectedBlocks([]);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Salva resultado no storage
      PhraseStorageService.recordQuizResult(lesson.id, score + (isCorrect ? 0 : 0), questions.length);
      setIsFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setSelectedBlocks([]);
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setIsFinished(false);
  };

  // ==========================
  // Tela de Conclusão / Resultado
  // ==========================
  if (isFinished) {
    const passed = score >= Math.ceil(questions.length * 0.7);

    return (
      <div className="max-w-2xl mx-auto bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-brand-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {passed ? 'Excelente Progresso! 🎉' : 'Bom treino! Que tal revisar?'}
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
            Você acertou <strong>{score}</strong> de <strong>{questions.length}</strong> desafios da lição "{lesson.title}".
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
          <strong>Regra Chave da Lição:</strong>
          <p className="mt-1 font-jp font-semibold text-brand-600 dark:text-brand-400">
            {lesson.keyRule}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={handleRestartQuiz}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>

          <button
            onClick={onLessonCompleted}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Concluir Lição e Voltar</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between bg-white dark:bg-[#131b2e] p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          onClick={onBackToSteps}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para a Explicação</span>
        </button>

        <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
          Desafio {currentQuestionIndex + 1} de {questions.length}
        </span>
      </div>

      {/* Card da Pergunta */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-lg space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Desafio de Fixação</span>
          </div>

          <h3 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white">
            {currentQuestion.prompt}
          </h3>
        </div>

        {/* Frase de Contexto (se houver, ex: lacuna) */}
        {currentQuestion.contextJapanese && (
          <div className="py-4 px-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-center">
            <span className="font-jp text-2xl sm:text-4xl font-extrabold text-brand-600 dark:text-brand-400 tracking-wider">
              {currentQuestion.contextJapanese}
            </span>
          </div>
        )}

        {/* Modalidade 1 & 3: Múltipla Escolha / Gap */}
        {currentQuestion.options && (
          <div className="grid grid-cols-1 gap-3 pt-2">
            {currentQuestion.options.map((opt) => {
              const isSelected = selectedOptionId === opt.id;
              let styleClass =
                'bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100';

              if (isAnswered) {
                if (opt.isCorrect) {
                  styleClass = 'bg-emerald-500/15 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                } else if (isSelected) {
                  styleClass = 'bg-rose-500/15 border-rose-500 text-rose-700 dark:text-rose-300 font-bold';
                } else {
                  styleClass = 'opacity-40 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={opt.id}
                  onClick={() => handleSelectOption(opt.id, opt.isCorrect)}
                  disabled={isAnswered}
                  className={`w-full p-4 rounded-2xl border text-left font-medium text-sm sm:text-base flex items-center justify-between gap-3 transition-all ${styleClass}`}
                >
                  <span className="font-jp">{opt.text}</span>
                  {isAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                  {isAnswered && isSelected && !opt.isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                </button>
              );
            })}
          </div>
        )}

        {/* Modalidade 2: Ordenação de Blocos (Montador de Frase SOV) */}
        {currentQuestion.type === 'order_blocks' && currentQuestion.blocks && (
          <div className="space-y-4 pt-2">
            {/* Área onde a frase está sendo montada */}
            <div className="min-h-[64px] p-4 rounded-2xl bg-brand-500/5 dark:bg-brand-950/20 border-2 border-dashed border-brand-200 dark:border-brand-800/50 flex flex-wrap items-center gap-2">
              {selectedBlocks.length === 0 ? (
                <span className="text-xs text-slate-400 italic">
                  Toque nos blocos abaixo na ordem correta...
                </span>
              ) : (
                selectedBlocks.map((block, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleToggleBlock(block)}
                    disabled={isAnswered}
                    className="font-jp px-3.5 py-2 rounded-xl bg-brand-600 text-white font-bold text-base shadow-sm hover:bg-brand-700 transition-colors"
                  >
                    {block}
                  </button>
                ))
              )}
            </div>

            {/* Banco de blocos disponíveis */}
            <div className="flex flex-wrap gap-2 pt-2">
              {currentQuestion.blocks.map((block, idx) => {
                const isUsed = selectedBlocks.includes(block);
                return (
                  <button
                    key={idx}
                    onClick={() => handleToggleBlock(block)}
                    disabled={isUsed || isAnswered}
                    className={`font-jp px-4 py-2.5 rounded-2xl border font-bold text-base transition-all ${
                      isUsed
                        ? 'opacity-30 border-slate-200 dark:border-slate-800 cursor-not-allowed bg-slate-100 dark:bg-slate-800 text-slate-400'
                        : 'bg-white dark:bg-[#131b2e] border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-brand-500 shadow-sm active:scale-95'
                    }`}
                  >
                    {block}
                  </button>
                );
              })}
            </div>

            {!isAnswered && (
              <button
                onClick={handleCheckOrderBlocks}
                disabled={selectedBlocks.length === 0}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm shadow transition-all"
              >
                Verificar Ordem
              </button>
            )}
          </div>
        )}

        {/* Feedback e Explicação Pós-Resposta */}
        {isAnswered && (
          <div
            className={`p-4 sm:p-5 rounded-2xl border text-left space-y-2 animate-fadeIn ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/50 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-sm">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Exatamente isso! Resposta Correta!</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Ops! Não foi dessa vez.</span>
                </>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {currentQuestion.explanation}
            </p>

            <button
              onClick={handleNextQuestion}
              className="mt-3 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow hover:opacity-90 transition-opacity"
            >
              <span>{currentQuestionIndex < questions.length - 1 ? 'Próxima Pergunta' : 'Ver Resultado'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
