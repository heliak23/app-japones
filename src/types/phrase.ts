export type GrammarTag = 
  | 'noun'        // Substantivo
  | 'particle'    // Partícula (wa, ga, wo, no, to, ya, etc.)
  | 'copula'      // Cópula (desu, da, deshita, etc.)
  | 'adjective_i' // Adjetivo tipo i
  | 'adjective_na'// Adjetivo tipo na
  | 'verb'        // Verbo
  | 'adverb';     // Advérbio / Tempo

export interface RubyFragment {
  kanji: string;
  furigana?: string;
  tag?: GrammarTag;
  isNew?: boolean; // Destaca a palavra que foi adicionada neste passo
}

export interface PhraseStep {
  stepNumber: number;
  title: string;
  fragments: RubyFragment[];
  romaji: string;
  literalMeaning: string; // "Como o japonês pensa"
  naturalMeaning: string; // Tradução natural em português
  explanation: string;    // Explicação didática no estilo do livro
  highlightedPart: string;// Parte adicionada neste passo (ex: "の", "新しい", "これは")
  partTag: GrammarTag;
  audioText: string;      // Texto a ser lido pela síntese de voz (japonês)
}

export interface PhraseVariation {
  label: string;
  type: 'formal_present' | 'informal_present' | 'formal_past' | 'informal_past' | 'formal_neg' | 'informal_neg';
  japanese: string;
  romaji: string;
  meaning: string;
  explanation: string;
}

export interface PhraseQuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export type PhraseQuizType = 'complete_gap' | 'order_blocks' | 'meaning_match';

export interface PhraseQuizQuestion {
  id: string;
  type: PhraseQuizType;
  prompt: string;
  contextJapanese?: string;
  // Para complete_gap ou meaning_match
  options?: PhraseQuizOption[];
  // Para order_blocks
  blocks?: string[];
  correctBlockOrder?: string[];
  explanation: string;
}

export interface PhraseLesson {
  id: string;
  moduleId: string;
  moduleTitle: string;
  moduleOrder: number;
  lessonOrder: number;
  title: string;
  description: string;
  level: 'Iniciante' | 'Básico' | 'Intermediário';
  bookChapter: string;
  keyRule: string;
  steps: PhraseStep[];
  variations?: PhraseVariation[];
  quiz: PhraseQuizQuestion[];
}

export interface PhraseTrackProgress {
  completedLessonIds: string[];
  lastStudiedLessonId: string | null;
  quizScores: Record<string, { attempts: number; score: number; passed: boolean }>;
  updatedAt: string;
}
