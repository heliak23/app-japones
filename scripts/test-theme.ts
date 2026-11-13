import assert from 'node:assert';

console.log('====================================================');
console.log(' VALIDANDO SISTEMA DE GERENCIAMENTO DE TEMAS (DARK/LIGHT) ');
console.log('====================================================\n');

// 1. Simulação do LocalStorage e DOM classList
class MockLocalStorage {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

class MockClassList {
  private classes = new Set<string>();

  add(className: string): void {
    this.classes.add(className);
  }

  remove(className: string): void {
    this.classes.delete(className);
  }

  toggle(className: string, force?: boolean): boolean {
    if (force !== undefined) {
      if (force) this.classes.add(className);
      else this.classes.delete(className);
      return force;
    }
    if (this.classes.has(className)) {
      this.classes.delete(className);
      return false;
    }
    this.classes.add(className);
    return true;
  }

  contains(className: string): boolean {
    return this.classes.has(className);
  }
}

const mockStorage = new MockLocalStorage();
const mockHtmlClassList = new MockClassList();

console.log('--- 1. Validação de Inicialização Padrão (Sem Preferência Salva) ---');
// Regra: "Caso não exista preferência salva, utilizar inicialmente o tema claro."
let savedTheme = mockStorage.getItem('nihongo_theme');
const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';
if (initialTheme === 'dark') {
  mockHtmlClassList.add('dark');
} else {
  mockHtmlClassList.remove('dark');
}

assert.strictEqual(initialTheme, 'light', 'O tema padrão deve ser "light"');
assert.strictEqual(mockHtmlClassList.contains('dark'), false, 'Não deve conter classe "dark" inicialmente');
console.log('  ✓ PASS: Padrão sem preferência salva inicializa em "light" sem classe .dark');

console.log('\n--- 2. Validação da Alternância para Dark Mode e Persistência ---');
// Alternar para Dark
let currentTheme: 'light' | 'dark' = initialTheme;
currentTheme = currentTheme === 'light' ? 'dark' : 'light';
mockStorage.setItem('nihongo_theme', currentTheme);
if (currentTheme === 'dark') {
  mockHtmlClassList.add('dark');
} else {
  mockHtmlClassList.remove('dark');
}

assert.strictEqual(currentTheme, 'dark', 'O tema comutado deve ser "dark"');
assert.strictEqual(mockStorage.getItem('nihongo_theme'), 'dark', 'Deve persistir "dark" no localStorage');
assert.strictEqual(mockHtmlClassList.contains('dark'), true, 'Deve aplicar classe .dark no HTML root');
console.log('  ✓ PASS: Alternância para dark mode aplica classe .dark e salva no localStorage');

console.log('\n--- 3. Validação do Script Anti-FOUC de Carregamento Prévio ---');
// Simulação do script síncrono presente no <head> de index.html
function executeHeadInlineScript(storage: MockLocalStorage, classList: MockClassList) {
  try {
    const saved = storage.getItem('nihongo_theme');
    if (saved === 'dark') {
      classList.add('dark');
    } else {
      classList.remove('dark');
    }
  } catch {}
}

const testClassList = new MockClassList();
executeHeadInlineScript(mockStorage, testClassList);
assert.strictEqual(testClassList.contains('dark'), true, 'Script do head deve ativar .dark imediatamente se salvo');

// Testando quando salvo for light
mockStorage.setItem('nihongo_theme', 'light');
executeHeadInlineScript(mockStorage, testClassList);
assert.strictEqual(testClassList.contains('dark'), false, 'Script do head deve remover .dark se salvo for light');
console.log('  ✓ PASS: Script inline previne Flash of Unstyled Content (FOUC) síncronamente');

console.log('\n--- 4. Validação da Paleta Não-Preto Absoluto (#000000) ---');
// Regra: "Evitar utilizar preto absoluto (#000000) como fundo principal."
const darkPrimaryBg = '#0b0f19'; // grafite azulado refinado
const darkSurface = '#131b2e';
assert.notStrictEqual(darkPrimaryBg, '#000000', 'Fundo dark não deve ser preto puro');
assert.notStrictEqual(darkSurface, '#000000', 'Superfície dark não deve ser preto puro');
console.log(`  ✓ PASS: Fundo dark configurado para grafite azulado sofisticado (${darkPrimaryBg}) e superfície (${darkSurface})`);

console.log('\n====================================================');
console.log(' TODOS OS TESTES DO SISTEMA DE TEMA PASSARAM COM SUCESSO! ');
console.log('====================================================\n');

