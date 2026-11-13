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

export interface UserLearningState {
  studiedCharacterIds: string[];
  characterStats: Record<string, CharacterProgressStat>;
  history: ExerciseSessionSummary[];
  totalExercisesCompleted: number;
  totalCorrect: number;
  totalIncorrect: number;
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
