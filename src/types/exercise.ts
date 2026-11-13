import type { AlphabetType, KanaCharacter } from './kana';

export type ExerciseType =
  | 'recognition'     // Exercício 1: Reconhecimento de caracteres (Japonês -> Romaji)
  | 'typing'          // Exercício 2: Digitação (Japonês -> Usuário digita Romaji)
  | 'conversion'      // Exercício 3: Conversão (Romaji -> Kana ou Kana -> Kana)
  | 'alphabet_id'     // Exercício 4: Identificação do alfabeto (Hiragana ou Katakana?)
  | 'review_random';  // Exercício 5: Revisão aleatória multiformato

export interface ExerciseQuestion {
  id: string;
  type: ExerciseType;
  title: string;
  prompt: string;
  displayTarget: string;
  targetAlphabet?: AlphabetType;
  options?: string[];
  correctAnswer: string;
  acceptableAnswers?: string[];
  characterInfo?: KanaCharacter;
  explanation: string;
}

export interface UserAnswerResult {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
  characterId?: string;
  timeSpentMs?: number;
}

export interface ExerciseSessionSummary {
  exerciseType: ExerciseType;
  totalQuestions: number;
  correctCount: number;
  incorrectCount: number;
  percentage: number;
  score: number;
  results: UserAnswerResult[];
  completedAt: string;
}
