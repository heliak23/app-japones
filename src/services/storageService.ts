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

  unmarkCharacterAsStudied(characterId: string): UserLearningState {
    const state = this.getState();
    const index = state.studiedCharacterIds.indexOf(characterId);
    if (index !== -1) {
      state.studiedCharacterIds.splice(index, 1);
      this.saveState(state);
    }
    return state;
  },

  toggleCharacterStudied(characterId: string): UserLearningState {
    const state = this.getState();
    const index = state.studiedCharacterIds.indexOf(characterId);
    if (index !== -1) {
      state.studiedCharacterIds.splice(index, 1);
    } else {
      state.studiedCharacterIds.push(characterId);
      this.incrementSessionStudied();
    }
    this.saveState(state);
    return state;
  },

  setMultipleCharactersStudied(characterIds: string[], studied: boolean): UserLearningState {
    const state = this.getState();
    let changed = false;
    if (studied) {
      let newlyAdded = 0;
      for (const id of characterIds) {
        if (!state.studiedCharacterIds.includes(id)) {
          state.studiedCharacterIds.push(id);
          newlyAdded++;
          changed = true;
        }
      }
      if (newlyAdded > 0) {
        const session = this.getSessionMetrics();
        session.studiedInCurrentSession += newlyAdded;
        try {
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        } catch {}
      }
    } else {
      const idsToRemove = new Set(characterIds);
      const prevLength = state.studiedCharacterIds.length;
      state.studiedCharacterIds = state.studiedCharacterIds.filter((id) => !idsToRemove.has(id));
      if (state.studiedCharacterIds.length !== prevLength) {
        changed = true;
      }
    }
    if (changed) {
      this.saveState(state);
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
      // Ao acertar, o erro é considerado superado e sai da fila de revisão
      existing.needsReview = false;
    } else {
      existing.incorrect += 1;
      existing.consecutiveSuccess = 0;
      existing.needsReview = true;
    }

    state.characterStats[characterId] = existing;
    this.saveState(state);
    return state;
  },

  dismissCharacterReview(characterId: string): UserLearningState {
    const state = this.getState();
    if (state.characterStats[characterId]) {
      state.characterStats[characterId].needsReview = false;
      this.saveState(state);
    }
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

    // Assegura que o estado needsReview reflita a última resposta de cada caractere
    // evitando duplicar attempts/correct/incorrect que já foram computados em recordCharacterAnswer
    summary.results.forEach((res) => {
      if (res.characterId) {
        if (!state.characterStats[res.characterId]) {
          state.characterStats[res.characterId] = {
            characterId: res.characterId,
            attempts: 1,
            correct: res.isCorrect ? 1 : 0,
            incorrect: res.isCorrect ? 0 : 1,
            lastStudiedAt: Date.now(),
            consecutiveSuccess: res.isCorrect ? 1 : 0,
            needsReview: !res.isCorrect,
          };
        } else {
          state.characterStats[res.characterId].needsReview = !res.isCorrect;
        }
      }
    });

    this.saveState(state);
    this.incrementSessionExercise(summary.score);
    return state;
  },

  getCharactersNeedingReview(): CharacterProgressStat[] {
    const state = this.getState();
    return Object.values(state.characterStats)
      .filter((stat) => stat.needsReview)
      .sort((a, b) => b.incorrect - a.incorrect);
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
