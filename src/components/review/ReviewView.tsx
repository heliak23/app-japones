import React from 'react';
import type { UserLearningState } from '../../types/progress';
import { KanaDataset } from '../../data/kanaDataset';
import { useAudio } from '../../hooks/useAudio';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Check,
  Volume2,
  VolumeX,
  Play,
  Calendar,
  Layers,
} from 'lucide-react';

interface ReviewViewProps {
  learningState: UserLearningState;
  onStartReviewSession: (characterIds: string[]) => void;
  onStartStudiedSession: (characterIds: string[]) => void;
  onDismissReview?: (characterId: string) => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  learningState,
  onStartReviewSession,
  onStartStudiedSession,
  onDismissReview,
}) => {
  const { playKana, isPlaying, currentText } = useAudio();

  // Coleta os caracteres com estatísticas registradas
  const characterStatsList = Object.values(learningState.characterStats);

  // Caracteres com pendência de revisão (erros recentes não superados)
  const difficultStats = characterStatsList
    .filter((stat) => stat.needsReview)
    .sort((a, b) => {
      // Prioriza caracteres com mais erros absolutos e menor taxa de acerto
      const rateA = a.correct / (a.attempts || 1);
      const rateB = b.correct / (b.attempts || 1);
      if (rateA !== rateB) return rateA - rateB;
      return b.incorrect - a.incorrect;
    });

  const difficultCharIds = difficultStats.map((s) => s.characterId);

  // Caracteres já estudados
  const studiedCharIds = learningState.studiedCharacterIds;

  // Histórico de sessões
  const history = learningState.history;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner Principal da Revisão */}
      <section className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 mb-2">
              <RotateCcw className="w-3.5 h-3.5" />
              Sistema de Fixação e Dificuldades
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Revisão Inteligente
            </h1>
            <p className="text-slate-600 dark:text-slate-300 text-sm max-w-xl mt-1">
              Reforce os caracteres onde você errou nos testes. Assim que você praticar e acertar, eles saem automaticamente da fila de revisão!
            </p>
          </div>

          {/* Ações Rápidas de Estudo */}
          <div className="flex flex-wrap gap-2.5 self-start sm:self-auto">
            {difficultCharIds.length > 0 ? (
              <button
                onClick={() => onStartReviewSession(difficultCharIds)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950/20 transition-all hover:scale-[1.02]"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Praticar Erros ({difficultCharIds.length})</span>
              </button>
            ) : null}

            {studiedCharIds.length > 0 ? (
              <button
                onClick={() => onStartStudiedSession(studiedCharIds)}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all hover:scale-[1.02]"
              >
                <Layers className="w-4 h-4" />
                <span>Revisar Estudados ({studiedCharIds.length})</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Diagnóstico de Caracteres com Dificuldade */}
      <section className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Erros Pendentes de Revisão
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Caracteres com erros recentes (ao praticar e acertar, eles saem automaticamente da lista)
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60">
            {difficultStats.length} pendentes
          </span>
        </div>

        {difficultStats.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 dark:bg-[#0f172a] rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-2 transition-colors">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 dark:text-slate-200 text-base">Tudo em dia!</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              Você não possui erros pendentes de revisão. Se errar alguma questão nos exercícios, ela aparecerá aqui para você praticar.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {difficultStats.map((stat) => {
              const char = KanaDataset.getById(stat.characterId);
              if (!char) return null;

              const total = stat.attempts || 1;
              const accuracy = Math.round((stat.correct / total) * 100);
              const isHira = char.alphabet === 'hiragana';

              return (
                <div
                  key={stat.characterId}
                  className="p-4 rounded-2xl bg-white dark:bg-[#182238] border border-rose-200/80 dark:border-rose-900/60 hover:border-rose-400 dark:hover:border-rose-500 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-[#0f172a] flex items-center justify-center font-jp text-3xl font-black text-slate-900 dark:text-slate-100 group-hover:scale-105 transition-transform">
                      {char.character}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">
                          {char.romaji}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            isHira ? 'bg-rose-50 dark:bg-rose-950/60 text-brand-700 dark:text-brand-300' : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300'
                          }`}
                        >
                          {isHira ? 'Hira' : 'Kata'}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-600 dark:text-rose-400 font-semibold mt-0.5">
                        {stat.incorrect} erro(s) em {stat.attempts} testes ({accuracy}% acerto)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    {onDismissReview && (
                      <button
                        onClick={() => onDismissReview(stat.characterId)}
                        className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                        title="Marcar como superado (remover da fila de erros)"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => playKana(char.character)}
                      className="p-2 rounded-xl text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Ouvir som"
                    >
                      {isPlaying && currentText === char.character ? (
                        <VolumeX className="w-4 h-4 text-brand-600 dark:text-brand-400 animate-pulse" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Histórico Recente de Sessões de Exercícios */}
      <section className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Histórico de Exercícios Salvos</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Últimas sessões concluídas no seu dispositivo</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {history.length} sessões registradas
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            Nenhuma sessão de exercícios concluída até o momento.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-96 overflow-y-auto">
            {history.map((item, idx) => {
              const date = new Date(item.completedAt);
              const formattedDate = date.toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              const isGood = item.percentage >= 70;

              return (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                        isGood
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800/50'
                          : 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200/50 dark:border-rose-800/50'
                      }`}
                    >
                      {item.percentage}%
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                        {item.exerciseType === 'recognition' && '1. Reconhecimento de Caracteres'}
                        {item.exerciseType === 'typing' && '2. Exercício de Digitação'}
                        {item.exerciseType === 'conversion' && '3. Conversão Romaji ➔ Kana'}
                        {item.exerciseType === 'alphabet_id' && '4. Identificação do Alfabeto'}
                        {item.exerciseType === 'review_random' && '5. Revisão Geral Aleatória'}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 sm:self-auto self-end">
                    <span>
                      <strong className="text-emerald-600 dark:text-emerald-400">{item.correctCount}</strong> acertos /{' '}
                      <strong className="text-rose-600 dark:text-rose-400">{item.incorrectCount}</strong> erros
                    </span>
                    <span className="font-extrabold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-800 border border-transparent dark:border-slate-700/60 px-2.5 py-1 rounded-full">
                      +{item.score} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </div>
  );
};
