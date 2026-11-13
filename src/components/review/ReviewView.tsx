import React from 'react';
import type { UserLearningState } from '../../types/progress';
import { KanaDataset } from '../../data/kanaDataset';
import { useAudio } from '../../hooks/useAudio';
import {
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
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
}

export const ReviewView: React.FC<ReviewViewProps> = ({
  learningState,
  onStartReviewSession,
  onStartStudiedSession,
}) => {
  const { playKana, isPlaying, currentText } = useAudio();

  // Coleta os caracteres com estatísticas registradas
  const characterStatsList = Object.values(learningState.characterStats);

  // Caracteres com dificuldade (marcados para revisão ou com erro >= 40%)
  const difficultStats = characterStatsList
    .filter((stat) => stat.incorrect > 0)
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
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-50 text-rose-700 border border-rose-200 mb-2">
              <RotateCcw className="w-3.5 h-3.5" />
              Sistema de Fixação e Dificuldades
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Revisão Inteligente
            </h1>
            <p className="text-slate-600 text-sm max-w-xl mt-1">
              Reforce os caracteres onde você teve mais erros nos testes e consolide a memória de longo prazo.
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
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all hover:scale-[1.02]"
              >
                <Layers className="w-4 h-4" />
                <span>Revisar Estudados ({studiedCharIds.length})</span>
              </button>
            ) : null}
          </div>
        </div>
      </section>

      {/* Diagnóstico de Caracteres com Dificuldade */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Caracteres que Precisam de Reforço
              </h2>
              <p className="text-xs text-slate-500">
                Ranqueados automaticamente com base na frequência de erros
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
            {difficultStats.length} encontrados
          </span>
        </div>

        {difficultStats.length === 0 ? (
          <div className="py-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">Tudo em dia!</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Você ainda não registrou erros nos exercícios ou acertou todos os caracteres recentemente.
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
                  className="p-4 rounded-2xl bg-white border border-rose-200/80 hover:border-rose-400 hover:shadow-md transition-all flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center font-jp text-3xl font-black text-slate-900 group-hover:scale-105 transition-transform">
                      {char.character}
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-slate-900 uppercase">
                          {char.romaji}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            isHira ? 'bg-rose-50 text-brand-700' : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {isHira ? 'Hira' : 'Kata'}
                        </span>
                      </div>
                      <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                        {stat.incorrect} erro(s) em {stat.attempts} testes ({accuracy}% acerto)
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => playKana(char.character)}
                    className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                    title="Ouvir som"
                  >
                    {isPlaying && currentText === char.character ? (
                      <VolumeX className="w-4 h-4 text-brand-600 animate-pulse" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Histórico Recente de Sessões de Exercícios */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Histórico de Exercícios Salvos</h2>
              <p className="text-xs text-slate-500">Últimas sessões concluídas no seu dispositivo</p>
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {history.length} sessões registradas
          </span>
        </div>

        {history.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            Nenhuma sessão de exercícios concluída até o momento.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto">
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
                        isGood ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {item.percentage}%
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 capitalize">
                        {item.exerciseType === 'recognition' && '1. Reconhecimento de Caracteres'}
                        {item.exerciseType === 'typing' && '2. Exercício de Digitação'}
                        {item.exerciseType === 'conversion' && '3. Conversão Romaji ➔ Kana'}
                        {item.exerciseType === 'alphabet_id' && '4. Identificação do Alfabeto'}
                        {item.exerciseType === 'review_random' && '5. Revisão Geral Aleatória'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">{formattedDate}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-slate-600 sm:self-auto self-end">
                    <span>
                      <strong className="text-emerald-600">{item.correctCount}</strong> acertos /{' '}
                      <strong className="text-rose-600">{item.incorrectCount}</strong> erros
                    </span>
                    <span className="font-extrabold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-full">
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
