import type { PhraseTrackProgress } from '../types/phrase';
import { StorageService } from './storageService';

const PHRASE_STORAGE_KEY = 'nihongo_phrase_track_v1';

function getDefaultProgress(): PhraseTrackProgress {
  return {
    completedLessonIds: [],
    lastStudiedLessonId: null,
    quizScores: {},
    updatedAt: new Date().toISOString(),
  };
}

export const PhraseStorageService = {
  getProgress(): PhraseTrackProgress {
    try {
      const raw = localStorage.getItem(PHRASE_STORAGE_KEY);
      if (!raw) return getDefaultProgress();
      const parsed = JSON.parse(raw);
      return {
        completedLessonIds: Array.isArray(parsed.completedLessonIds) ? parsed.completedLessonIds : [],
        lastStudiedLessonId: parsed.lastStudiedLessonId || null,
        quizScores: parsed.quizScores || {},
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Erro ao carregar progresso da Trilha de Frases:', e);
      return getDefaultProgress();
    }
  },

  saveProgress(progress: PhraseTrackProgress): void {
    try {
      progress.updatedAt = new Date().toISOString();
      localStorage.setItem(PHRASE_STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Erro ao salvar progresso da Trilha de Frases:', e);
    }
  },

  markLessonCompleted(lessonId: string): PhraseTrackProgress {
    const progress = this.getProgress();
    if (!progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
    }
    progress.lastStudiedLessonId = lessonId;
    this.saveProgress(progress);

    // Contabiliza como atividade de estudo ativa para a Ofensiva (Streak)
    StorageService.checkAndUpdateStreak();

    return progress;
  },

  recordQuizResult(lessonId: string, score: number, total: number): PhraseTrackProgress {
    const progress = this.getProgress();
    const passed = score >= Math.ceil(total * 0.7);
    const existing = progress.quizScores[lessonId] || { attempts: 0, score: 0, passed: false };

    progress.quizScores[lessonId] = {
      attempts: existing.attempts + 1,
      score: Math.max(existing.score, score),
      passed: existing.passed || passed,
    };

    if (passed && !progress.completedLessonIds.includes(lessonId)) {
      progress.completedLessonIds.push(lessonId);
    }
    progress.lastStudiedLessonId = lessonId;

    this.saveProgress(progress);
    StorageService.checkAndUpdateStreak();

    return progress;
  },

  isLessonCompleted(lessonId: string): boolean {
    const progress = this.getProgress();
    return progress.completedLessonIds.includes(lessonId);
  },
};
