import type { UserLearningState, CharacterProgressStat, CurrentSessionMetrics } from '../types/progress';
import type { ExerciseSessionSummary } from '../types/exercise';

const STORAGE_KEY = 'nihongo_learning_data_v1';
const SESSION_KEY = 'nihongo_session_metrics_v1';

const defaultState: UserLearningState = {
  studiedCharacterIds: [],
  characterStats: {},
  history: [],
  totalExercisesCompleted: 0,
  totalCorrect: 0,
  totalIncorrect: 0,
  preferences: {
    audioEnabled: true,
    autoPlayAudio: false,
    speechRate: 0.85,
    preferredAlphabetFilter: 'all',
  },
};

const defaultSession: CurrentSessionMetrics = {
  studiedInCurrentSession: 0,
  exercisesCompletedInCurrentSession: 0,
  sessionScore: 0,
};

export const StorageService = {
  getState(): UserLearningState {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState;
      const parsed = JSON.parse(raw);
      return {
        ...defaultState,
        ...parsed,
        preferences: {
          ...defaultState.preferences,
          ...(parsed.preferences || {}),
        },
      };
    } catch (e) {
      console.error('Erro ao ler do LocalStorage:', e);
      return defaultState;
    }
  },

  saveState(state: UserLearningState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar no LocalStorage:', e);
    }
  },

  markCharacterAsStudied(characterId: string): UserLearningState {
    const state = this.getState();
    if (!state.studiedCharacterIds.includes(characterId)) {
      state.studiedCharacterIds.push(characterId);
      this.saveState(state);
      this.incrementSessionStudied();
    }
    return state;
  },

  recordCharacterAnswer(characterId: string, isCorrect: boolean): UserLearningState {
    const state = this.getState();
    const existing = state.characterStats[characterId] || {
      characterId,
      attempts: 0,
      correct: 0,
      incorrect: 0,
      lastStudiedAt: Date.now(),
      consecutiveSuccess: 0,
      needsReview: false,
    };

    existing.attempts += 1;
    existing.lastStudiedAt = Date.now();

    if (isCorrect) {
      existing.correct += 1;
      existing.consecutiveSuccess += 1;
      if (existing.consecutiveSuccess >= 2) {
        existing.needsReview = false;
      }
    } else {
      existing.incorrect += 1;
      existing.consecutiveSuccess = 0;
      existing.needsReview = true;
    }

    state.characterStats[characterId] = existing;
    this.saveState(state);
    return state;
  },

  saveExerciseSummary(summary: ExerciseSessionSummary): UserLearningState {
    const state = this.getState();
    state.history.unshift(summary);
    if (state.history.length > 50) {
      state.history = state.history.slice(0, 50);
    }

    state.totalExercisesCompleted += 1;
    state.totalCorrect += summary.correctCount;
    state.totalIncorrect += summary.incorrectCount;

    summary.results.forEach((res) => {
      if (res.characterId) {
        const charStat = state.characterStats[res.characterId] || {
          characterId: res.characterId,
          attempts: 0,
          correct: 0,
          incorrect: 0,
          lastStudiedAt: Date.now(),
          consecutiveSuccess: 0,
          needsReview: false,
        };
        charStat.attempts += 1;
        charStat.lastStudiedAt = Date.now();
        if (res.isCorrect) {
          charStat.correct += 1;
          charStat.consecutiveSuccess += 1;
          if (charStat.consecutiveSuccess >= 2) charStat.needsReview = false;
        } else {
          charStat.incorrect += 1;
          charStat.consecutiveSuccess = 0;
          charStat.needsReview = true;
        }
        state.characterStats[res.characterId] = charStat;
      }
    });

    this.saveState(state);
    this.incrementSessionExercise(summary.score);
    return state;
  },

  getCharactersNeedingReview(): CharacterProgressStat[] {
    const state = this.getState();
    return Object.values(state.characterStats)
      .filter((stat) => stat.needsReview || (stat.attempts > 0 && stat.incorrect / stat.attempts >= 0.4))
      .sort((a, b) => (b.incorrect / (b.attempts || 1)) - (a.incorrect / (a.attempts || 1)));
  },

  getSessionMetrics(): CurrentSessionMetrics {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : defaultSession;
    } catch {
      return defaultSession;
    }
  },

  incrementSessionStudied(): void {
    const current = this.getSessionMetrics();
    current.studiedInCurrentSession += 1;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
    } catch {}
  },

  incrementSessionExercise(score: number): void {
    const current = this.getSessionMetrics();
    current.exercisesCompletedInCurrentSession += 1;
    current.sessionScore += score;
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(current));
    } catch {}
  },

  resetAllProgress(): void {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }
};
