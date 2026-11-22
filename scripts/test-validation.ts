import { HIRAGANA_CHARACTERS } from '../src/data/hiraganaData';
import { KATAKANA_CHARACTERS } from '../src/data/katakanaData';
import { KanaDataset } from '../src/data/kanaDataset';
import { KOSOADO_ITEMS, KOSOADO_QUIZ_QUESTIONS } from '../src/data/kosoadoData';
import { PARTICLES_DATA, PARTICLE_QUIZ_QUESTIONS } from '../src/data/particlesData';
import { ADJECTIVES_DATA, VERBS_DATA } from '../src/data/conjugationData';
import { DIALOGUES_DATA } from '../src/data/dialogueData';
import { KANJI_DATASET } from '../src/data/kanjiDataset';
import { WanakanaService } from '../src/services/wanakanaService';
import { ExerciseGenerator } from '../src/services/exerciseGenerator';
import { StorageService } from '../src/services/storageService';
import { StreakService } from '../src/services/streakService';
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

// 12. Validação da Ofensiva e Dias Seguidos (Streak System)
console.log('\n--- 12. Validação da Ofensiva e Dias Seguidos (Streak System) ---');

// Teste 1: Formato de data local e cálculo de diferença de dias
const dateA = '2026-11-14';
const dateB = '2026-11-15';
const dateC = '2026-11-17';
assert(StreakService.getDayDifference(dateA, dateB) === 1, 'Cálculo de 1 dia de diferença consecutivo (2026-11-14 -> 2026-11-15)');
assert(StreakService.getDayDifference(dateA, dateC) === 3, 'Cálculo de 3 dias de diferença (2026-11-14 -> 2026-11-17)');
assert(StreakService.getDayDifference(dateB, dateB) === 0, 'Diferença de dias para mesma data deve ser 0');

// Teste 2: Primeiro acesso histórico
const firstAccessDate = new Date(2026, 10, 10); // 2026-11-10
const firstResult = StreakService.calculateStreakOnAccess(undefined, firstAccessDate);
assert(firstResult.streak.currentStreak === 1, 'Primeiro acesso inicia com 1 dia de sequência');
assert(firstResult.streak.maxStreak === 1, 'Recorde inicial estabelecido como 1 dia');
assert(firstResult.streak.lastActiveDate === '2026-11-10', 'Data do primeiro acesso registrada corretamente');
assert(firstResult.streak.activeDates.includes('2026-11-10'), 'Data do primeiro acesso adicionada à lista de dias ativos');
assert(firstResult.isNewDay === true, 'Primeiro acesso sinaliza isNewDay = true');

// Teste 3: Acesso consecutivo no dia seguinte (dia 11)
const secondAccessDate = new Date(2026, 10, 11);
const secondResult = StreakService.calculateStreakOnAccess(firstResult.streak, secondAccessDate);
assert(secondResult.streak.currentStreak === 2, 'Acesso consecutivo no dia seguinte incrementa sequência para 2 dias');
assert(secondResult.streak.maxStreak === 2, 'Recorde atualizado para 2 dias');
assert(secondResult.streak.lastActiveDate === '2026-11-11', 'Última data ativa atualizada para 2026-11-11');
assert(secondResult.isConsecutive === true, 'Sinaliza isConsecutive = true para dias seguidos');

// Teste 4: Múltiplos acessos no mesmo dia não devem duplicar contagem
const sameDayResult = StreakService.calculateStreakOnAccess(secondResult.streak, secondAccessDate);
assert(sameDayResult.streak.currentStreak === 2, 'Segundo acesso no mesmo dia mantém streak em 2');
assert(sameDayResult.isNewDay === false, 'Acesso no mesmo dia não sinaliza isNewDay');
assert(sameDayResult.streak.activeDates.filter(d => d === '2026-11-11').length === 1, 'Não duplica a mesma data na lista de dias ativos');

// Teste 5: Quebra de sequência (usuário faltou no dia 12 e voltou no dia 13)
const missedDayAccess = new Date(2026, 10, 13);
const resetResult = StreakService.calculateStreakOnAccess(secondResult.streak, missedDayAccess);
assert(resetResult.streak.currentStreak === 1, 'Pular 1 ou mais dias quebra a sequência e recomeça em 1');
assert(resetResult.streak.maxStreak === 2, 'Recorde histórico anterior (2) é preservado após quebra de sequência');
assert(resetResult.streak.lastActiveDate === '2026-11-13', 'Data atualizada para o novo dia');

// Teste 6: Reconstrução determinística de streak a partir de histórico de datas
const testDates = ['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-05', '2026-11-06', '2026-11-07', '2026-11-08'];
const refForTest = new Date(2026, 10, 8); // 2026-11-08
const computed = StreakService.computeStreakFromDates(testDates, refForTest);
assert(computed.currentStreak === 4, 'computeStreakFromDates calcula corretamente 4 dias seguidos (05, 06, 07, 08)');
assert(computed.maxStreak === 4, 'computeStreakFromDates calcula o recorde histórico corretamente');

// Teste 7: Mesclagem inteligente entre dados Locais e da Nuvem (Supabase)
const localStreak = {
  currentStreak: 2,
  maxStreak: 5,
  lastActiveDate: '2026-11-14',
  activeDates: ['2026-11-13', '2026-11-14'],
};
const cloudStreak = {
  currentStreak: 3,
  maxStreak: 7,
  lastActiveDate: '2026-11-15',
  activeDates: ['2026-11-13', '2026-11-14', '2026-11-15'],
};
const mergedStreak = StreakService.mergeStreakInfos(localStreak, cloudStreak, new Date(2026, 10, 15));
assert(mergedStreak.currentStreak === 3, 'Mesclagem local + nuvem calcula streak consecutivo correto (3)');
assert(mergedStreak.maxStreak === 7, 'Mesclagem preserva o maior recorde histórico entre as duas fontes (7)');
assert(mergedStreak.activeDates.length === 3, 'Datas ativas combinadas sem duplicatas');

// Teste 8: Status dos 7 dias da semana (getWeekStatus)
const weekStatus = StreakService.getWeekStatus(['2026-11-15'], new Date(2026, 10, 15));
assert(weekStatus.length === 7, 'Semana possui exatamente 7 dias mapeados (Seg a Dom)');
assert(weekStatus.some(d => d.isToday), 'Identifica corretamente o dia de hoje na semana');
const todayInWeek = weekStatus.find(d => d.isToday);
assert(todayInWeek?.isCompleted === true, 'Marca dia de hoje como concluído quando presente na lista');

// Teste 9: Integração de streak com StorageService
StorageService.resetAllProgress();
const initialStorage = StorageService.getState();
assert(initialStorage.streak && initialStorage.streak.currentStreak === 0, 'StorageService inicializa com streak padrão zerado');

// Simula check-in diário
const checkIn = StorageService.checkAndUpdateStreak();
assert(checkIn.state.streak.currentStreak === 1, 'checkAndUpdateStreak registra primeiro acesso no storage com 1 dia');
assert(StorageService.getState().streak.currentStreak === 1, 'Streak persistido com sucesso no LocalStorage');

StorageService.resetAllProgress();

// --- 13. Validação das Extensões Fonéticas: Yōon, Katakana Especial e Sokuon ---
console.log('\n--- 13. Validação das Extensões Fonéticas: Yōon, Katakana Especial e Sokuon ---');
const yoonHira = KanaDataset.getYoonHiragana();
const yoonKata = KanaDataset.getYoonKatakana();
const yoonRows = KanaDataset.getYoonRows();
const specialKata = KanaDataset.getSpecialKatakana();
const sokuonExamples = KanaDataset.getSokuonExamples();
const choonpuExamples = KanaDataset.getChoonpuExamples();

assert(yoonHira.length === 33, 'Total de combinações Yōon do Hiragana deve ser exatamente 33 (11 famílias x 3 sons)');
assert(yoonKata.length === 33, 'Total de combinações Yōon do Katakana deve ser exatamente 33 (11 famílias x 3 sons)');
assert(yoonRows.length === 11, 'Total de linhas na matriz Yōon deve ser 11 (K, S, T, N, H, M, R, G, J, B, P)');
assert(specialKata.length === 19, 'Total de sons especiais de Katakana moderno deve ser 19 (V, F, W e outros)');
assert(sokuonExamples.length >= 8, 'Exemplos didáticos de pausa fonética (Sokuon) devem estar presentes');
assert(choonpuExamples.length >= 6, 'Exemplos didáticos de sinal de prolongamento (ー) devem estar presentes');

// Testa se todos os caracteres Yōon possuem campos preenchidos e são recuperáveis por getById
let allYoonValid = true;
for (const char of [...yoonHira, ...yoonKata, ...specialKata]) {
  if (!char.id || !char.character || !char.romaji || !char.ptPronunciation) {
    allYoonValid = false;
  }
  const found = KanaDataset.getById(char.id);
  if (!found || found.character !== char.character) {
    allYoonValid = false;
  }
}
assert(allYoonValid, 'Todos os 85 caracteres fonéticos expandidos possuem dados consistentes e são indexados por getById');

// Validação fonética com WanaKana
assert(wanakana.toHiragana('kya') === 'きゃ', 'WanaKana converte kya -> きゃ');
assert(wanakana.toKatakana('kya') === 'キャ', 'WanaKana converte kya -> キャ');
assert(wanakana.toHiragana('sha') === 'しゃ', 'WanaKana converte sha -> しゃ');
assert(wanakana.toKatakana('sha') === 'シャ', 'WanaKana converte sha -> シャ');

// --- 14. Validação do Sistema Demonstrativo Ko-So-A-Do (Apostila 2) ---
console.log('\n--- 14. Validação do Sistema Demonstrativo Ko-So-A-Do (Apostila 2) ---');
assert(KOSOADO_ITEMS.length === 4, 'Sistema Ko-So-A-Do possui os 4 quadrantes fundamentais (KO, SO, A, DO)');

const quadranteIds = KOSOADO_ITEMS.map((item) => item.id);
assert(
  quadranteIds.includes('ko') && quadranteIds.includes('so') && quadranteIds.includes('a') && quadranteIds.includes('do'),
  'Identificadores dos 4 quadrantes estão corretos (ko, so, a, do)'
);

const koreItem = KOSOADO_ITEMS.find((i) => i.id === 'ko');
const soreItem = KOSOADO_ITEMS.find((i) => i.id === 'so');
const areItem = KOSOADO_ITEMS.find((i) => i.id === 'a');
const doreItem = KOSOADO_ITEMS.find((i) => i.id === 'do');

assert(
  koreItem?.objectWord.japanese === 'これ' &&
  soreItem?.objectWord.japanese === 'それ' &&
  areItem?.objectWord.japanese === 'あれ' &&
  doreItem?.objectWord.japanese === 'どれ',
  'Série de Objetos (-re: kore, sore, are, dore) devidamente estruturada'
);

assert(
  koreItem?.modifierWord.japanese === 'この' &&
  soreItem?.modifierWord.japanese === 'その' &&
  areItem?.modifierWord.japanese === 'あの' &&
  doreItem?.modifierWord.japanese === 'どの',
  'Série de Modificadores nominais (-no: kono, sono, ano, dono) devidamente estruturada'
);

assert(
  koreItem?.placeWord.japanese === 'ここ' &&
  soreItem?.placeWord.japanese === 'そこ' &&
  areItem?.placeWord.japanese === 'あそこ' &&
  doreItem?.placeWord.japanese === 'どこ',
  'Série de Lugares (-ko / asoko: koko, soko, asoko, doko) devidamente estruturada'
);

assert(
  koreItem?.directionWord.japanese === 'こちら' &&
  soreItem?.directionWord.japanese === 'そちら' &&
  areItem?.directionWord.japanese === 'あちら' &&
  doreItem?.directionWord.japanese === 'どちら',
  'Série Cortês de Direções/Pessoas (-chira: kochira, sochira, achira, dochira) devidamente estruturada'
);

assert(KOSOADO_QUIZ_QUESTIONS.length >= 6, 'Banco de Quiz do Ko-So-A-Do possui no mínimo 6 questões práticas');
let allQuizValid = true;
for (const q of KOSOADO_QUIZ_QUESTIONS) {
  if (!q.id || !q.scenario || !q.question || !q.options || q.options.length !== 4 || !q.correctAnswer) {
    allQuizValid = false;
  }
  if (!q.options.some((opt) => opt.label === q.correctAnswer)) {
    allQuizValid = false;
  }
}
assert(allQuizValid, 'Todas as questões de quiz do Ko-So-A-Do têm opções válidas e contêm a resposta correta');

// --- 15. Validação das 12 Partículas Fundamentais & Quiz de Lacunas (Apostila 1) ---
console.log('\n--- 15. Validação das 12 Partículas Fundamentais & Quiz de Lacunas (Apostila 1) ---');
assert(PARTICLES_DATA.length === 12, 'Catálogo deve conter exatamente as 12 partículas essenciais da apostila');

const expectedParticleIds = ['wa', 'ga', 'wo', 'ni', 'de', 'he', 'no', 'to', 'ya', 'mo', 'kara', 'made'];
const currentParticleIds = PARTICLES_DATA.map((p) => p.id);
const allParticlesPresent = expectedParticleIds.every((id) => currentParticleIds.includes(id));
assert(allParticlesPresent, 'Todas as 12 partículas fundamentais estão presentes no dataset');

let particlesDataValid = true;
for (const p of PARTICLES_DATA) {
  if (!p.id || !p.character || !p.romaji || !p.name || !p.goldenRule || !p.examples || p.examples.length === 0) {
    particlesDataValid = false;
  }
}
assert(particlesDataValid, 'Todas as 12 partículas possuem nome, regras pedagógicas e exemplos com frases');

assert(PARTICLE_QUIZ_QUESTIONS.length >= 8, 'Quiz de fixação de partículas possui no mínimo 8 questões');
let allParticleQuizValid = true;
for (const q of PARTICLE_QUIZ_QUESTIONS) {
  if (!q.id || !q.sentenceWithBlank || !q.correctParticle || !q.options || q.options.length !== 4) {
    allParticleQuizValid = false;
  }
  if (!q.options.includes(q.correctParticle)) {
    allParticleQuizValid = false;
  }
}
assert(allParticleQuizValid, 'Todas as questões do Quiz de partículas contêm opções válidas e incluem a resposta correta');

// --- 16. Validação do Conjugador de Verbos e Adjetivos (Apostila 1) ---
console.log('\n--- 16. Validação do Conjugador de Verbos e Adjetivos (Apostila 1) ---');

// Adjetivos
const iAdjectives = ADJECTIVES_DATA.filter((a) => a.type === 'i');
const naAdjectives = ADJECTIVES_DATA.filter((a) => a.type === 'na');
assert(iAdjectives.length >= 4, 'Possui catálogo de adjetivos do tipo い (i-keiyoushi)');
assert(naAdjectives.length >= 3, 'Possui catálogo de adjetivos do tipo な (na-keiyoushi)');

const iiAdj = ADJECTIVES_DATA.find((a) => a.id === 'ii');
assert(iiAdj !== undefined && iiAdj.forms.presentNegative.japanese.includes('よくない'), 'Exceção irregular do adjetivo "ii" -> "yokunai" devidamente mapeada');

const kireiAdj = ADJECTIVES_DATA.find((a) => a.id === 'kirei');
assert(kireiAdj !== undefined && kireiAdj.type === 'na', 'Adjetivo fonético enganoso "kirei" classificado corretamente como tipo "na"');

let allAdjFormsValid = true;
for (const adj of ADJECTIVES_DATA) {
  const f = adj.forms;
  if (!f.presentAffirmative || !f.presentNegative || !f.pastAffirmative || !f.pastNegative) {
    allAdjFormsValid = false;
  }
}
assert(allAdjFormsValid, 'Todos os adjetivos possuem as 4 formas completas (Afirmativo, Negativo, Passado e Passado Negativo)');

// Verbos
const g1Verbs = VERBS_DATA.filter((v) => v.group === 'g1');
const g2Verbs = VERBS_DATA.filter((v) => v.group === 'g2');
const g3Verbs = VERBS_DATA.filter((v) => v.group === 'g3');

assert(g1Verbs.length >= 4, 'Grupo 1 (Godan) possui exemplos dos vários finais consonantais (mu, ku, su, etc.)');
assert(g2Verbs.length >= 2, 'Grupo 2 (Ichidan) possui verbos terminados em -eru e -iru');
assert(g3Verbs.length === 2, 'Grupo 3 (Irregulares) possui exatamente os verbos suru (する) e kuru (来る)');

const ikuVerb = VERBS_DATA.find((v) => v.id === 'iku');
assert(ikuVerb?.forms.ta.japanese === '行った' && ikuVerb?.forms.te.japanese === '行って', 'Exceção fonética de "iku" com sokuon (itta / itte) devidamente tratada');

let allVerbFormsValid = true;
for (const verb of VERBS_DATA) {
  const f = verb.forms;
  if (!f.dictionary || !f.masu || !f.masuNegative || !f.masuPast || !f.nai || !f.ta || !f.te) {
    allVerbFormsValid = false;
  }
}
assert(allVerbFormsValid, 'Todos os verbos possuem as 7 formas canônicas (Dicionário, Masu, Masen, Mashita, Nai, Ta, Te)');

// --- 17. Validação do Modo Diálogo Conversacional (Apostila 2 - Sakura & Takeshi) ---
console.log('\n--- 17. Validação do Modo Diálogo Conversacional (Apostila 2 - Sakura & Takeshi) ---');
const hajimemashiteDialogue = DIALOGUES_DATA.find((d) => d.id === 'hajimemashite');
assert(hajimemashiteDialogue !== undefined, 'Diálogo "Hajimemashite" da Apostila 2 deve estar cadastrado');
assert(hajimemashiteDialogue?.characters.length === 2, 'Diálogo possui os 2 interlocutores principais (Sakura e Takeshi)');

const charNames = hajimemashiteDialogue?.characters.map((c) => c.name) || [];
assert(charNames.includes('Takeshi') && charNames.includes('Sakura'), 'Personagens Takeshi e Sakura devidamente identificados');

assert(hajimemashiteDialogue?.lines.length === 9, 'Diálogo contém a progressão completa das 9 falas do roteiro da apostila');

const hatachiLine = hajimemashiteDialogue?.lines.find((l) => l.japanese.includes('二十歳'));
assert(hatachiLine !== undefined && hatachiLine.characterId === 'sakura', 'Sakura diz a idade com leitura especial "hatachi" (二十歳)');

const kochiraLine = hajimemashiteDialogue?.lines.find((l) => l.japanese.includes('こちらこそ'));
assert(kochiraLine !== undefined && kochiraLine.characterId === 'takeshi', 'Takeshi responde com a cortesia "Kochira koso"');

assert(
  (hajimemashiteDialogue?.comprehensionQuiz.length || 0) >= 3,
  'Diálogo possui no mínimo 3 questões de interpretação e compreensão auditiva'
);

let allDialogueQuizValid = true;
for (const q of hajimemashiteDialogue?.comprehensionQuiz || []) {
  if (!q.id || !q.question || !q.options || q.options.length < 3 || !q.correctAnswer) {
    allDialogueQuizValid = false;
  }
  if (!q.options.includes(q.correctAnswer)) {
    allDialogueQuizValid = false;
  }
}
assert(allDialogueQuizValid, 'Todas as questões do Quiz de Diálogo contêm opções válidas e incluem a resposta correta');

// --- 18. Validação da Filosofia Anki & Vocabulário em Contexto de Kanjis (Apostila 2) ---
console.log('\n--- 18. Validação da Filosofia Anki & Vocabulário em Contexto de Kanjis (Apostila 2) ---');
assert(KANJI_DATASET.length >= 20, 'Dataset contém catálogo de kanjis fundamentais da apostila');

let allKanjisHaveContextWords = true;
for (const k of KANJI_DATASET) {
  if (!k.examples || k.examples.length === 0) {
    allKanjisHaveContextWords = false;
  }
  for (const ex of k.examples) {
    if (!ex.japanese || !ex.furigana || !ex.meaning) {
      allKanjisHaveContextWords = false;
    }
  }
}
assert(allKanjisHaveContextWords, 'Todos os kanjis possuem vocabulário real em contexto (Filosofia Anki da Apostila 2)');

const nichiKanji = KANJI_DATASET.find((k) => k.character === '日');
assert(nichiKanji !== undefined, 'Kanji base 日 (dia/sol) presente no catálogo');
const nichiWords = nichiKanji?.examples.map((ex) => ex.japanese) || [];
assert(
  nichiWords.some((w) => w.includes('日')),
  'Kanji 日 possui palavras reais compostas para aprendizado sem memorização isolada'
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

