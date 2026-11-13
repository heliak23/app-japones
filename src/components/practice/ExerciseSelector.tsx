import React, { useState } from 'react';
import type { AlphabetType } from '../../types/kana';
import type { ExerciseType } from '../../types/exercise';
import {
  Eye,
  Keyboard,
  ArrowLeftRight,
  HelpCircle,
  Brain,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  BookOpen,
  Info,
} from 'lucide-react';

interface ExerciseSelectorProps {
  onStart: (
    type: ExerciseType,
    alphabet: 'all' | AlphabetType,
    count: number,
    onlyStudied: boolean
  ) => void;
  studiedCharacterIds: string[];
  initialType?: ExerciseType;
  onNavigateToStudy?: (alphabet: 'hiragana' | 'katakana') => void;
}

interface ExerciseOption {
  type: ExerciseType;
  title: string;
  tag: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const EXERCISE_OPTIONS: ExerciseOption[] = [
  {
    type: 'recognition',
    title: '1. Reconhecimento de Caracteres',
    tag: 'Múltipla Escolha',
    description: 'Veja o caractere em japonês e identifique a romanização correta entre 4 opções.',
    icon: <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
    color: 'hover:border-indigo-400 dark:hover:border-indigo-500 focus:border-indigo-500',
  },
  {
    type: 'typing',
    title: '2. Exercício de Digitação',
    tag: 'Teclado & Escrita',
    description: 'Veja o caractere e digite seu Romaji no teclado com validação fonética inteligente.',
    icon: <Keyboard className="w-5 h-5 text-brand-600 dark:text-brand-400" />,
    color: 'hover:border-brand-400 dark:hover:border-brand-500 focus:border-brand-500',
  },
  {
    type: 'conversion',
    title: '3. Conversão Romaji ➔ Kana',
    tag: 'WanaKana Integrado',
    description: 'Converta sílabas e caracteres em Romaji para escrita japonesa correta.',
    icon: <ArrowLeftRight className="w-5 h-5 text-amber-600 dark:text-amber-400" />,
    color: 'hover:border-amber-400 dark:hover:border-amber-500 focus:border-amber-500',
  },
  {
    type: 'alphabet_id',
    title: '4. Identificação de Alfabeto',
    tag: 'Hiragana vs Katakana',
    description: 'Diferencie instantaneamente se o caractere apresentado é Hiragana ou Katakana.',
    icon: <HelpCircle className="w-5 h-5 text-teal-600 dark:text-teal-400" />,
    color: 'hover:border-teal-400 dark:hover:border-teal-500 focus:border-teal-500',
  },
  {
    type: 'review_random',
    title: '5. Revisão Geral Aleatória',
    tag: 'Maratona Mista',
    description: 'Sessão mista combinando reconhecimento, digitação e identificação para fixação definitiva.',
    icon: <Brain className="w-5 h-5 text-purple-600 dark:text-purple-400" />,
    color: 'hover:border-purple-400 dark:hover:border-purple-500 focus:border-purple-500',
  },
];

export const ExerciseSelector: React.FC<ExerciseSelectorProps> = ({
  onStart,
  studiedCharacterIds,
  initialType = 'recognition',
  onNavigateToStudy,
}) => {
  const [selectedType, setSelectedType] = useState<ExerciseType>(initialType);
  const [selectedAlphabet, setSelectedAlphabet] = useState<'all' | AlphabetType>('all');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [scopeMode, setScopeMode] = useState<'only_studied' | 'all'>(
    studiedCharacterIds.length > 0 ? 'only_studied' : 'all'
  );

  // Calcula a quantidade de caracteres estudados para o filtro atual
  const hiraStudiedCount = studiedCharacterIds.filter((id) => id.startsWith('hira_')).length;
  const kataStudiedCount = studiedCharacterIds.filter((id) => id.startsWith('kata_')).length;
  const totalStudiedCount = studiedCharacterIds.length;

  const relevantStudiedCount =
    selectedAlphabet === 'hiragana'
      ? hiraStudiedCount
      : selectedAlphabet === 'katakana'
      ? kataStudiedCount
      : totalStudiedCount;

  const isScopeBlocked = scopeMode === 'only_studied' && relevantStudiedCount === 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isScopeBlocked) return;
    onStart(selectedType, selectedAlphabet, questionCount, scopeMode === 'only_studied');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-12 animate-fadeIn">
      
      {/* Cabeçalho */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/60">
          <Sparkles className="w-3.5 h-3.5" />
          Área de Prática & Treinamento
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Escolha uma Modalidade de Exercício
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto">
          Pratique com feedback imediato em português, correções inteligentes e acompanhamento do seu progresso.
        </p>
      </div>

      {/* Grid de Escolha das 5 Modalidades */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {EXERCISE_OPTIONS.map((opt) => {
          const isSelected = selectedType === opt.type;

          return (
            <div
              key={opt.type}
              onClick={() => setSelectedType(opt.type)}
              className={`cursor-pointer rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 dark:bg-indigo-950/80 text-white border-slate-900 dark:border-indigo-500 shadow-md scale-[1.02]'
                  : `bg-white dark:bg-[#131b2e] text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800 ${opt.color} hover:shadow-sm`
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-white/10 text-white' : 'bg-slate-50 dark:bg-[#182238]'
                    }`}
                  >
                    {opt.icon}
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {opt.tag}
                  </span>
                </div>

                <h3 className="font-bold text-base tracking-tight mb-1">{opt.title}</h3>
                <p className={`text-xs leading-relaxed ${isSelected ? 'text-slate-300 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                  {opt.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100/20 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
                <span>{isSelected ? '✓ Selecionado' : 'Selecionar'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bloco de Configurações da Sessão */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-6 transition-colors">
        <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
          <span>Configurações da Sessão</span>
        </h3>

        {/* 1. SELETOR DE ESCOPO: Somente Aprendidas vs Todas */}
        <div className="bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 space-y-3 transition-colors">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Escopo das Letras / Caracteres
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Opção A: Somente as aprendidas */}
            <div
              onClick={() => setScopeMode('only_studied')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                scopeMode === 'only_studied'
                  ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-200 dark:ring-emerald-900/40'
                  : 'bg-white dark:bg-[#182238] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="mt-0.5">
                <CheckCircle2
                  className={`w-5 h-5 ${
                    scopeMode === 'only_studied' ? 'text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/60' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Somente o que já aprendi
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300">
                    {relevantStudiedCount} letras
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Gera o exercício <strong>exclusivamente</strong> com os caracteres que você marcou como estudados nas tabelas ou flashcards.
                </p>
              </div>
            </div>

            {/* Opção B: Todas as letras */}
            <div
              onClick={() => setScopeMode('all')}
              className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                scopeMode === 'all'
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900/40'
                  : 'bg-white dark:bg-[#182238] border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <div className="mt-0.5">
                <BookOpen
                  className={`w-5 h-5 ${
                    scopeMode === 'all' ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    Todos os caracteres
                  </h4>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    46 ou 92 letras
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Pratique livremente com o alfabeto completo, mesmo os caracteres que você ainda não abriu na tabela.
                </p>
              </div>
            </div>
          </div>

          {/* Alerta se escolheu 'somente aprendidas' mas ainda tem 0 */}
          {isScopeBlocked && (
            <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200 animate-fadeIn">
              <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1.5 flex-1">
                <p className="font-bold">
                  Você ainda não marcou caracteres como estudados {selectedAlphabet !== 'all' ? `no ${selectedAlphabet === 'hiragana' ? 'Hiragana' : 'Katakana'}` : 'ainda'}!
                </p>
                <p className="text-amber-800 dark:text-amber-300">
                  Para praticar somente o que aprendeu, abra primeiro a tabela ou flashcards e clique nos caracteres para marcá-los como estudados, ou alterne para <strong>"Todos os caracteres"</strong> acima.
                </p>
                {onNavigateToStudy && (
                  <div className="pt-1 flex gap-2">
                    <button
                      type="button"
                      onClick={() => onNavigateToStudy(selectedAlphabet === 'katakana' ? 'katakana' : 'hiragana')}
                      className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold transition-colors"
                    >
                      Ir para Tabela de {selectedAlphabet === 'katakana' ? 'Katakana' : 'Hiragana'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setScopeMode('all')}
                      className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#182238] border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200 font-semibold hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors"
                    >
                      Praticar com todos
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 2. Seleção de Alfabeto e Quantidade de Questões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Seletor de Alfabeto Alvo */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Alfabeto a Praticar
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAlphabet('all')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  selectedAlphabet === 'all'
                    ? 'bg-slate-900 dark:bg-slate-700 text-white border-slate-900 dark:border-slate-600'
                    : 'bg-white dark:bg-[#182238] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                Ambos
              </button>
              <button
                type="button"
                onClick={() => setSelectedAlphabet('hiragana')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  selectedAlphabet === 'hiragana'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'bg-white dark:bg-[#182238] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                Hiragana (あ)
              </button>
              <button
                type="button"
                onClick={() => setSelectedAlphabet('katakana')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition-colors ${
                  selectedAlphabet === 'katakana'
                    ? 'bg-amber-600 text-white border-amber-600'
                    : 'bg-white dark:bg-[#182238] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                }`}
              >
                Katakana (ア)
              </button>
            </div>
          </div>

          {/* Quantidade de Questões */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Quantidade de Questões
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[5, 10, 15, 20].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold border transition-colors ${
                    questionCount === count
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500'
                      : 'bg-white dark:bg-[#182238] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  {count} testes
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Botão de Início */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">
            {scopeMode === 'only_studied'
              ? `Exercício focado em suas ${relevantStudiedCount} letras estudadas`
              : 'Exercício abrangendo o alfabeto completo'}
          </p>

          <button
            type="submit"
            disabled={isScopeBlocked}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>Iniciar Sessão com Letras Selecionadas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </form>
  );
};
