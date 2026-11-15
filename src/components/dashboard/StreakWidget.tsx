import React from 'react';
import { Flame, Trophy, Calendar, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import type { StreakInfo } from '../../types/progress';
import { StreakService } from '../../services/streakService';

interface StreakWidgetProps {
  streak: StreakInfo;
}

export const StreakWidget: React.FC<StreakWidgetProps> = ({ streak }) => {
  const todayStr = StreakService.getLocalDateString();
  const isCompletedToday = streak.activeDates?.includes(todayStr) ?? false;
  const weekDays = StreakService.getWeekStatus(streak.activeDates || []);
  const motivation = StreakService.getStreakMotivationalMessage(
    streak.currentStreak || 0,
    isCompletedToday
  );

  const current = streak.currentStreak || 0;
  const max = Math.max(streak.maxStreak || 0, current);
  const totalDays = streak.activeDates?.length || 0;

  return (
    <section className="relative overflow-hidden bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all">
      {/* Luz de fundo sutil decorativa */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-60 h-60 rounded-full bg-orange-500/10 dark:bg-orange-500/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Lado Esquerdo: Chama, Contador de Dias Seguidos e Mensagem Motivacional */}
        <div className="flex items-start gap-4 sm:gap-5">
          <div
            className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform ${
              current > 0
                ? 'bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-orange-500/25 animate-pulse'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
            }`}
          >
            <Flame className="w-8 h-8 sm:w-9 sm:h-9" />
          </div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-orange-50 dark:bg-orange-950/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-orange-500" />
                Ofensiva de Estudos
              </span>

              {isCompletedToday ? (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  Hoje garantido!
                </span>
              ) : (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50 inline-flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  Pendente hoje
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {current} {current === 1 ? 'Dia Seguido' : 'Dias Seguidos'}
              </h3>
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">
                (Sequência ativa)
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed max-w-xl">
              {motivation.message}
            </p>
          </div>
        </div>

        {/* Lado Direito: Métricas Rápidas (Recorde e Total de Dias) */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800/80 pt-4 lg:pt-0 lg:pl-6">
          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
              <Trophy className="w-3.5 h-3.5" />
              <span>Recorde</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {max} {max === 1 ? 'dia' : 'dias'}
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800 text-center min-w-[100px]">
            <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-indigo-600 dark:text-indigo-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Total Ativo</span>
            </div>
            <div className="text-lg font-black text-slate-900 dark:text-white mt-0.5">
              {totalDays} {totalDays === 1 ? 'dia' : 'dias'}
            </div>
          </div>
        </div>

      </div>

      {/* Rastreador Semanal da Ofensiva (Segunda a Domingo) */}
      <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            <span>Sua semana de estudos</span>
          </span>
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {weekDays.filter((d) => d.isCompleted).length} de 7 dias concluídos nesta semana
          </span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 sm:gap-3">
          {weekDays.map((day) => {
            const isCompleted = day.isCompleted;
            const isToday = day.isToday;

            return (
              <div
                key={day.dateStr}
                className={`relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl transition-all ${
                  isToday
                    ? 'ring-2 ring-orange-500/80 dark:ring-orange-400/80 bg-orange-50/50 dark:bg-orange-950/20'
                    : 'bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800/60'
                }`}
                title={`${day.dayName} (${day.dateStr}): ${isCompleted ? 'Ativo / Estudou' : isToday ? 'Hoje (pendente)' : 'Não registrado'}`}
              >
                <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">
                  {day.dayName}
                </span>

                <div
                  className={`mt-1.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-transform ${
                    isCompleted
                      ? 'bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-sm shadow-orange-500/30 scale-105'
                      : isToday
                      ? 'bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 border border-orange-300 dark:border-orange-700'
                      : 'bg-slate-200/70 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {isCompleted ? (
                    <Flame className="w-4 h-4 fill-white" />
                  ) : (
                    <span>{day.dayNumber}</span>
                  )}
                </div>

                {isToday && (
                  <span className="absolute -bottom-1 px-1.5 py-0.2 rounded-full bg-orange-500 text-white text-[8px] font-extrabold uppercase tracking-tight">
                    Hoje
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
