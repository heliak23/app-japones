import type { AlphabetType, KanaCharacter } from '../types/kana';
import type { ExerciseType, ExerciseQuestion } from '../types/exercise';
import { KanaDataset } from '../data/kanaDataset';
import { WanakanaService } from './wanakanaService';


export const ExerciseGenerator = {
  /**
   * Gera uma sessão completa de exercícios com base no tipo e opções
   */
  generateSession(
    type: ExerciseType,
    alphabetFilter: 'all' | AlphabetType = 'all',
    questionCount: number = 10,
    targetCharacters?: KanaCharacter[] // Somente os aprendidos ou conjunto específico
  ): ExerciseQuestion[] {
    let baseCharacters: KanaCharacter[];

    if (targetCharacters && targetCharacters.length > 0) {
      baseCharacters =
        alphabetFilter === 'all'
          ? targetCharacters
          : targetCharacters.filter((c) => c.alphabet === alphabetFilter);
      
      // Se não houver nenhum caractere no filtro de alfabeto escolhido, usa todos os targetCharacters
      if (baseCharacters.length === 0) {
        baseCharacters = targetCharacters;
      }
    } else {
      baseCharacters =
        alphabetFilter === 'all'
          ? KanaDataset.getAll()
          : KanaDataset.getByAlphabet(alphabetFilter);
    }

    // Se a base for menor que a quantidade pedida, permite repetir com variação
    switch (type) {
      case 'recognition':
        return this.generateRecognitionQuestions(baseCharacters, questionCount);
      case 'typing':
        return this.generateTypingQuestions(baseCharacters, questionCount);
      case 'conversion':
        return this.generateConversionQuestions(alphabetFilter, questionCount, baseCharacters);
      case 'alphabet_id':
        return this.generateAlphabetIdQuestions(questionCount, baseCharacters);
      case 'review_random':
      default:
        return this.generateMixedReviewQuestions(baseCharacters, questionCount);
    }
  },

  /**
   * Helper para sortear N itens de uma lista com suporte a repetição se count > pool.length
   */
  pickCharacters(pool: KanaCharacter[], count: number): KanaCharacter[] {
    if (pool.length === 0) return [];
    if (pool.length >= count) {
      return [...pool].sort(() => 0.5 - Math.random()).slice(0, count);
    }
    // Se o usuário aprendeu menos caracteres do que a quantidade de questões (ex: aprendeu 4, pediu 10)
    const result: KanaCharacter[] = [];
    while (result.length < count) {
      const shuffled = [...pool].sort(() => 0.5 - Math.random());
      result.push(...shuffled);
    }
    return result.slice(0, count);
  },

  /**
   * Exercício 1: Reconhecimento de caracteres (Japonês -> Múltipla Escolha Romaji)
   */
  generateRecognitionQuestions(pool: KanaCharacter[], count: number): ExerciseQuestion[] {
    const selected = this.pickCharacters(pool, count);
    const globalPool = KanaDataset.getAll();

    return selected.map((char, index) => {
      // Gera 3 opções distratoras da mesma família ou do dataset geral para garantir 4 opções
      const otherChars = globalPool.filter((c) => c.romaji !== char.romaji);
      const shuffledOthers = [...otherChars].sort(() => 0.5 - Math.random());
      const distractorOptions = shuffledOthers.slice(0, 3).map((c) => c.romaji);

      // Embaralha as 4 opções
      const options = [...distractorOptions, char.romaji].sort(() => 0.5 - Math.random());

      return {
        id: `rec_${index}_${char.id}_${Math.random().toString(36).substring(7)}`,
        type: 'recognition',
        title: 'Reconhecimento de Caractere',
        prompt: `Qual é o Romaji correto deste caractere do ${char.alphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}?`,
        displayTarget: char.character,
        targetAlphabet: char.alphabet,
        options,
        correctAnswer: char.romaji,
        characterInfo: char,
        explanation: `O caractere ${char.character} é lido como "${char.romaji}". Pronúncia aproximada: ${char.ptPronunciation}.`,
      };
    });
  },

  /**
   * Exercício 2: Digitação (Japonês -> Digita Romaji)
   */
  generateTypingQuestions(pool: KanaCharacter[], count: number): ExerciseQuestion[] {
    const selected = this.pickCharacters(pool, count);

    return selected.map((char, index) => {
      // Aceita variações fonéticas comuns (ex: shi/si, tsu/tu, chi/ti, fu/hu)
      const acceptableAnswers = [char.romaji];
      if (char.romaji === 'shi') acceptableAnswers.push('si');
      if (char.romaji === 'chi') acceptableAnswers.push('ti');
      if (char.romaji === 'tsu') acceptableAnswers.push('tu');
      if (char.romaji === 'fu') acceptableAnswers.push('hu');

      return {
        id: `typ_${index}_${char.id}_${Math.random().toString(36).substring(7)}`,
        type: 'typing',
        title: 'Exercício de Digitação',
        prompt: `Digite a romanização (Romaji) correspondente ao caractere abaixo:`,
        displayTarget: char.character,
        targetAlphabet: char.alphabet,
        correctAnswer: char.romaji,
        acceptableAnswers,
        characterInfo: char,
        explanation: `Correto! O caractere ${char.character} corresponde a "${char.romaji}". ${char.ptPronunciation}.`,
      };
    });
  },

  /**
   * Exercício 3: Conversão (Romaji -> Kana com WanaKana)
   */
  generateConversionQuestions(
    alphabetFilter: 'all' | AlphabetType,
    count: number,
    pool?: KanaCharacter[]
  ): ExerciseQuestion[] {
    const questions: ExerciseQuestion[] = [];
    const sourcePool = pool && pool.length > 0 ? pool : KanaDataset.getByAlphabet(alphabetFilter === 'all' ? 'hiragana' : alphabetFilter);
    const selectedChars = this.pickCharacters(sourcePool, count);
    const globalPool = KanaDataset.getAll();

    for (let i = 0; i < selectedChars.length; i++) {
      const char = selectedChars[i];
      const targetAlphabet = char.alphabet;
      const expectedKana = char.character;

      // 4 opções de caracteres
      const distractors = globalPool
        .filter((c) => c.character !== expectedKana && c.alphabet === targetAlphabet)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3)
        .map((c) => c.character);

      const options = [...distractors, expectedKana].sort(() => 0.5 - Math.random());

      questions.push({
        id: `conv_${i}_${char.id}_${Math.random().toString(36).substring(7)}`,
        type: 'conversion',
        title: `Conversão de Romaji para ${targetAlphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}`,
        prompt: `Qual caractere representa o som "${char.romaji}" em ${targetAlphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}?`,
        displayTarget: char.romaji.toUpperCase(),
        targetAlphabet,
        options,
        correctAnswer: expectedKana,
        characterInfo: char,
        explanation: `O Romaji "${char.romaji}" converte-se para o caractere "${char.character}".`,
      });
    }

    return questions;
  },

  /**
   * Exercício 4: Identificação do Alfabeto (Hiragana ou Katakana?)
   */
  generateAlphabetIdQuestions(count: number, pool?: KanaCharacter[]): ExerciseQuestion[] {
    const sourcePool = pool && pool.length > 0 ? pool : KanaDataset.getAll();
    const selected = this.pickCharacters(sourcePool, count);

    return selected.map((char, index) => {
      const isHiragana = WanakanaService.isHiragana(char.character);
      const correctAnswer = isHiragana ? 'Hiragana' : 'Katakana';
      const options = ['Hiragana', 'Katakana'];

      return {
        id: `id_alpha_${index}_${char.id}_${Math.random().toString(36).substring(7)}`,
        type: 'alphabet_id',
        title: 'Identificação de Alfabeto',
        prompt: `A qual sistema de escrita pertence o caractere abaixo?`,
        displayTarget: char.character,
        targetAlphabet: char.alphabet,
        options,
        correctAnswer,
        characterInfo: char,
        explanation: `O caractere ${char.character} (${char.romaji}) pertence ao ${correctAnswer} (${isHiragana ? 'traços curvilíneos' : 'traços retos e angulares'}).`,
      };
    });
  },

  /**
   * Exercício 5: Revisão Aleatória Mista (Multi-formato de fixação)
   */
  generateMixedReviewQuestions(pool: KanaCharacter[], count: number): ExerciseQuestion[] {
    const countRec = Math.max(1, Math.ceil(count * 0.4));
    const countTyp = Math.max(1, Math.floor(count * 0.4));
    const countId = Math.max(1, Math.floor(count * 0.2));

    const q1 = this.generateRecognitionQuestions(pool, countRec);
    const q2 = this.generateTypingQuestions(pool, countTyp);
    const q3 = this.generateAlphabetIdQuestions(countId, pool);

    const combined = [...q1, ...q2, ...q3].sort(() => 0.5 - Math.random());
    return combined.slice(0, count);
  },
};
