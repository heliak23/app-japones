import type { AlphabetType, KanaCharacter, KanaGroupId, PhoneticFeatureExample } from '../types/kana';
import { HIRAGANA_CHARACTERS } from './hiraganaData';
import { KATAKANA_CHARACTERS } from './katakanaData';
import { KANA_GROUPS, GROUP_MAP } from './kanaGroups';
import {
  YOON_HIRAGANA_CHARACTERS,
  YOON_KATAKANA_CHARACTERS,
  SPECIAL_KATAKANA_CHARACTERS,
  SOKUON_EXAMPLES,
  CHOONPU_EXAMPLES,
  YOON_ROWS,
  type YoonGridRow,
} from './yoonData';

export const ALL_CHARACTERS: KanaCharacter[] = [
  ...HIRAGANA_CHARACTERS,
  ...KATAKANA_CHARACTERS,
];

export const EXPANDED_CHARACTERS: KanaCharacter[] = [
  ...ALL_CHARACTERS,
  ...YOON_HIRAGANA_CHARACTERS,
  ...YOON_KATAKANA_CHARACTERS,
  ...SPECIAL_KATAKANA_CHARACTERS,
];

export const KanaDataset = {
  getHiragana(): KanaCharacter[] {
    return HIRAGANA_CHARACTERS;
  },

  getKatakana(): KanaCharacter[] {
    return KATAKANA_CHARACTERS;
  },

  getAll(): KanaCharacter[] {
    return ALL_CHARACTERS;
  },

  getByAlphabet(alphabet: AlphabetType): KanaCharacter[] {
    return alphabet === 'hiragana' ? HIRAGANA_CHARACTERS : KATAKANA_CHARACTERS;
  },

  getById(id: string): KanaCharacter | undefined {
    return EXPANDED_CHARACTERS.find((char) => char.id === id);
  },

  getByGroup(groupId: KanaGroupId, alphabet?: AlphabetType): KanaCharacter[] {
    let list = EXPANDED_CHARACTERS.filter((char) => char.group === groupId);
    if (alphabet) {
      list = list.filter((char) => char.alphabet === alphabet);
    }
    return list;
  },

  getGroups() {
    return KANA_GROUPS;
  },

  getGroupInfo(groupId: KanaGroupId) {
    return GROUP_MAP[groupId];
  },

  // -----------------------------------------------------------
  // Extensões Yōon (ようおん - 33 Combinações)
  // -----------------------------------------------------------
  getYoonHiragana(): KanaCharacter[] {
    return YOON_HIRAGANA_CHARACTERS;
  },

  getYoonKatakana(): KanaCharacter[] {
    return YOON_KATAKANA_CHARACTERS;
  },

  getYoonByAlphabet(alphabet: AlphabetType): KanaCharacter[] {
    return alphabet === 'hiragana' ? YOON_HIRAGANA_CHARACTERS : YOON_KATAKANA_CHARACTERS;
  },

  getYoonRows(): YoonGridRow[] {
    return YOON_ROWS;
  },

  // -----------------------------------------------------------
  // Katakana Sons Especiais Modernos (19 caracteres)
  // -----------------------------------------------------------
  getSpecialKatakana(): KanaCharacter[] {
    return SPECIAL_KATAKANA_CHARACTERS;
  },

  // -----------------------------------------------------------
  // Exemplos Fonéticos (Sokuon e Prolongamento Chōonpu)
  // -----------------------------------------------------------
  getSokuonExamples(alphabet?: AlphabetType): PhoneticFeatureExample[] {
    if (alphabet) {
      return SOKUON_EXAMPLES.filter((ex) => ex.alphabet === alphabet);
    }
    return SOKUON_EXAMPLES;
  },

  getChoonpuExamples(): PhoneticFeatureExample[] {
    return CHOONPU_EXAMPLES;
  },

  getRandomCharacters(count: number, alphabet?: AlphabetType): KanaCharacter[] {
    const pool = alphabet ? this.getByAlphabet(alphabet) : ALL_CHARACTERS;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
};
