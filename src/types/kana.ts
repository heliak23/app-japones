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
  | 'n_final'
  | 'g'
  | 'z'
  | 'd'
  | 'b'
  | 'p'
  | 'yoon_k'
  | 'yoon_s'
  | 'yoon_t'
  | 'yoon_n'
  | 'yoon_h'
  | 'yoon_m'
  | 'yoon_r'
  | 'yoon_g'
  | 'yoon_j'
  | 'yoon_b'
  | 'yoon_p'
  | 'special_v'
  | 'special_f'
  | 'special_w'
  | 'special_other';

export type KanaCategory = 'gojuon' | 'dakuon' | 'yoon' | 'special';

export interface KanaGroupInfo {
  id: KanaGroupId;
  name: string;
  description: string;
  rowLabel: string;
}

export interface KanaCharacter {
  id: string; // Ex: 'hira_a', 'kata_ka', 'hira_kya'
  character: string; // Caractere japonês: 'あ', 'ア', 'きゃ', 'キャ'
  romaji: string; // Romanização padrão: 'a', 'ka', 'kya'
  ptPronunciation: string; // Pronúncia aproximada para falantes de PT-BR
  group: KanaGroupId; // Família / grupo
  alphabet: AlphabetType; // 'hiragana' | 'katakana'
  category?: KanaCategory; // Categoria fonética
  audioUrl?: string; // URL opcional de áudio ou fallback de síntese de voz
  mnemonicNote?: string; // Dica mnemônica em português
}

export interface PhoneticFeatureExample {
  word: string; // Ex: 'がっこう', 'コーヒー'
  romaji: string; // Ex: 'gakkou', 'koohii'
  translation: string; // Ex: 'escola', 'café'
  explanation: string; // Explicação didática
  alphabet: AlphabetType;
}
