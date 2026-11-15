import { useState, useEffect, useCallback } from 'react';
import type { UserLearningState, CurrentSessionMetrics, CharacterProgressStat } from '../types/progress';
import { StorageService } from '../services/storageService';
import type { ExerciseSessionSummary } from '../types/exercise';

export function useLearningProgress() {
  const [learningState, setLearningState] = useState<UserLearningState>(() => StorageService.getState());
  const [sessionMetrics, setSessionMetrics] = useState<CurrentSessionMetrics>(() => StorageService.getSessionMetrics());

  // Atualiza métricas locais quando ocorrem mudanças
  const refresh = useCallback(() => {
    setLearningState(StorageService.getState());
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const markAsStudied = useCallback((characterId: string) => {
    const updated = StorageService.markCharacterAsStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const unmarkAsStudied = useCallback((characterId: string) => {
    const updated = StorageService.unmarkCharacterAsStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const toggleStudied = useCallback((characterId: string) => {
    const updated = StorageService.toggleCharacterStudied(characterId);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const setMultipleStudied = useCallback((characterIds: string[], studied: boolean) => {
    const updated = StorageService.setMultipleCharactersStudied(characterIds, studied);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const saveSummary = useCallback((summary: ExerciseSessionSummary) => {
    const updated = StorageService.saveExerciseSummary(summary);
    setLearningState({ ...updated });
    setSessionMetrics(StorageService.getSessionMetrics());
  }, []);

  const recordAnswer = useCallback((characterId: string, isCorrect: boolean) => {
    const updated = StorageService.recordCharacterAnswer(characterId, isCorrect);
    setLearningState({ ...updated });
  }, []);

  const dismissReview = useCallback((characterId: string) => {
    const updated = StorageService.dismissCharacterReview(characterId);
    setLearningState({ ...updated });
  }, []);

  const getNeedingReview = useCallback((): CharacterProgressStat[] => {
    return StorageService.getCharactersNeedingReview();
  }, []);

  const resetProgress = useCallback(() => {
    StorageService.resetAllProgress();
    refresh();
  }, [refresh]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nihongo_learning_data_v1') {
        refresh();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
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
