import type { VocabularyProgress } from '../types/vocabulary';

const STORAGE_KEY = 'nihongo_vocabulary_progress';

const defaultProgress: VocabularyProgress = {
  learnedWordIds: [],
  bookmarkedWordIds: [],
  totalQuizzesCompleted: 0,
  totalCorrect: 0,
  totalQuestions: 0,
  lastStudiedAt: null,
};

export class VocabularyStorageService {
  static getProgress(): VocabularyProgress {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return { ...defaultProgress };
      const parsed = JSON.parse(data);
      return {
        learnedWordIds: Array.isArray(parsed.learnedWordIds) ? parsed.learnedWordIds : [],
        bookmarkedWordIds: Array.isArray(parsed.bookmarkedWordIds) ? parsed.bookmarkedWordIds : [],
        totalQuizzesCompleted: typeof parsed.totalQuizzesCompleted === 'number' ? parsed.totalQuizzesCompleted : 0,
        totalCorrect: typeof parsed.totalCorrect === 'number' ? parsed.totalCorrect : 0,
        totalQuestions: typeof parsed.totalQuestions === 'number' ? parsed.totalQuestions : 0,
        lastStudiedAt: parsed.lastStudiedAt || null,
      };
    } catch {
      return { ...defaultProgress };
    }
  }

  static saveProgress(progress: VocabularyProgress): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (e) {
      console.error('Erro ao salvar progresso de vocabulário:', e);
    }
  }

  static isWordLearned(wordId: string): boolean {
    const progress = this.getProgress();
    return progress.learnedWordIds.includes(wordId);
  }

  static toggleLearned(wordId: string): VocabularyProgress {
    const progress = this.getProgress();
    const isLearned = progress.learnedWordIds.includes(wordId);
    
    const updated: VocabularyProgress = {
      ...progress,
      learnedWordIds: isLearned
        ? progress.learnedWordIds.filter((id) => id !== wordId)
        : [...progress.learnedWordIds, wordId],
      lastStudiedAt: new Date().toISOString(),
    };

    this.saveProgress(updated);
    return updated;
  }

  static isWordBookmarked(wordId: string): boolean {
    const progress = this.getProgress();
    return progress.bookmarkedWordIds.includes(wordId);
  }

  static toggleBookmarked(wordId: string): VocabularyProgress {
    const progress = this.getProgress();
    const isBookmarked = progress.bookmarkedWordIds.includes(wordId);

    const updated: VocabularyProgress = {
      ...progress,
      bookmarkedWordIds: isBookmarked
        ? progress.bookmarkedWordIds.filter((id) => id !== wordId)
        : [...progress.bookmarkedWordIds, wordId],
    };

    this.saveProgress(updated);
    return updated;
  }

  static recordQuizResult(correctCount: number, questionsCount: number): VocabularyProgress {
    const progress = this.getProgress();
    const updated: VocabularyProgress = {
      ...progress,
      totalQuizzesCompleted: progress.totalQuizzesCompleted + 1,
      totalCorrect: progress.totalCorrect + correctCount,
      totalQuestions: progress.totalQuestions + questionsCount,
      lastStudiedAt: new Date().toISOString(),
    };

    this.saveProgress(updated);
    return updated;
  }

  static resetProgress(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.error('Erro ao limpar progresso de vocabulário:', e);
    }
  }
}
