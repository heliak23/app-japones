import React from 'react';
import type { ExerciseSessionSummary } from '../../types/exercise';
import { Trophy, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';

interface SessionSummaryViewProps {
  summary: ExerciseSessionSummary;
  onRetry: () => void;
  onChooseAnother: () => void;
  onReviewMistakes?: () => void;
}

export const SessionSummaryView: React.FC<SessionSummaryViewProps> = ({
  summary,
  onRetry,
  onChooseAnother,
  onReviewMistakes,
}) => {
  const percentage = summary.percentage;

  let badgeText = 'Continue Praticando!';
  let badgeColor = 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60';
  let message = 'Você está no caminho certo. Pratique mais para memorizar os caracteres.';

  if (percentage >= 90) {
    badgeText = 'Excelente! Quase Perfeito!';
    badgeColor = 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800/60';
    message = 'Parabéns! Sua retenção dos caracteres japoneses foi impressionante!';
  } else if (percentage >= 70) {
    badgeText = 'Muito Bom!';
    badgeColor = 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800/60';
    message = 'Ótimo desempenho! Apenas alguns detalhes para lapidar.';
  }

  const hasMistakes = summary.incorrectCount > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Card Principal de Conclusão */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-10 border border-slate-200/90 dark:border-slate-800 shadow-lg text-center space-y-6 transition-colors">
        
        <div className="w-20 h-20 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeColor} mb-2`}>
            <Sparkles className="w-3.5 h-3.5" />
            {badgeText}
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Sessão Concluída!
          </h2>
          <p className="text-slate-600 dark:text-slate-300 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Estatísticas Chave */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pontuação
            </span>
            <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{summary.score} pts</span>
          </div>

          <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/40">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Acertos
            </span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5" />
              {summary.correctCount}
            </span>
          </div>

          <div className="bg-rose-50/60 dark:bg-rose-950/30 p-4 rounded-2xl border border-rose-100 dark:border-rose-900/40">
            <span className="text-[11px] font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider block">
              Erros
            </span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400 flex items-center justify-center gap-1">
              <XCircle className="w-5 h-5" />
              {summary.incorrectCount}
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-[#0f172a] p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Aproveitamento
            </span>
            <span className="text-2xl font-black text-slate-900 dark:text-white">{summary.percentage}%</span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Tentar Novamente</span>
          </button>

          {hasMistakes && onReviewMistakes && (
            <button
              onClick={onReviewMistakes}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02]"
            >
              <XCircle className="w-4 h-4" />
              <span>Revisar Somente os Erros</span>
            </button>
          )}

          <button
            onClick={onChooseAnother}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 dark:bg-[#182238] hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-transparent dark:border-slate-700 font-bold text-sm transition-colors"
          >
            <span>Outro Exercício</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Relatório Detalhado das Respostas */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
          Gabarito da Sessão
        </h3>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {summary.results.map((res, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                {res.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">Questão #{i + 1}:</span>
                  <span className="text-slate-500 dark:text-slate-400 ml-2">Sua resposta: <strong>"{res.userAnswer}"</strong></span>
                </div>
              </div>

              <div>
                {!res.isCorrect && (
                  <span className="text-xs text-rose-600 dark:text-rose-300 font-bold bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800/60 px-2 py-0.5 rounded-full">
                    Correto: {res.correctAnswer}
                  </span>
                )}
                {res.isCorrect && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-300 font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 rounded-full">
                    +10 pts
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
