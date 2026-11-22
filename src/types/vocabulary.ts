import type { RubyFragment } from './phrase';

export type VocabularyCategory =
  | 'greetings'    // Saudações & Cortesia (Apostila 2 / Diálogos)
  | 'daily_life'   // Cotidiano, Cidade & Escola (Apostila 1)
  | 'people'       // Pessoas, Família & Pronomes (Apostila 1 e 2)
  | 'food_drink'   // Comida & Bebida (Apostila 1)
  | 'nature_time'  // Natureza, Tempo & Calendário (Apostila 1 / TUFS)
  | 'verbs'        // Verbos Fundamentais de Ação (Apostila 1)
  | 'adjectives'   // Adjetivos & Sentimentos (Apostila 1)
  | 'kosoado'      // Demonstrativos Ko-So-A-Do (Apostila 2)
  | 'katakana';    // Palavras Estrangeiras (Gairaigo) & Sons Modernos (Apostila 1)

export interface ExampleSentence {
  japanese: string;
  furiganaFragments: RubyFragment[];
  romaji: string;
  meaning: string;
  audioText: string;
}

export interface VocabularyWord {
  id: string;
  kanji: string;             // Palavra com kanji (ou kana caso mais comum)
  kana: string;              // Leitura fonética integral em Hiragana ou Katakana
  romaji: string;            // Romanização oficial
  meaning: string;           // Significado em Português (PT-BR)
  category: VocabularyCategory;
  categoryLabel: string;
  jlptLevel: 'N5' | 'N4';
  source: string;            // Ex: "Apostila 1", "Apostila 2", "Tadoku"
  audioText: string;         // Texto enviado para Web Speech API (ja-JP)
  exampleSentence: ExampleSentence;
  notes?: string;            // Dica cultural, fonética ou macete de memorização
}

export interface VocabularyProgress {
  learnedWordIds: string[];
  bookmarkedWordIds: string[];
  totalQuizzesCompleted: number;
  totalCorrect: number;
  totalQuestions: number;
  lastStudiedAt: string | null;
}

export type WordQuizMode = 'meaning_to_jp' | 'jp_to_meaning' | 'listening' | 'typing';

export interface WordQuizQuestion {
  id: string;
  word: VocabularyWord;
  mode: WordQuizMode;
  prompt: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}
