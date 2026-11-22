import type { RubyFragment } from './phrase';

export interface TadokuVocabularyNote {
  word: string;
  reading: string;
  meaning: string;
  kanji?: string;
}

export interface TadokuLine {
  fragments: RubyFragment[];
  romaji: string;
  translation: string;
}

export interface TadokuPage {
  pageNumber: number;
  image: string;
  audioUrl?: string;
  rawJapanese: string;
  lines: TadokuLine[];
  vocabularyNotes?: TadokuVocabularyNote[];
  grammarTip?: {
    pattern: string;
    explanation: string;
  };
}

export interface TadokuStory {
  id: string;
  title: string;
  titleJapanese: string;
  level: 'Level 0' | 'Level 1' | 'Level 2';
  levelDescription: string;
  author: string;
  coverImage: string;
  synopsis: string;
  totalWords: number;
  pages: TadokuPage[];
}
