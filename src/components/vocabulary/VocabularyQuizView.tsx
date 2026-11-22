import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { VocabularyWord, WordQuizMode, WordQuizQuestion } from '../../types/vocabulary';
import { WanakanaService } from '../../services/wanakanaService';
import { VocabularyStorageService } from '../../services/vocabularyStorageService';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  Headphones,
  Keyboard,
  ListFilter,
  Flame,
} from 'lucide-react';

interface VocabularyQuizViewProps {
  words: VocabularyWord[];
  onPlayAudio: (text: string) => void;
  isPlayingAudio?: boolean;
}

export const VocabularyQuizView: React.FC<VocabularyQuizViewProps> = ({
  words,
  onPlayAudio,
  isPlayingAudio = false,
}) => {
  // Configurações do Quiz
  const [selectedMode, setSelectedMode] = useState<WordQuizMode | 'mixed'>('mixed');
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [quizStarted, setQuizStarted] = useState<boolean>(false);

  // Estados da Sessão Ativa
  const [questions, setQuestions] = useState<WordQuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [typingInput, setTypingInput] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [mistakes, setMistakes] = useState<WordQuizQuestion[]>([]);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Gerador de Questões a partir da lista de palavras
  const generateQuestions = useCallback((
    targetWords: VocabularyWord[],
    mode: WordQuizMode | 'mixed',
    count: number
  ): WordQuizQuestion[] => {
    if (targetWords.length === 0) return [];

    const shuffled = [...targetWords].sort(() => Math.random() - 0.5);
    const selectedWords = shuffled.slice(0, Math.min(count, targetWords.length));

    return selectedWords.map((word, idx) => {
      // Determina o modo da questão
      const qMode: WordQuizMode =
        mode === 'mixed'
          ? (['jp_to_meaning', 'listening', 'typing'] as WordQuizMode[])[idx % 3]
          : mode;

      // Gera 3 opções incorretas de distração
      const otherWords = words.filter((w) => w.id !== word.id);
      const distractors = [...otherWords]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map((w) => w.meaning);

      const options = [...distractors, word.meaning].sort(() => Math.random() - 0.5);

      let promptText = '';
      if (qMode === 'listening') {
        promptText = 'Ouça a palavra falada e selecione a tradução correta:';
      } else if (qMode === 'typing') {
        promptText = `Como se pronuncia "${word.meaning}" em japonês?`;
      } else {
        promptText = 'Qual é o significado correto da palavra abaixo?';
      }

      return {
        id: `q_${word.id}_${idx}`,
        word,
        mode: qMode,
        prompt: promptText,
        options: qMode === 'typing' ? undefined : options,
        correctAnswer: qMode === 'typing' ? word.kana : word.meaning,
        explanation: `${word.kanji} (${word.romaji}) significa "${word.meaning}". Exemplo: "${word.exampleSentence.meaning}" (${word.source}).`,
      };
    });
  }, [words]);

  const handleStartQuiz = (customWords?: VocabularyWord[]) => {
    const pool = customWords || words;
    const generated = generateQuestions(pool, selectedMode, questionCount);
    setQuestions(generated);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTypingInput('');
    setIsAnswered(false);
    setIsCorrect(false);
    setScore(0);
    setMistakes([]);
    setIsFinished(false);
    setQuizStarted(true);

    // Se a primeira questão for listening, toca áudio automaticamente
    if (generated.length > 0 && generated[0].mode === 'listening') {
      setTimeout(() => onPlayAudio(generated[0].word.audioText), 200);
    }
  };

  const currentQ = questions[currentIndex];

  // Resposta de Múltipla Escolha
  const handleSelectOption = useCallback((option: string) => {
    if (isAnswered || !currentQ) return;
    setSelectedOption(option);
    setIsAnswered(true);

    const isMatch = option === currentQ.correctAnswer;
    setIsCorrect(isMatch);

    if (isMatch) {
      setScore((prev) => prev + 1);
    } else {
      setMistakes((prev) => [...prev, currentQ]);
    }
  }, [isAnswered, currentQ]);

  // Próxima Questão
  const handleNextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setSelectedOption(null);
      setTypingInput('');
      setIsAnswered(false);
      setIsCorrect(false);

      if (questions[nextIdx].mode === 'listening') {
        setTimeout(() => onPlayAudio(questions[nextIdx].word.audioText), 200);
      }
    } else {
      // Salva progresso final no storage
      const finalScore = score + (isCorrect ? 0 : 0);
      VocabularyStorageService.recordQuizResult(finalScore, questions.length);
      setIsFinished(true);
    }
  }, [currentIndex, questions, score, isCorrect, onPlayAudio]);

  // Foco automático no input de digitação
  useEffect(() => {
    if (quizStarted && currentQ?.mode === 'typing' && !isAnswered && inputRef.current) {
      inputRef.current.focus();
    }
  }, [quizStarted, currentIndex, currentQ, isAnswered]);

  // Teclas de atalho numéricas (1 a 4) e Enter para avançar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!quizStarted || isFinished) return;

      if (isAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNextQuestion();
        return;
      }

      if (!isAnswered && currentQ?.options && ['1', '2', '3', '4'].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        if (currentQ.options[optionIdx]) {
          handleSelectOption(currentQ.options[optionIdx]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [quizStarted, isFinished, isAnswered, currentQ, handleNextQuestion, handleSelectOption]);

  // Resposta de Digitação (Validação Fonética inteligente)
  const handleCheckTyping = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAnswered || !currentQ || !typingInput.trim()) return;

    const userInput = typingInput.trim().toLowerCase();
    const correctKana = currentQ.word.kana.toLowerCase();
    const correctRomaji = currentQ.word.romaji.toLowerCase();

    // Validação fonética inteligente via WanaKana
    const inputAsHiragana = WanakanaService.toHiragana(userInput);
    const inputAsKatakana = WanakanaService.toKatakana(userInput);
    const isExactKana = inputAsHiragana === correctKana || inputAsKatakana === correctKana;
    const isExactRomaji = userInput === correctRomaji;
    const isWanakanaValid = WanakanaService.validateRomajiAnswer(userInput, correctRomaji, [correctKana]);

    const match = isExactKana || isExactRomaji || isWanakanaValid;

    setIsAnswered(true);
    setIsCorrect(match);

    if (match) {
      setScore((prev) => prev + 1);
    } else {
      setMistakes((prev) => [...prev, currentQ]);
    }
  };

  // Revisar somente erros
  const handleReviewMistakes = () => {
    const errorWords = mistakes.map((m) => m.word);
    handleStartQuiz(errorWords);
  };

  // 1. TELA DE CONFIGURAÇÃO DO EXERCÍCIO
  if (!quizStarted) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fadeIn">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 border border-brand-200/60 dark:border-brand-800">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Treinamento Prático de Palavras</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Configurar Sessão de Exercícios
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
            Fixe as palavras aprendidas com questões de tradução, audição e escrita baseadas no método das apostilas.
          </p>
        </div>

        {/* Seleção do Modo de Treino */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Modalidade do Exercício
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'mixed',
                title: 'Maratona Mista (Recomendada)',
                desc: 'Combina significado, audição e digitação',
                icon: Flame,
                color: 'text-rose-500',
              },
              {
                id: 'jp_to_meaning',
                title: 'Significado (Múltipla Escolha)',
                desc: 'Reconheça a tradução correta da palavra',
                icon: ListFilter,
                color: 'text-indigo-500',
              },
              {
                id: 'listening',
                title: 'Compreensão Auditiva (Listening)',
                desc: 'Ouça o áudio e identifique a palavra',
                icon: Headphones,
                color: 'text-emerald-500',
              },
              {
                id: 'typing',
                title: 'Digitação & Ortografia',
                desc: 'Digite a pronúncia correta em Romaji ou Kana',
                icon: Keyboard,
                color: 'text-amber-500',
              },
            ].map((m) => {
              const Icon = m.icon;
              const isSelected = selectedMode === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelectedMode(m.id as WordQuizMode | 'mixed')}
                  className={`p-4 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'bg-brand-50/70 dark:bg-brand-950/40 border-brand-500 ring-2 ring-brand-400/30 shadow-xs'
                      : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${m.color} shrink-0 mt-0.5`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {m.title}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {m.desc}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantidade de Questões */}
        <div className="space-y-3">
          <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">
            Número de Questões
          </label>
          <div className="flex items-center gap-3">
            {[5, 10, 15].map((cnt) => (
              <button
                key={cnt}
                type="button"
                onClick={() => setQuestionCount(cnt)}
                className={`flex-1 py-3 rounded-2xl font-bold text-sm transition-all border ${
                  questionCount === cnt
                    ? 'bg-brand-600 text-white border-brand-600 shadow-md shadow-brand-500/20'
                    : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cnt} Questões
              </button>
            ))}
          </div>
        </div>

        {/* Botão Iniciar */}
        <div className="pt-4">
          <button
            type="button"
            onClick={() => handleStartQuiz()}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-600 to-rose-600 hover:from-brand-500 hover:to-rose-500 text-white font-extrabold text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>Começar Treinamento ({questionCount} Questões)</span>
          </button>
        </div>
      </div>
    );
  }

  // 2. TELA DE CONCLUSÃO / RESULTADO DO QUIZ
  if (isFinished) {
    const accuracy = Math.round((score / questions.length) * 100);
    const hasMistakes = mistakes.length > 0;

    return (
      <div className="max-w-xl mx-auto space-y-6 text-center animate-fadeIn py-6">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white shadow-xl shadow-amber-500/20">
          <Trophy className="w-10 h-10 animate-bounce" />
        </div>

        <div>
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
            Treino Concluído!
          </span>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            Resultado da Sessão
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Você respondeu todas as {questions.length} questões de palavras.
          </p>
        </div>

        {/* Cards de Métricas */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Acertos</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {score}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Erros</span>
            <span className="text-2xl font-black text-rose-600 dark:text-rose-400">
              {questions.length - score}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase block">Aproveitamento</span>
            <span className="text-2xl font-black text-brand-600 dark:text-brand-400">
              {accuracy}%
            </span>
          </div>
        </div>

        {/* Lista de Erros para Fixação se houver */}
        {hasMistakes && (
          <div className="text-left space-y-3 pt-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Palavras para Reforçar ({mistakes.length}):
            </h4>
            <div className="space-y-2 max-h-56 overflow-y-auto">
              {mistakes.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between"
                >
                  <div>
                    <span className="font-jp text-base font-normal text-slate-900 dark:text-white">
                      {m.word.kanji}
                    </span>
                    <span className="text-xs text-slate-400 ml-2">({m.word.romaji})</span>
                    <p className="text-xs font-bold text-rose-700 dark:text-rose-300">
                      Correto: {m.word.meaning}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onPlayAudio(m.word.audioText)}
                    className="p-2 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50 rounded-xl"
                    title="Ouvir"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => setQuizStarted(false)}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs sm:text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Voltar para Configuração
          </button>

          {hasMistakes && (
            <button
              type="button"
              onClick={handleReviewMistakes}
              className="w-full sm:flex-1 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Revisar Somente os Erros</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleStartQuiz()}
            className="w-full sm:flex-1 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Novo Treino</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. TELA DE QUESTÃO ATIVA
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-fadeIn">
      {/* Topo: Progresso e Contador */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="font-bold">
          Questão {currentIndex + 1} de {questions.length}
        </span>
        <span className="font-extrabold text-brand-600 dark:text-brand-400">
          Pontos: {score}
        </span>
      </div>

      <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
        <div
          className="bg-brand-600 h-full transition-all duration-300 rounded-full"
          style={{ width: `${Math.round(((currentIndex + 1) / questions.length) * 100)}%` }}
        />
      </div>

      {/* Card da Questão */}
      <div className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="text-center space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {currentQ.prompt}
          </span>

          {/* Seção Central da Pergunta (Conforme o Modo) */}
          {currentQ.mode === 'listening' ? (
            <div className="py-6 flex flex-col items-center">
              <button
                type="button"
                onClick={() => onPlayAudio(currentQ.word.audioText)}
                className="w-20 h-20 rounded-3xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-400 flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95"
                title="Repetir áudio"
              >
                <Volume2 className={`w-10 h-10 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-3">
                Toque no botão para ouvir a pronúncia novamente
              </span>
            </div>
          ) : currentQ.mode === 'typing' ? (
            <div className="py-4">
              <span className="font-jp text-4xl sm:text-5xl font-normal text-slate-900 dark:text-white block select-none">
                {currentQ.word.kanji}
              </span>
              <p className="text-sm font-bold text-brand-600 dark:text-brand-400 mt-2">
                "{currentQ.word.meaning}"
              </p>
            </div>
          ) : (
            <div className="py-4 flex items-center justify-center gap-3">
              <span className="font-jp text-4xl sm:text-5xl font-normal text-slate-900 dark:text-white select-none">
                {currentQ.word.kanji}
              </span>
              <button
                type="button"
                onClick={() => onPlayAudio(currentQ.word.audioText)}
                className="p-2.5 rounded-2xl bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/60 dark:hover:bg-brand-900 text-brand-600 dark:text-brand-400 transition-colors"
                title="Ouvir pronúncia"
              >
                <Volume2 className={`w-5 h-5 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
              </button>
            </div>
          )}
        </div>

        {/* Resposta: Modo Digitação */}
        {currentQ.mode === 'typing' && (
          <form onSubmit={handleCheckTyping} className="space-y-3">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                disabled={isAnswered}
                value={typingInput}
                onChange={(e) => setTypingInput(e.target.value)}
                placeholder="Digite a pronúncia (ex: konnichiwa ou こんにちは)..."
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-70 transition-all text-center"
              />
            </div>
            {!isAnswered && (
              <button
                type="submit"
                disabled={!typingInput.trim()}
                className="w-full py-3 rounded-2xl bg-brand-600 hover:bg-brand-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
              >
                Confirmar Resposta
              </button>
            )}
          </form>
        )}

        {/* Resposta: Modo Múltipla Escolha (com atalhos 1 a 4) */}
        {currentQ.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedOption === opt;
              const isOptionCorrect = opt === currentQ.correctAnswer;

              let btnStyle = 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-800';

              if (isAnswered) {
                if (isOptionCorrect) {
                  btnStyle = 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-500/20';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border-rose-400 dark:border-rose-700';
                } else {
                  btnStyle = 'opacity-40 bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  className={`p-3.5 rounded-2xl text-left border font-semibold text-xs sm:text-sm flex items-center justify-between transition-all ${btnStyle}`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="w-5 h-5 rounded-lg bg-black/5 dark:bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-500 shrink-0">
                      {idx + 1}
                    </span>
                    <span className="truncate">{opt}</span>
                  </div>

                  {isAnswered && isOptionCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  {isAnswered && isSelected && !isOptionCorrect && (
                    <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Feedback Pedagógico Imediato */}
        {isAnswered && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm animate-fadeIn space-y-1.5 ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
            }`}
          >
            <div className="flex items-center gap-2 font-extrabold">
              {isCorrect ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Muito bem! Resposta correta! 🎉</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
                  <span>Não foi dessa vez. Resposta certa: <strong>{currentQ.correctAnswer}</strong></span>
                </>
              )}
            </div>

            <p className="text-xs leading-relaxed opacity-90">
              {currentQ.explanation}
            </p>
          </div>
        )}
      </div>

      {/* Botão de Avanço */}
      {isAnswered && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleNextQuestion}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs sm:text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-105 active:scale-95"
          >
            <span>{currentIndex < questions.length - 1 ? 'Próxima Questão (Enter)' : 'Finalizar Treino'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
