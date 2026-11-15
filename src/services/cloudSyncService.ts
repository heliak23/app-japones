import { supabase } from './supabaseClient';
import type { UserLearningState, CharacterProgressStat } from '../types/progress';
import { StorageService } from './storageService';
import { StreakService } from './streakService';

export const CloudSyncService = {
  async fetchCloudLearningState(userId: string): Promise<UserLearningState | null> {
    try {
      const { data, error } = await supabase
        .from('user_learning_state')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Erro ao buscar estado de aprendizado na nuvem:', error);
        return null;
      }

      if (!data) return null;

      const defaultState = StorageService.getState();

      return {
        studiedCharacterIds: data.studied_character_ids || [],
        characterStats: data.character_stats || {},
        history: data.history || [],
        totalExercisesCompleted: data.total_exercises_completed || 0,
        totalCorrect: data.total_correct || 0,
        totalIncorrect: data.total_incorrect || 0,
        streak: {
          currentStreak: typeof data.current_streak === 'number' ? data.current_streak : (defaultState.streak?.currentStreak ?? 0),
          maxStreak: typeof data.max_streak === 'number' ? data.max_streak : (defaultState.streak?.maxStreak ?? 0),
          lastActiveDate: data.last_active_date || defaultState.streak?.lastActiveDate || null,
          activeDates: Array.isArray(data.active_dates) ? data.active_dates : (defaultState.streak?.activeDates ?? []),
        },
        preferences: {
          ...defaultState.preferences,
          ...(data.preferences || {}),
        },
      };
    } catch (e) {
      console.error('Falha na sincronização com nuvem:', e);
      return null;
    }
  },

  async saveCloudLearningState(userId: string, state: UserLearningState): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('user_learning_state')
        .upsert(
          {
            user_id: userId,
            studied_character_ids: state.studiedCharacterIds,
            character_stats: state.characterStats,
            history: state.history,
            total_exercises_completed: state.totalExercisesCompleted,
            total_correct: state.totalCorrect,
            total_incorrect: state.totalIncorrect,
            current_streak: state.streak?.currentStreak ?? 0,
            max_streak: state.streak?.maxStreak ?? 0,
            last_active_date: state.streak?.lastActiveDate ?? null,
            active_dates: state.streak?.activeDates ?? [],
            preferences: state.preferences,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'user_id' }
        );

      if (error) {
        console.error('Erro ao salvar progresso no Supabase:', error);
        return false;
      }
      return true;
    } catch (e) {
      console.error('Falha de rede ao salvar progresso:', e);
      return false;
    }
  },

  mergeStates(local: UserLearningState, cloud: UserLearningState): UserLearningState {
    // Unir IDs de caracteres estudados únicos
    const mergedIds = Array.from(new Set([...local.studiedCharacterIds, ...cloud.studiedCharacterIds]));

    // Mesclar estatísticas de caracteres mantendo a data mais recente
    const mergedStats: Record<string, CharacterProgressStat> = { ...cloud.characterStats };
    for (const [charId, localStat] of Object.entries(local.characterStats)) {
      const cloudStat = mergedStats[charId];
      if (!cloudStat) {
        mergedStats[charId] = localStat;
      } else if (localStat.lastStudiedAt > cloudStat.lastStudiedAt) {
        mergedStats[charId] = {
          characterId: charId,
          attempts: Math.max(localStat.attempts, cloudStat.attempts),
          correct: Math.max(localStat.correct, cloudStat.correct),
          incorrect: Math.max(localStat.incorrect, cloudStat.incorrect),
          lastStudiedAt: localStat.lastStudiedAt,
          consecutiveSuccess: localStat.consecutiveSuccess,
          needsReview: localStat.needsReview,
        };
      }
    }

    // Mesclar histórico evitando duplicatas de completedAt
    const historyMap = new Map();
    [...(cloud.history || []), ...(local.history || [])].forEach((h) => {
      historyMap.set(h.completedAt, h);
    });
    const mergedHistory = Array.from(historyMap.values())
      .sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      .slice(0, 50);

    // Mesclar streak usando algoritmo determinístico
    const mergedStreak = StreakService.mergeStreakInfos(local.streak, cloud.streak);

    return {
      studiedCharacterIds: mergedIds,
      characterStats: mergedStats,
      history: mergedHistory,
      totalExercisesCompleted: Math.max(local.totalExercisesCompleted, cloud.totalExercisesCompleted, mergedHistory.length),
      totalCorrect: Math.max(local.totalCorrect, cloud.totalCorrect),
      totalIncorrect: Math.max(local.totalIncorrect, cloud.totalIncorrect),
      streak: mergedStreak,
      preferences: {
        ...cloud.preferences,
        ...local.preferences,
      },
    };
  },
};
