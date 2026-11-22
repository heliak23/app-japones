import type { WritingProgressState, WritingCharacterType } from '../types/writing';
import { StorageService } from './storageService';

const WRITING_STORAGE_KEY = 'nihongo_writing_progress_v1';

function getDefaultWritingProgress(): WritingProgressState {
  return {
    practicedIds: [],
    history: {},
    totalWritingsCompleted: 0,
    updatedAt: new Date().toISOString(),
  };
}

export const WritingStorageService = {
  getProgress(): WritingProgressState {
    try {
      const raw = localStorage.getItem(WRITING_STORAGE_KEY);
      if (!raw) return getDefaultWritingProgress();
      const parsed = JSON.parse(raw);
      return {
        practicedIds: Array.isArray(parsed.practicedIds) ? parsed.practicedIds : [],
        history: parsed.history && typeof parsed.history === 'object' ? parsed.history : {},
        totalWritingsCompleted: typeof parsed.totalWritingsCompleted === 'number' ? parsed.totalWritingsCompleted : 0,
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Erro ao carregar progresso de escrita:', e);
      return getDefaultWritingProgress();
    }
  },

  saveProgress(state: WritingProgressState): void {
    try {
      state.updatedAt = new Date().toISOString();
      localStorage.setItem(WRITING_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar progresso de escrita:', e);
    }
  },

  recordPractice(
    characterId: string,
    character: string,
    type: WritingCharacterType,
    score: number = 100
  ): WritingProgressState {
    const progress = this.getProgress();
    const existing = progress.history[characterId];

    if (!progress.practicedIds.includes(characterId)) {
      progress.practicedIds.push(characterId);
    }

    progress.history[characterId] = {
      characterId,
      character,
      type,
      attempts: (existing?.attempts || 0) + 1,
      bestScore: Math.max(existing?.bestScore || 0, score),
      lastPracticedAt: new Date().toISOString(),
    };

    progress.totalWritingsCompleted += 1;
    this.saveProgress(progress);

    // Atualiza a ofensiva do usuário no aplicativo
    try {
      StorageService.checkAndUpdateStreak();
    } catch (e) {
      console.warn('Falha ao atualizar streak:', e);
    }

    return progress;
  },

  isCharacterPracticed(characterId: string): boolean {
    const progress = this.getProgress();
    return progress.practicedIds.includes(characterId);
  },

  getStats(): {
    totalPracticed: number;
    hiraganaPracticed: number;
    katakanaPracticed: number;
    kanjiPracticed: number;
    averageScore: number;
  } {
    const progress = this.getProgress();
    const entries = Object.values(progress.history);

    let hira = 0;
    let kata = 0;
    let kanji = 0;
    let totalScore = 0;

    for (const item of entries) {
      if (item.type === 'hiragana') hira++;
      else if (item.type === 'katakana') kata++;
      else if (item.type === 'kanji') kanji++;
      totalScore += item.bestScore;
    }

    return {
      totalPracticed: progress.practicedIds.length,
      hiraganaPracticed: hira,
      katakanaPracticed: kata,
      kanjiPracticed: kanji,
      averageScore: entries.length > 0 ? Math.round(totalScore / entries.length) : 0,
    };
  },
};
