import * as wanakana from 'wanakana';
import type { AlphabetType } from '../types/kana';

/**
 * Serviço centralizado para manipulação e validações com WanaKana
 */
export const WanakanaService = {
  toHiragana(text: string): string {
    return wanakana.toHiragana(text.trim());
  },

  toKatakana(text: string): string {
    return wanakana.toKatakana(text.trim());
  },

  toRomaji(text: string): string {
    return wanakana.toRomaji(text.trim());
  },

  isHiragana(text: string): boolean {
    return wanakana.isHiragana(text.trim());
  },

  isKatakana(text: string): boolean {
    return wanakana.isKatakana(text.trim());
  },

  isKana(text: string): boolean {
    return wanakana.isKana(text.trim());
  },

  isRomaji(text: string): boolean {
    return wanakana.isRomaji(text.trim());
  },

  validateRomajiAnswer(userAnswer: string, expectedRomaji: string, acceptableAnswers: string[] = []): boolean {
    const cleanUser = userAnswer.trim().toLowerCase();
    const cleanExpected = expectedRomaji.trim().toLowerCase();
    
    if (cleanUser === cleanExpected) return true;

    if (acceptableAnswers.some(ans => ans.trim().toLowerCase() === cleanUser)) {
      return true;
    }

    const userAsKana = wanakana.toHiragana(cleanUser);
    const expectedAsKana = wanakana.toHiragana(cleanExpected);
    if (userAsKana && expectedAsKana && userAsKana === expectedAsKana) {
      return true;
    }

    return false;
  },

  validateKanaAnswer(userAnswer: string, expectedKana: string, targetAlphabet: AlphabetType): boolean {
    const cleanUser = userAnswer.trim();
    const cleanExpected = expectedKana.trim();

    if (cleanUser === cleanExpected) return true;

    if (targetAlphabet === 'hiragana') {
      const converted = wanakana.toHiragana(cleanUser);
      return converted === cleanExpected;
    } else {
      const converted = wanakana.toKatakana(cleanUser);
      return converted === cleanExpected;
    }
  }
};
