export interface KanjiExample {
  japanese: string;
  furigana: string;
  romaji: string;
  meaning: string;
  audioText: string;
}

export interface KanjiRadicalInfo {
  symbol: string;
  name: string;
  meaning: string;
  strokes: number;
}

export type KanjiCategory = 
  | 'nature'     // Natureza (Árvore, Água, Sol, Lua, Fogo...)
  | 'numbers'    // Números (Um, Dois, Três, Cem, Mil...)
  | 'people'     // Pessoas e Corpo (Pessoa, Boca, Olho, Mão...)
  | 'society'    // Sociedade e Cidade (Carro, Trem, Empresa, País, Templo...)
  | 'actions'    // Ações e Verbos (Ir, Vir, Comer, Beber, Ver, Falar...)
  | 'book_specials'; // Kanjis e Radicais destacados no livro

export interface KanjiCharacter {
  id: string;
  character: string;
  meaning: string;
  onyomi: string[];  // Leitura sino-japonesa (geralmente em Katakana ou maiúsculas)
  kunyomi: string[]; // Leitura japonesa nativa (geralmente em Hiragana)
  strokes: number;
  category: KanjiCategory;
  categoryLabel: string;
  jlptLevel: 'N5' | 'N4';
  radical: KanjiRadicalInfo;
  decomposedParts?: {
    symbol: string;
    meaning: string;
  }[];
  mnemonicStory: string; // História mnemônica do livro para memorizar
  examples: KanjiExample[];
}

export interface KanjiFilterOptions {
  category: 'all' | KanjiCategory;
  radical: string | 'all';
  searchQuery: string;
}

export interface KanjiProgressState {
  studiedKanjiIds: string[];
  updatedAt: string;
}
