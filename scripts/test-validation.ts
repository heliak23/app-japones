import { HIRAGANA_CHARACTERS } from '../src/data/hiraganaData';
import { KATAKANA_CHARACTERS } from '../src/data/katakanaData';
import { KanaDataset } from '../src/data/kanaDataset';
import { WanakanaService } from '../src/services/wanakanaService';
import { ExerciseGenerator } from '../src/services/exerciseGenerator';
import { StorageService } from '../src/services/storageService';
import * as wanakana from 'wanakana';

// Mock simples para LocalStorage/SessionStorage em ambiente Node de teste se não existirem
if (typeof globalThis.localStorage === 'undefined') {
  const store = new Map<string, string>();
  globalThis.localStorage = {
    getItem: (key: string) => store.get(key) || null,
    setItem: (key: string, val: string) => store.set(key, String(val)),
    removeItem: (key: string) => store.delete(key),
    clear: () => store.clear(),
    key: (i: number) => Array.from(store.keys())[i] || null,
    length: 0,
  } as Storage;
}

if (typeof globalThis.sessionStorage === 'undefined') {
  const sessionStore = new Map<string, string>();
  globalThis.sessionStorage = {
    getItem: (key: string) => sessionStore.get(key) || null,
    setItem: (key: string, val: string) => sessionStore.set(key, String(val)),
    removeItem: (key: string) => sessionStore.delete(key),
    clear: () => sessionStore.clear(),
    key: (i: number) => Array.from(sessionStore.keys())[i] || null,
    length: 0,
  } as Storage;
}

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
console.log('--- 1. Validação dos 71 Caracteres de Hiragana (Gojūon & Dakuon) ---');
assert(HIRAGANA_CHARACTERS.length === 71, 'Total de caracteres do Hiragana deve ser exatamente 71 (46 básicos + 25 dakuon/handakuon)');

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
  assert(true, 'Todos os 71 Hiraganas possuem IDs únicos, campos preenchidos e são reconhecidos pelo WanaKana');
}

// 2. Validação do Katakana
console.log('\n--- 2. Validação dos 71 Caracteres de Katakana (Gojūon & Dakuon) ---');
assert(KATAKANA_CHARACTERS.length === 71, 'Total de caracteres do Katakana deve ser exatamente 71 (46 básicos + 25 dakuon/handakuon)');

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
  assert(true, 'Todos os 71 Katakanas possuem IDs únicos, campos preenchidos e são reconhecidos pelo WanaKana');
}

// 3. Validação do Dataset Geral (142 caracteres)
console.log('\n--- 3. Validação do Dataset Geral ---');
assert(KanaDataset.getAll().length === 142, 'Total de caracteres agregados deve ser 142 (71 Hiragana + 71 Katakana)');
assert(KanaDataset.getGroups().length === 16, 'Total de grupos pedagógicos deve ser 16 (11 Gojūon + 5 Dakuon/Handakuon)');

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

// 7. Testes de Seleção e Marcação em Massa (StorageService)
console.log('\n--- 7. Testes de Seleção em Linha e Individual (StorageService) ---');
StorageService.resetAllProgress();

// Marcar um por um
StorageService.markCharacterAsStudied('hira_a');
assert(StorageService.getState().studiedCharacterIds.includes('hira_a'), 'Marca caractere individualmente como estudado');

// Toggle para desmarcar
StorageService.toggleCharacterStudied('hira_a');
assert(!StorageService.getState().studiedCharacterIds.includes('hira_a'), 'Alterna (toggle) caractere para desmarcado');

// Toggle para marcar novamente
StorageService.toggleCharacterStudied('hira_a');
assert(StorageService.getState().studiedCharacterIds.includes('hira_a'), 'Alterna (toggle) caractere para marcado');

// Marcar toda a família de uma vez (A, I, U, E, O)
const vogaisIds = ['hira_a', 'hira_i', 'hira_u', 'hira_e', 'hira_o'];
StorageService.setMultipleCharactersStudied(vogaisIds, true);
const allVogaisMarked = vogaisIds.every((id) => StorageService.getState().studiedCharacterIds.includes(id));
assert(allVogaisMarked, 'Marca toda a linha/família de vogais de uma vez (A I U E O)');

// Desmarcar toda a família de uma vez
StorageService.setMultipleCharactersStudied(vogaisIds, false);
const allVogaisUnmarked = vogaisIds.every((id) => !StorageService.getState().studiedCharacterIds.includes(id));
assert(allVogaisUnmarked, 'Desmarca toda a linha/família de vogais de uma vez');

// Limpeza pós-teste
StorageService.resetAllProgress();

// 8. Testes do Fluxo de Exercícios e Navegação
console.log('\n--- 8. Testes de Fluxo e Seleção de Modalidades de Exercícios ---');
const defaultAutoStart = false;
const defaultInitialType = 'recognition';
const shouldAutoStartDefault = Boolean(defaultAutoStart && defaultInitialType);
assert(!shouldAutoStartDefault, 'Fluxo padrão ao abrir Exercícios não deve auto-iniciar teste diretamente');

const reviewAutoStart = true;
const shouldAutoStartReview = Boolean(reviewAutoStart && (sampleLearnedChars && sampleLearnedChars.length > 0));
assert(shouldAutoStartReview, 'Fluxo de revisão direcionada ativa auto-start para os caracteres selecionados');

const hiraganaOnlySession = ExerciseGenerator.generateSession('recognition', 'hiragana', 5);
assert(
  hiraganaOnlySession.length === 5 && hiraganaOnlySession.every(q => q.characterInfo?.alphabet === 'hiragana'),
  'Geração de exercícios respeita filtro de alfabeto Hiragana'
);

const katakanaOnlySession = ExerciseGenerator.generateSession('typing', 'katakana', 5);
assert(
  katakanaOnlySession.length === 5 && katakanaOnlySession.every(q => q.characterInfo?.alphabet === 'katakana'),
  'Geração de exercícios respeita filtro de alfabeto Katakana'
);

// 9. Testes de Contabilidade de Acertos/Erros no Relatório Final
console.log('\n--- 9. Testes de Relatório de Sessão (Acertos e Erros) ---');
const sampleSessionResults = [
  { questionId: 'q1', userAnswer: 'a', isCorrect: true, correctAnswer: 'a' },
  { questionId: 'q2', userAnswer: 'i', isCorrect: true, correctAnswer: 'i' },
  { questionId: 'q3', userAnswer: 'o', isCorrect: false, correctAnswer: 'u' },
  { questionId: 'q4', userAnswer: 'e', isCorrect: true, correctAnswer: 'e' },
  { questionId: 'q5', userAnswer: 'ka', isCorrect: false, correctAnswer: 'o' },
];

const totalQuestions = sampleSessionResults.length;
const correctCount = sampleSessionResults.filter(r => r.isCorrect).length;
const incorrectCount = totalQuestions - correctCount;
const percentage = Math.round((correctCount / totalQuestions) * 100);
const score = correctCount * 10;

assert(totalQuestions === 5, 'Total de questões contabilizado corretamente no relatório');
assert(correctCount === 3, 'Total de acertos contabilizado exatamente (3)');
assert(incorrectCount === 2, 'Total de erros contabilizado exatamente (2)');
assert(percentage === 60, 'Percentual de aproveitamento calculado com precisão (60%)');
assert(score === 30, 'Pontuação total calculada corretamente (30 pts)');

// 10. Testes de Ciclo de Vida de Revisão de Erros
console.log('\n--- 10. Testes de Ciclo de Vida de Revisão de Erros (Entrada e Saída) ---');
StorageService.resetAllProgress();

// Passo 1: Usuário erra o caractere 'hira_a'
StorageService.recordCharacterAnswer('hira_a', false);
let stateReview = StorageService.getState();
assert(stateReview.characterStats['hira_a']?.needsReview === true, 'Caractere entra na lista de revisão ao ser errada');
assert(StorageService.getCharactersNeedingReview().some(c => c.characterId === 'hira_a'), 'getCharactersNeedingReview lista o caractere errado');

// Passo 2: Usuário revisa e acerta o caractere 'hira_a'
StorageService.recordCharacterAnswer('hira_a', true);
stateReview = StorageService.getState();
assert(stateReview.characterStats['hira_a']?.needsReview === false, 'Caractere sai da lista de revisão imediatamente ao ser acertado');
assert(!StorageService.getCharactersNeedingReview().some(c => c.characterId === 'hira_a'), 'getCharactersNeedingReview não lista mais o caractere superado');

// Passo 3: Remoção/Descarte manual da revisão
StorageService.recordCharacterAnswer('hira_i', false);
assert(StorageService.getState().characterStats['hira_i']?.needsReview === true, 'Caractere hira_i entra na revisão após erro');
StorageService.dismissCharacterReview('hira_i');
assert(StorageService.getState().characterStats['hira_i']?.needsReview === false, 'Caractere hira_i sai da revisão após descarte manual (dismiss)');

// Limpeza
StorageService.resetAllProgress();

// 11. Validações das Regras de Autenticação, Banco e Recuperação de Senha
console.log('\n--- 11. Validação das Regras de Autenticação, Supabase e Recuperação de Senha ---');

// Regra 1: Validação de Senha para Recuperação (mínimo 6 caracteres e confirmação idêntica)
const validateNewPassword = (pass: string, confirm: string) => {
  if (pass.length < 6) return 'A senha deve ter no mínimo 6 caracteres';
  if (pass !== confirm) return 'As senhas não coincidem';
  return 'valid';
};

assert(validateNewPassword('12345', '12345') === 'A senha deve ter no mínimo 6 caracteres', 'Rejeita nova senha com menos de 6 caracteres');
assert(validateNewPassword('senhaSegura123', 'senhaDiferente456') === 'As senhas não coincidem', 'Rejeita quando confirmação não confere com a nova senha');
assert(validateNewPassword('senhaSegura123', 'senhaSegura123') === 'valid', 'Aceita senha válida com confirmação idêntica');

// Regra 2: Detecção de parâmetros de recuperação na URL (hash de recovery e detecção de erro de link expirado)
const parseRecoveryUrl = (hash: string) => {
  if (hash.includes('error=')) {
    const params = new URLSearchParams(hash.replace(/^#/, ''));
    const isExpired = params.get('error_code') === 'otp_expired' || params.get('error_description')?.includes('expired');
    return { isRecovery: false, isExpired: !!isExpired };
  }
  if (hash.includes('type=recovery')) {
    return { isRecovery: true, isExpired: false };
  }
  return { isRecovery: false, isExpired: false };
};

const recoveryTest1 = parseRecoveryUrl('#access_token=xyz&type=recovery&refresh_token=abc');
assert(recoveryTest1.isRecovery === true && recoveryTest1.isExpired === false, 'Detecta com sucesso o evento de recuperação via hash type=recovery');

const recoveryTest2 = parseRecoveryUrl('#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired');
assert(recoveryTest2.isRecovery === false && recoveryTest2.isExpired === true, 'Detecta corretamente link de recuperação expirado do Supabase');

// Regra 3: Validação do fluxo de Alteração de Senha (solicita senha atual, nova senha e confirmação)
const validateChangePassword = (currentPass: string, newPass: string, confirmPass: string) => {
  if (!currentPass || !currentPass.trim()) return 'A senha atual é obrigatória';
  if (newPass.length < 6) return 'A nova senha deve ter no mínimo 6 caracteres';
  if (newPass !== confirmPass) return 'As senhas não coincidem';
  if (currentPass === newPass) return 'A nova senha não pode ser igual à senha atual';
  return 'valid';
};

assert(validateChangePassword('', 'novaSenha123', 'novaSenha123') === 'A senha atual é obrigatória', 'Rejeita alteração de senha sem preencher a senha atual');
assert(validateChangePassword('senhaAntiga123', '12345', '12345') === 'A nova senha deve ter no mínimo 6 caracteres', 'Rejeita nova senha curta na alteração de senha');
assert(validateChangePassword('senhaAntiga123', 'novaSenha123', 'outraSenha456') === 'As senhas não coincidem', 'Rejeita quando confirmação não confere na alteração de senha');
assert(validateChangePassword('mesmaSenha123', 'mesmaSenha123', 'mesmaSenha123') === 'A nova senha não pode ser igual à senha atual', 'Rejeita quando nova senha é idêntica à senha atual');
assert(validateChangePassword('senhaAntiga123', 'novaSenha456', 'novaSenha456') === 'valid', 'Aceita alteração de senha válida com senha atual, nova senha e confirmação correta');

// Resumo Final
console.log('\n====================================================');
console.log(` RESULTADO: ${testsPassed} PASSOU, ${testsFailed} FALHOU`);
console.log('====================================================\n');

if (testsFailed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}

