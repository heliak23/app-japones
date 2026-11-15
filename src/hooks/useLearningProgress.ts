import { useState, useEffect, useCallback, useRef } from 'react';
import type { UserLearningState, CurrentSessionMetrics, CharacterProgressStat } from '../types/progress';
import { StorageService } from '../services/storageService';
import type { ExerciseSessionSummary } from '../types/exercise';
import { useAuth } from './useAuth';
import { CloudSyncService } from '../services/cloudSyncService';

export function useLearningProgress() {
  const { user } = useAuth();
  const [learningState, setLearningState] = useState<UserLearningState>(() => StorageService.getState());
  const [sessionMetrics, setSessionMetrics] = useState<CurrentSessionMetrics>(() => StorageService.getSessionMetrics());

  // Salva no Supabase se houver usuário autenticado
  const syncTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const syncToCloud = useCallback((stateToSync: UserLearningState) => {
    if (!user) return;
    if (syncTimerRef.current) {
      clearTimeout(syncTimerRef.current);
    }
    syncTimerRef.current = setTimeout(() => {
      CloudSyncService.saveCloudLearningState(user.id, stateToSync);
    }, 400);
  }, [user]);

  // Atualiza métricas locais quando ocorrem mudanças
  const refresh = useCallback(() => {
    const currentState = StorageService.getState();
    setLearningState(currentState);
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const markAsStudied = useCallback((characterId: string) => {
    const updated = StorageService.markCharacterAsStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
    syncToCloud(updated);
  }, [syncToCloud]);

  const unmarkAsStudied = useCallback((characterId: string) => {
    const updated = StorageService.unmarkCharacterAsStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
    syncToCloud(updated);
  }, [syncToCloud]);

  const toggleStudied = useCallback((characterId: string) => {
    const updated = StorageService.toggleCharacterStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
    syncToCloud(updated);
  }, [syncToCloud]);

  const setMultipleStudied = useCallback((characterIds: string[], studied: boolean) => {
    const updated = StorageService.setMultipleCharactersStudied(characterIds, studied);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
    syncToCloud(updated);
  }, [syncToCloud]);

  const saveSummary = useCallback((summary: ExerciseSessionSummary) => {
    const updated = StorageService.saveExerciseSummary(summary);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
    syncToCloud(updated);
  }, [syncToCloud]);

  const recordAnswer = useCallback((characterId: string, isCorrect: boolean) => {
    const updated = StorageService.recordCharacterAnswer(characterId, isCorrect);
    setLearningState({ ...updated });
    syncToCloud(updated);
  }, [syncToCloud]);

  const dismissReview = useCallback((characterId: string) => {
    const updated = StorageService.dismissCharacterReview(characterId);
    setLearningState({ ...updated });
    syncToCloud(updated);
  }, [syncToCloud]);

  const getNeedingReview = useCallback((): CharacterProgressStat[] => {
    return StorageService.getCharactersNeedingReview();
  }, []);

  const resetProgress = useCallback(() => {
    StorageService.resetAllProgress();
    refresh();
    if (user) {
      const emptyState = StorageService.getState();
      CloudSyncService.saveCloudLearningState(user.id, emptyState);
    }
  }, [refresh, user]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent | Event) => {
      if ('key' in e && e.key && e.key !== 'nihongo_learning_data_v1') return;
      refresh();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      if (syncTimerRef.current) {
        clearTimeout(syncTimerRef.current);
      }
    };
  }, [refresh]);

  return {
    learningState,
    sessionMetrics,
    markAsStudied,
    unmarkAsStudied,
    toggleStudied,
    setMultipleStudied,
    saveSummary,
    recordAnswer,
    dismissReview,
    getNeedingReview,
    resetProgress,
    refresh,
  };
}
