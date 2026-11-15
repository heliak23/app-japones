import type { KanjiProgressState } from '../types/kanji';
import { StorageService } from './storageService';

const KANJI_STORAGE_KEY = 'nihongo_kanji_progress_v1';

function getDefaultProgress(): KanjiProgressState {
  return {
    studiedKanjiIds: [],
    updatedAt: new Date().toISOString(),
  };
}

export const KanjiStorageService = {
  getProgress(): KanjiProgressState {
    try {
      const raw = localStorage.getItem(KANJI_STORAGE_KEY);
      if (!raw) return getDefaultProgress();
      const parsed = JSON.parse(raw);
      return {
        studiedKanjiIds: Array.isArray(parsed.studiedKanjiIds) ? parsed.studiedKanjiIds : [],
        updatedAt: parsed.updatedAt || new Date().toISOString(),
      };
    } catch (e) {
      console.warn('Erro ao carregar progresso de Kanjis:', e);
      return getDefaultProgress();
    }
  },

  saveProgress(state: KanjiProgressState): void {
    try {
      state.updatedAt = new Date().toISOString();
      localStorage.setItem(KANJI_STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar progresso de Kanjis:', e);
    }
  },

  markAsStudied(kanjiId: string): KanjiProgressState {
    const progress = this.getProgress();
    if (!progress.studiedKanjiIds.includes(kanjiId)) {
      progress.studiedKanjiIds.push(kanjiId);
      this.saveProgress(progress);
      StorageService.checkAndUpdateStreak();
    }
    return progress;
  },

  unmarkAsStudied(kanjiId: string): KanjiProgressState {
    const progress = this.getProgress();
    const index = progress.studiedKanjiIds.indexOf(kanjiId);
    if (index !== -1) {
      progress.studiedKanjiIds.splice(index, 1);
      this.saveProgress(progress);
    }
    return progress;
  },

  toggleStudied(kanjiId: string): KanjiProgressState {
    const progress = this.getProgress();
    const index = progress.studiedKanjiIds.indexOf(kanjiId);
    if (index !== -1) {
      progress.studiedKanjiIds.splice(index, 1);
    } else {
      progress.studiedKanjiIds.push(kanjiId);
      StorageService.checkAndUpdateStreak();
    }
    this.saveProgress(progress);
    return progress;
  },

  isStudied(kanjiId: string): boolean {
    const progress = this.getProgress();
    return progress.studiedKanjiIds.includes(kanjiId);
  },
};
