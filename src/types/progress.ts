import type { AlphabetType } from './kana';
import type { ExerciseSessionSummary } from './exercise';

export interface CharacterProgressStat {
  characterId: string;
  attempts: number;
  correct: number;
  incorrect: number;
  lastStudiedAt: number;
  consecutiveSuccess: number;
  needsReview: boolean;
}

export interface StreakInfo {
  currentStreak: number;
  maxStreak: number;
  lastActiveDate: string | null; // Data local no formato 'YYYY-MM-DD'
  activeDates: string[]; // Lista de datas ordenadas 'YYYY-MM-DD'
}

export interface UserLearningState {
  studiedCharacterIds: string[];
  characterStats: Record<string, CharacterProgressStat>;
  history: ExerciseSessionSummary[];
  totalExercisesCompleted: number;
  totalCorrect: number;
  totalIncorrect: number;
  streak: StreakInfo;
  preferences: {
    audioEnabled: boolean;
    autoPlayAudio: boolean;
    speechRate: number;
    preferredAlphabetFilter: 'all' | AlphabetType;
  };
}

export interface CurrentSessionMetrics {
  studiedInCurrentSession: number;
  exercisesCompletedInCurrentSession: number;
  sessionScore: number;
}
