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
  let badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
  let message = 'Você está no caminho certo. Pratique mais para memorizar os caracteres.';

  if (percentage >= 90) {
    badgeText = 'Excelente! Quase Perfeito!';
    badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    message = 'Parabéns! Sua retenção dos caracteres japoneses foi impressionante!';
  } else if (percentage >= 70) {
    badgeText = 'Muito Bom!';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    message = 'Ótimo desempenho! Apenas alguns detalhes para lapidar.';
  }

  const hasMistakes = summary.incorrectCount > 0;

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16 animate-fadeIn">
      
      {/* Card Principal de Conclusão */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-lg text-center space-y-6">
        
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-500 mx-auto flex items-center justify-center shadow-inner">
          <Trophy className="w-10 h-10" />
        </div>

        <div>
          <span className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${badgeColor} mb-2`}>
            <Sparkles className="w-3.5 h-3.5" />
            {badgeText}
          </span>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Sessão Concluída!
          </h2>
          <p className="text-slate-600 text-sm max-w-md mx-auto mt-2 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Estatísticas Chave */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pontuação
            </span>
            <span className="text-2xl font-black text-indigo-600">{summary.score} pts</span>
          </div>

          <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              Acertos
            </span>
            <span className="text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-5 h-5" />
              {summary.correctCount}
            </span>
          </div>

          <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100">
            <span className="text-[11px] font-bold text-rose-700 uppercase tracking-wider block">
              Erros
            </span>
            <span className="text-2xl font-black text-rose-600 flex items-center justify-center gap-1">
              <XCircle className="w-5 h-5" />
              {summary.incorrectCount}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Aproveitamento
            </span>
            <span className="text-2xl font-black text-slate-900">{summary.percentage}%</span>
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
          >
            <span>Outro Exercício</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Relatório Detalhado das Respostas */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-extrabold text-base text-slate-900">
          Gabarito da Sessão
        </h3>

        <div className="divide-y divide-slate-100">
          {summary.results.map((res, i) => (
            <div key={i} className="py-3 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                {res.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                )}
                <div>
                  <span className="font-bold text-slate-800">Questão #{i + 1}:</span>
                  <span className="text-slate-500 ml-2">Sua resposta: <strong>"{res.userAnswer}"</strong></span>
                </div>
              </div>

              <div>
                {!res.isCorrect && (
                  <span className="text-xs text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-full">
                    Correto: {res.correctAnswer}
                  </span>
                )}
                {res.isCorrect && (
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
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

