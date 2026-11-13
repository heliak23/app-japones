import type { AlphabetType, KanaCharacter, KanaGroupId } from '../types/kana';
import { HIRAGANA_CHARACTERS } from './hiraganaData';
import { KATAKANA_CHARACTERS } from './katakanaData';
import { KANA_GROUPS, GROUP_MAP } from './kanaGroups';

export const ALL_CHARACTERS: KanaCharacter[] = [
  ...HIRAGANA_CHARACTERS,
  ...KATAKANA_CHARACTERS,
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
    return ALL_CHARACTERS.find((char) => char.id === id);
  },

  getByGroup(groupId: KanaGroupId, alphabet?: AlphabetType): KanaCharacter[] {
    let list = ALL_CHARACTERS.filter((char) => char.group === groupId);
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

  getRandomCharacters(count: number, alphabet?: AlphabetType): KanaCharacter[] {
    const pool = alphabet ? this.getByAlphabet(alphabet) : ALL_CHARACTERS;
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },
};

