export type AlphabetType = 'hiragana' | 'katakana';

export type KanaGroupId = 
  | 'vowels'
  | 'k'
  | 's'
  | 't'
  | 'n'
  | 'h'
  | 'm'
  | 'y'
  | 'r'
  | 'w'
  | 'n_final';

export interface KanaGroupInfo {
  id: KanaGroupId;
  name: string;
  description: string;
  rowLabel: string;
}

export interface KanaCharacter {
  id: string; // Ex: 'hira_a', 'kata_ka'
  character: string; // Caractere japonês: 'あ', 'ア'
  romaji: string; // Romanização padrão: 'a', 'ka'
  ptPronunciation: string; // Pronúncia aproximada para falantes de PT-BR
  group: KanaGroupId; // Família / grupo
  alphabet: AlphabetType; // 'hiragana' | 'katakana'
  audioUrl?: string; // URL opcional de áudio ou fallback de síntese de voz
  mnemonicNote?: string; // Dica mnemônica em português
}

