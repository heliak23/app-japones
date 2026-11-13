import { HIRAGANA_CHARACTERS } from '../src/data/hiraganaData';
import { KATAKANA_CHARACTERS } from '../src/data/katakanaData';
import { KanaDataset } from '../src/data/kanaDataset';
import { WanakanaService } from '../src/services/wanakanaService';
import { ExerciseGenerator } from '../src/services/exerciseGenerator';
import * as wanakana from 'wanakana';

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, testName: string, errorDetail?: string) {
  if (condition) {
    testsPassed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    testsFailed++;
    console.error(`  ✗ FAIL: ${testName}${errorDetail ? ` -> ${errorDetail}` : ''}`);
  }
}

console.log('====================================================');
console.log(' INICIANDO SUÍTE DE TESTES E VALIDAÇÃO AUTOMATIZADA ');
console.log('====================================================\n');

// 1. Validação do Hiragana
console.log('--- 1. Validação dos 46 Caracteres de Hiragana ---');
assert(HIRAGANA_CHARACTERS.length === 46, 'Total de caracteres do Hiragana deve ser exatamente 46');

const hiraIds = new Set<string>();
let hiraAllValid = true;

for (const char of HIRAGANA_CHARACTERS) {
  if (hiraIds.has(char.id)) {
    hiraAllValid = false;
    assert(false, `ID duplicado no Hiragana: ${char.id}`);
  }
  hiraIds.add(char.id);

  if (!char.character || !char.romaji || !char.ptPronunciation || !char.group || char.alphabet !== 'hiragana') {
    hiraAllValid = false;
    assert(false, `Campos obrigatórios ausentes no caractere ${char.character}`);
  }

  // Verifica se WanaKana reconhece o caractere como Hiragana
  if (!wanakana.isHiragana(char.character)) {
    hiraAllValid = false;
    assert(false, `WanaKana não reconheceu ${char.character} como Hiragana`);
  }
}
if (hiraAllValid) {
  assert(true, 'Todos os 46 Hiraganas possuem IDs únicos, campos preenchidos e são reconhecidos pelo WanaKana');
}

// 2. Validação do Katakana
console.log('\n--- 2. Validação dos 46 Caracteres de Katakana ---');
assert(KATAKANA_CHARACTERS.length === 46, 'Total de caracteres do Katakana deve ser exatamente 46');

const kataIds = new Set<string>();
let kataAllValid = true;

for (const char of KATAKANA_CHARACTERS) {
  if (kataIds.has(char.id)) {
    kataAllValid = false;
    assert(false, `ID duplicado no Katakana: ${char.id}`);
  }
  kataIds.add(char.id);

  if (!char.character || !char.romaji || !char.ptPronunciation || !char.group || char.alphabet !== 'katakana') {
    kataAllValid = false;
    assert(false, `Campos obrigatórios ausentes no caractere Katakana ${char.character}`);
  }

  // Verifica se WanaKana reconhece o caractere como Katakana
  if (!wanakana.isKatakana(char.character)) {
    kataAllValid = false;
    assert(false, `WanaKana não reconheceu ${char.character} como Katakana`);
  }
}
if (kataAllValid) {
  assert(true, 'Todos os 46 Katakanas possuem IDs únicos, campos preenchidos e são reconhecidos pelo WanaKana');
}

// 3. Validação do Dataset Geral (92 caracteres)
console.log('\n--- 3. Validação do Dataset Geral ---');
assert(KanaDataset.getAll().length === 92, 'Total de caracteres agregados deve ser 92 (46 + 46)');
assert(KanaDataset.getGroups().length === 11, 'Total de grupos pedagógicos deve ser 11');

// 4. Testes do WanakanaService e Validações Fonéticas
console.log('\n--- 4. Testes do WanakanaService e Fonética PT-BR ---');
assert(WanakanaService.toHiragana('ka') === 'か', 'WanakanaService.toHiragana("ka") deve ser "か"');
assert(WanakanaService.toKatakana('ka') === 'カ', 'WanakanaService.toKatakana("ka") deve ser "カ"');
assert(WanakanaService.toRomaji('あ') === 'a', 'WanakanaService.toRomaji("あ") deve ser "a"');
assert(WanakanaService.toRomaji('ア') === 'a', 'WanakanaService.toRomaji("ア") deve ser "a"');

// Validação de Digitação com tolerâncias fonéticas para estudantes
assert(WanakanaService.validateRomajiAnswer('shi', 'shi'), 'Validação direta: shi === shi');
assert(WanakanaService.validateRomajiAnswer('si', 'shi', ['shi', 'si']), 'Tolerância fonética: "si" aceito para "shi"');
assert(WanakanaService.validateRomajiAnswer('tu', 'tsu', ['tsu', 'tu']), 'Tolerância fonética: "tu" aceito para "tsu"');
assert(WanakanaService.validateRomajiAnswer('ti', 'chi', ['chi', 'ti']), 'Tolerância fonética: "ti" aceito para "chi"');
assert(WanakanaService.validateRomajiAnswer('hu', 'fu', ['fu', 'hu']), 'Tolerância fonética: "hu" aceito para "fu"');
assert(WanakanaService.validateRomajiAnswer('  SHI  ', 'shi'), 'Tolerância a espaços e maiúsculas: "  SHI  "');
assert(!WanakanaService.validateRomajiAnswer('ko', 'ka'), 'Rejeição correta de resposta errada: "ko" !== "ka"');

// 5. Testes dos Geradores dos 5 Exercícios
console.log('\n--- 5. Testes dos Geradores das 5 Modalidades de Exercícios ---');

// Exercício 1: Reconhecimento
const ex1 = ExerciseGenerator.generateSession('recognition', 'all', 10);
assert(ex1.length === 10, 'Exercício 1: deve gerar exatamente 10 questões');
const ex1Valid = ex1.every((q) => q.options && q.options.length === 4 && q.options.includes(q.correctAnswer));
assert(ex1Valid, 'Exercício 1: cada questão possui 4 opções e a resposta correta está entre elas');

// Exercício 2: Digitação
const ex2 = ExerciseGenerator.generateSession('typing', 'hiragana', 10);
assert(ex2.length === 10, 'Exercício 2: deve gerar 10 questões de digitação');
const ex2Valid = ex2.every((q) => q.type === 'typing' && q.correctAnswer && q.displayTarget);
assert(ex2Valid, 'Exercício 2: todas as questões possuem alvo e resposta correta para digitação');

// Exercício 3: Conversão
const ex3 = ExerciseGenerator.generateSession('conversion', 'katakana', 8);
assert(ex3.length === 8, 'Exercício 3: deve gerar 8 questões de conversão');
const ex3Valid = ex3.every((q) => q.type === 'conversion' && q.correctAnswer);
assert(ex3Valid, 'Exercício 3: todas as questões de conversão são válidas');

// Exercício 4: Identificação do Alfabeto
const ex4 = ExerciseGenerator.generateSession('alphabet_id', 'all', 10);
assert(ex4.length === 10, 'Exercício 4: deve gerar 10 questões de identificação');
const ex4Valid = ex4.every(
  (q) => q.options && q.options.includes('Hiragana') && q.options.includes('Katakana')
);
assert(ex4Valid, 'Exercício 4: todas as questões possuem as opções Hiragana e Katakana');

// Exercício 5: Revisão Aleatória Mista
const ex5 = ExerciseGenerator.generateSession('review_random', 'all', 15);
assert(ex5.length === 15, 'Exercício 5: deve gerar 15 questões na revisão aleatória mista');

// 6. Testes do Escopo: Somente caracteres que aprendi
console.log('\n--- 6. Testes de Exercícios Restritos a Caracteres Aprendidos ---');
const sampleLearnedChars = [
  KanaDataset.getById('hira_a')!,
  KanaDataset.getById('hira_i')!,
  KanaDataset.getById('hira_u')!,
];

const learnedRecognition = ExerciseGenerator.generateSession(
  'recognition',
  'hiragana',
  6,
  sampleLearnedChars
);
assert(learnedRecognition.length === 6, 'Gera 6 questões com suporte a repetição para 3 caracteres aprendidos');
const allQuestionsFromLearned = learnedRecognition.every((q) =>
  ['a', 'i', 'u'].includes(q.correctAnswer)
);
assert(
  allQuestionsFromLearned,
  'Todas as perguntas geradas pertencem estritamente aos caracteres aprendidos (a, i, u)'
);

const learnedTyping = ExerciseGenerator.generateSession(
  'typing',
  'hiragana',
  5,
  sampleLearnedChars
);
const allTypingFromLearned = learnedTyping.every((q) =>
  ['a', 'i', 'u'].includes(q.correctAnswer)
);
assert(
  allTypingFromLearned,
  'Exercício de digitação utiliza exclusivamente os caracteres aprendidos'
);

// Resumo Final
console.log('\n====================================================');
console.log(` RESULTADO: ${testsPassed} PASSOU, ${testsFailed} FALHOU`);
console.log('====================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

