export type ParticleCategory = 'all' | 'topic_subject' | 'space_time' | 'connection';

export interface ParticleItem {
  id: string;
  character: string;
  romaji: string;
  name: string;
  role: string;
  category: 'topic_subject' | 'space_time' | 'connection';
  goldenRule: string;
  color: string;
  contrastWith?: {
    particle: string;
    explanation: string;
  };
  examples: {
    japanese: string;
    romaji: string;
    translation: string;
    highlightWord: string;
  }[];
}

export interface ParticleQuizQuestion {
  id: string;
  sentenceWithBlank: string;
  romajiWithBlank: string;
  translation: string;
  correctParticle: string;
  options: string[];
  explanation: string;
}

export type AdjectiveType = 'i' | 'na';

export interface AdjectiveItem {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  type: AdjectiveType;
  forms: {
    presentAffirmative: { japanese: string; romaji: string; label: string };
    presentNegative: { japanese: string; romaji: string; label: string };
    pastAffirmative: { japanese: string; romaji: string; label: string };
    pastNegative: { japanese: string; romaji: string; label: string };
  };
  notes?: string;
  exampleSentence: {
    japanese: string;
    romaji: string;
    translation: string;
  };
}

export type VerbGroup = 'g1' | 'g2' | 'g3';

export interface VerbItem {
  id: string;
  kanji: string;
  kana: string;
  romaji: string;
  meaning: string;
  group: VerbGroup;
  groupName: string;
  forms: {
    dictionary: { japanese: string; romaji: string; label: string };
    masu: { japanese: string; romaji: string; label: string };
    masuNegative: { japanese: string; romaji: string; label: string };
    masuPast: { japanese: string; romaji: string; label: string };
    nai: { japanese: string; romaji: string; label: string };
    ta: { japanese: string; romaji: string; label: string };
    te: { japanese: string; romaji: string; label: string };
  };
  conjugationRule: string;
  exampleSentence: {
    japanese: string;
    romaji: string;
    translation: string;
  };
}
