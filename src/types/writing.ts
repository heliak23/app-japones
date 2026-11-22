export type WritingCharacterType = 'hiragana' | 'katakana' | 'kanji';

export interface WritingCharacterItem {
  id: string;
  type: WritingCharacterType;
  character: string;
  romaji: string;
  meaning?: string;
  ptPronunciation?: string;
  strokes?: number;
  categoryLabel?: string;
  mnemonic?: string;
  onyomi?: string[];
  kunyomi?: string[];
}

export interface WritingProgressItem {
  characterId: string;
  character: string;
  type: WritingCharacterType;
  attempts: number;
  bestScore: number;
  lastPracticedAt: string;
}

export interface WritingProgressState {
  practicedIds: string[];
  history: Record<string, WritingProgressItem>;
  totalWritingsCompleted: number;
  updatedAt: string;
}
