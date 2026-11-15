import type { StreakInfo } from '../types/progress';

export interface WeekDayStatus {
  dayName: string; // 'Seg', 'Ter', 'Qua', etc.
  dayNumber: number; // 1..31
  dateStr: string; // 'YYYY-MM-DD'
  isCompleted: boolean;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
}

export const StreakService = {
  /**
   * Retorna a data no fuso horário local do usuário no formato 'YYYY-MM-DD'
   */
  getLocalDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Retorna a data do dia anterior no formato 'YYYY-MM-DD'
   */
  getYesterdayDateString(refDate: Date = new Date()): string {
    const d = new Date(refDate);
    d.setDate(d.getDate() - 1);
    return this.getLocalDateString(d);
  },

  /**
   * Calcula a diferença em dias corridos entre duas datas 'YYYY-MM-DD' (dateStr2 - dateStr1)
   */
  getDayDifference(dateStr1: string, dateStr2: string): number {
    const [y1, m1, d1] = dateStr1.split('-').map(Number);
    const [y2, m2, d2] = dateStr2.split('-').map(Number);
    const dt1 = new Date(y1, m1 - 1, d1);
    const dt2 = new Date(y2, m2 - 1, d2);
    const diffTime = dt2.getTime() - dt1.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  },

  /**
   * Retorna o estado padrão de Streak
   */
  getDefaultStreak(): StreakInfo {
    return {
      currentStreak: 0,
      maxStreak: 0,
      lastActiveDate: null,
      activeDates: [],
    };
  },

  /**
   * Processa o acesso do usuário ao sistema (entrada diária / estudo)
   * e atualiza o streak de forma determinística
   */
  calculateStreakOnAccess(
    current: StreakInfo | undefined,
    now: Date = new Date()
  ): {
    streak: StreakInfo;
    isNewDay: boolean;
    isConsecutive: boolean;
    streakIncreased: boolean;
  } {
    const today = this.getLocalDateString(now);
    const base: StreakInfo = {
      currentStreak: current?.currentStreak ?? 0,
      maxStreak: current?.maxStreak ?? 0,
      lastActiveDate: current?.lastActiveDate ?? null,
      activeDates: Array.isArray(current?.activeDates) ? [...current.activeDates] : [],
    };

    // Caso 1: Primeiro acesso histórico
    if (!base.lastActiveDate) {
      return {
        streak: {
          currentStreak: 1,
          maxStreak: 1,
          lastActiveDate: today,
          activeDates: [today],
        },
        isNewDay: true,
        isConsecutive: false,
        streakIncreased: true,
      };
    }

    // Caso 2: Acesso no mesmo dia (já registrado hoje)
    if (base.lastActiveDate === today) {
      if (!base.activeDates.includes(today)) {
        base.activeDates.push(today);
        base.activeDates.sort();
      }
      return {
        streak: base,
        isNewDay: false,
        isConsecutive: false,
        streakIncreased: false,
      };
    }

    // Caso 3: Acesso em dia posterior
    const diff = this.getDayDifference(base.lastActiveDate, today);

    if (diff === 1) {
      // Dia consecutivo perfeito (ontem -> hoje)
      const newStreak = (base.currentStreak || 0) + 1;
      const newMax = Math.max(base.maxStreak || 0, newStreak);
      const updatedDates = Array.from(new Set([...base.activeDates, today])).sort();

      return {
        streak: {
          currentStreak: newStreak,
          maxStreak: newMax,
          lastActiveDate: today,
          activeDates: updatedDates.slice(-60), // Salva histórico dos últimos 60 dias
        },
        isNewDay: true,
        isConsecutive: true,
        streakIncreased: true,
      };
    }

    if (diff > 1) {
      // Usuário pulou pelo menos 1 dia (a sequência foi interrompida e recomeça hoje em 1)
      const updatedDates = Array.from(new Set([...base.activeDates, today])).sort();

      return {
        streak: {
          currentStreak: 1,
          maxStreak: Math.max(base.maxStreak || 0, 1),
          lastActiveDate: today,
          activeDates: updatedDates.slice(-60),
        },
        isNewDay: true,
        isConsecutive: false,
        streakIncreased: false,
      };
    }

    // diff < 0 (Horário do dispositivo atrasado ou viagem de fuso horário)
    return {
      streak: base,
      isNewDay: false,
      isConsecutive: false,
      streakIncreased: false,
    };
  },

  /**
   * Recalcula o streak atual e máximo a partir de uma lista de datas arbitrária
   */
  computeStreakFromDates(
    dates: string[],
    refDate: Date = new Date()
  ): { currentStreak: number; maxStreak: number } {
    if (!dates || dates.length === 0) {
      return { currentStreak: 0, maxStreak: 0 };
    }

    const uniqueDates = Array.from(new Set(dates)).sort();
    const dateSet = new Set(uniqueDates);

    // 1. Calcula o maior streak histórico em qualquer período
    let maxStreak = 0;
    let tempStreak = 0;
    let prevDateStr: string | null = null;

    for (const d of uniqueDates) {
      if (!prevDateStr) {
        tempStreak = 1;
      } else {
        const diff = this.getDayDifference(prevDateStr, d);
        if (diff === 1) {
          tempStreak += 1;
        } else if (diff > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > maxStreak) {
        maxStreak = tempStreak;
      }
      prevDateStr = d;
    }

    // 2. Calcula o currentStreak com base em hoje ou ontem
    const today = this.getLocalDateString(refDate);
    const yesterday = this.getYesterdayDateString(refDate);

    let currentStreak = 0;
    let checkDateStr: string | null = null;

    if (dateSet.has(today)) {
      checkDateStr = today;
    } else if (dateSet.has(yesterday)) {
      checkDateStr = yesterday;
    }

    if (checkDateStr) {
      const cur = new Date(checkDateStr + 'T12:00:00');
      while (true) {
        const dateFormatted = this.getLocalDateString(cur);
        if (dateSet.has(dateFormatted)) {
          currentStreak += 1;
          cur.setDate(cur.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      currentStreak,
      maxStreak: Math.max(maxStreak, currentStreak),
    };
  },

  /**
   * Mescla dados de Streak de diferentes origens (Local x Supabase Cloud)
   */
  mergeStreakInfos(
    local: StreakInfo | undefined,
    cloud: StreakInfo | undefined,
    refDate: Date = new Date()
  ): StreakInfo {
    const localDates = local?.activeDates || (local?.lastActiveDate ? [local.lastActiveDate] : []);
    const cloudDates = cloud?.activeDates || (cloud?.lastActiveDate ? [cloud.lastActiveDate] : []);

    const allDates = Array.from(new Set([...localDates, ...cloudDates])).sort();

    if (allDates.length === 0) {
      return this.getDefaultStreak();
    }

    const computed = this.computeStreakFromDates(allDates, refDate);
    const overallMax = Math.max(
      local?.maxStreak || 0,
      cloud?.maxStreak || 0,
      computed.maxStreak
    );

    const lastActive = allDates[allDates.length - 1];

    return {
      currentStreak: computed.currentStreak,
      maxStreak: overallMax,
      lastActiveDate: lastActive,
      activeDates: allDates.slice(-60),
    };
  },

  /**
   * Retorna os 7 dias da semana atual (Segunda a Domingo) com o status de cada dia
   */
  getWeekStatus(activeDates: string[], refDate: Date = new Date()): WeekDayStatus[] {
    const todayStr = this.getLocalDateString(refDate);
    const activeSet = new Set(activeDates || []);

    // Determina o início da semana (Segunda-feira)
    // No JS: 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    const dayOfWeek = refDate.getDay();
    // Quantos dias subtrair para voltar para a Segunda-feira
    // Se domingo (0), volta 6 dias. Se segunda (1), volta 0 dias, etc.
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const monday = new Date(refDate);
    monday.setDate(refDate.getDate() - diffToMonday);

    const dayLabels = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
    const result: WeekDayStatus[] = [];

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + i);

      const dateStr = this.getLocalDateString(currentDay);
      const isCompleted = activeSet.has(dateStr);
      const isToday = dateStr === todayStr;
      const diffWithToday = this.getDayDifference(todayStr, dateStr);

      result.push({
        dayName: dayLabels[i],
        dayNumber: currentDay.getDate(),
        dateStr,
        isCompleted,
        isToday,
        isPast: diffWithToday < 0,
        isFuture: diffWithToday > 0,
      });
    }

    return result;
  },

  /**
   * Mensagens motivacionais baseadas no número de dias seguidos
   */
  getStreakMotivationalMessage(
    currentStreak: number,
    isCompletedToday: boolean
  ): { title: string; message: string } {
    if (!isCompletedToday && currentStreak > 0) {
      return {
        title: 'Mantenha sua chama acesa! 🔥',
        message: `Você tem ${currentStreak} ${currentStreak === 1 ? 'dia' : 'dias'} de ofensiva. Estude hoje para não perder a sequência!`,
      };
    }

    if (currentStreak === 0) {
      return {
        title: 'Acenda sua Chama! 🔥',
        message: 'Entre e pratique ao menos alguns minutos todos os dias para dominar os caracteres japoneses.',
      };
    }

    if (currentStreak === 1) {
      return {
        title: 'Primeiro dia concluído! 🎌',
        message: 'A chama do aprendizado foi acesa! Volte amanhã para manter sua consistência em alta.',
      };
    }

    if (currentStreak < 7) {
      return {
        title: `${currentStreak} dias seguidos em chamas! 🔥`,
        message: 'Você está construindo o hábito diário de memorização. Continue assim!',
      };
    }

    if (currentStreak < 14) {
      return {
        title: `1 semana inteira de dedicação! ⚡`,
        message: 'Impressionante! Sua consistência diária está transformando a leitura em algo natural.',
      };
    }

    if (currentStreak < 30) {
      return {
        title: `${currentStreak} dias consecutivos! 🏆`,
        message: 'Ritmo excepcional! Poucos estudantes têm essa determinação diária.',
      };
    }

    return {
      title: 'Mestre da Constância! 🌟',
      message: `Mais de ${currentStreak} dias seguidos! O japonês agora faz parte da sua rotina diária.`,
    };
  },
};
