import React, { useState } from 'react';
import {
  PARTICLES_DATA,
  PARTICLE_QUIZ_QUESTIONS,
} from '../../data/particlesData';
import type { ParticleCategory, ParticleItem } from '../../types/grammar';
import { useAudio } from '../../hooks/useAudio';
import {
  Sparkles,
  Volume2,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';

export const ParticlesGuide: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ParticleCategory>('all');
  const [selectedParticle, setSelectedParticle] = useState<ParticleItem>(PARTICLES_DATA[0]);
  const [activeSubTab, setActiveSubTab] = useState<'cards' | 'quiz'>('cards');

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const { playKana } = useAudio();

  const currentQuiz = PARTICLE_QUIZ_QUESTIONS[quizIndex];

  const filteredParticles = PARTICLES_DATA.filter((p) => {
    if (selectedCategory === 'all') return true;
    return p.category === selectedCategory;
  });

  const handleSelectOption = (opt: string) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(opt);
  };

  const handleConfirmAnswer = () => {
    if (!selectedOption || isAnswerSubmitted) return;
    setIsAnswerSubmitted(true);
    if (selectedOption === currentQuiz.correctParticle) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuiz = () => {
    if (quizIndex < PARTICLE_QUIZ_QUESTIONS.length - 1) {
      setQuizIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestartQuiz = () => {
    setQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6">
      {/* Sub-header de Navegação do Módulo de Partículas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 mb-1">
            <Sparkles className="w-3 h-3" />
            <span>Capítulos 3 & 5 da Apostila 1</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-2 flex-wrap">
            <span>Guia das 12 Partículas Essenciais</span>
            <span className="font-jp text-lg text-slate-400 font-normal whitespace-nowrap">助詞</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            As partículas agem como etiquetas anexadas às palavras que indicam a função de cada termo na frase.
          </p>
        </div>

        {/* Alternador de Modo: Catálogo vs Quiz */}
        <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shrink-0">
          <button
            onClick={() => setActiveSubTab('cards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'cards'
                ? 'bg-white dark:bg-[#131b2e] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Guia & Exemplos ({PARTICLES_DATA.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('quiz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'quiz'
                ? 'bg-white dark:bg-[#131b2e] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Quiz de Lacunas</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'cards' ? (
        <div className="space-y-6">
          {/* Filtro por Categoria */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'Todas as Partículas (12)' },
              { id: 'topic_subject', label: 'Tópico & Sujeito (は, が, を)' },
              { id: 'space_time', label: 'Espaço, Tempo & Meio (に, で, へ, から, まで)' },
              { id: 'connection', label: 'Conexão & Posse (の, と, や, も)' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as ParticleCategory)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de Seletor de Partículas */}
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2.5">
            {filteredParticles.map((particle) => {
              const isSelected = selectedParticle.id === particle.id;
              return (
                <button
                  key={particle.id}
                  onClick={() => {
                    setSelectedParticle(particle);
                    playKana(particle.character);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-500 shadow-md ring-2 ring-indigo-500/30'
                      : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                  }`}
                >
                  <span className="font-jp text-2xl font-black text-slate-900 dark:text-white">
                    {particle.character}
                  </span>
                  <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase mt-0.5">
                    {particle.romaji}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cartão de Detalhes da Partícula Selecionada */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-jp text-3xl font-black shadow-lg shadow-indigo-600/20">
                  {selectedParticle.character}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Partícula {selectedParticle.character} ({selectedParticle.romaji})
                    </h3>
                    <button
                      onClick={() => playKana(selectedParticle.character)}
                      className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 hover:bg-indigo-100 transition-colors"
                      title="Ouvir som"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedParticle.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {selectedParticle.role}
                  </p>
                </div>
              </div>
            </div>

            {/* Regra de Ouro da Apostila */}
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Regra de Ouro (Apostila: Desvendando a Língua Japonesa):</span>
              </div>
              <p className="text-xs sm:text-sm text-amber-900 dark:text-amber-200/90 leading-relaxed">
                {selectedParticle.goldenRule}
              </p>
            </div>

            {/* Contraste Crítico (se houver, ex: は vs が) */}
            {selectedParticle.contrastWith && (
              <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-800/50 space-y-1">
                <div className="text-xs font-bold text-indigo-800 dark:text-indigo-300">
                  ⚡ Diferença crucial: {selectedParticle.character} vs {selectedParticle.contrastWith.particle}
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {selectedParticle.contrastWith.explanation}
                </p>
              </div>
            )}

            {/* Frases de Exemplo com Áudio */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Frases de Aplicação Prática
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedParticle.examples.map((ex, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="font-jp text-lg font-bold text-slate-900 dark:text-white">
                        {ex.japanese}
                      </p>
                      <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                        {ex.romaji}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {ex.translation}
                      </p>
                    </div>
                    <button
                      onClick={() => playKana(ex.japanese)}
                      className="p-2 rounded-xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 hover:text-indigo-600 shrink-0"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Modo Quiz de Lacunas */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 space-y-6">
          {!quizFinished ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Questão {quizIndex + 1} de {PARTICLE_QUIZ_QUESTIONS.length}
                </span>
                <span className="text-xs font-bold text-slate-500">
                  Acertos: {score}
                </span>
              </div>

              {/* Sentença com lacuna */}
              <div className="p-6 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-2">
                <p className="font-jp text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {currentQuiz.sentenceWithBlank}
                </p>
                <p className="text-xs sm:text-sm font-bold text-indigo-600 dark:text-indigo-400">
                  {currentQuiz.romajiWithBlank}
                </p>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 pt-1">
                  Tradução: &ldquo;{currentQuiz.translation}&rdquo;
                </p>
              </div>

              {/* Opções de Partícula */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {currentQuiz.options.map((opt) => {
                  const isSelected = selectedOption === opt;
                  let btnColor = 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 hover:border-indigo-400';

                  if (isAnswerSubmitted) {
                    if (opt === currentQuiz.correctParticle) {
                      btnColor = 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-black';
                    } else if (isSelected) {
                      btnColor = 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-700 dark:text-rose-300';
                    }
                  } else if (isSelected) {
                    btnColor = 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-600 text-indigo-700 dark:text-indigo-300 font-black ring-2 ring-indigo-500/20';
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelectOption(opt)}
                      disabled={isAnswerSubmitted}
                      className={`p-4 rounded-2xl border text-center transition-all ${btnColor}`}
                    >
                      <span className="font-jp text-2xl font-bold block">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Feedback e Botões */}
              {isAnswerSubmitted && (
                <div
                  className={`p-4 rounded-2xl border flex items-start gap-3 ${
                    selectedOption === currentQuiz.correctParticle
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-800 dark:text-emerald-300'
                      : 'bg-rose-50 dark:bg-rose-950/30 border-rose-200 text-rose-800 dark:text-rose-300'
                  }`}
                >
                  {selectedOption === currentQuiz.correctParticle ? (
                    <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 shrink-0 text-rose-500" />
                  )}
                  <div className="text-xs sm:text-sm">
                    <strong>
                      {selectedOption === currentQuiz.correctParticle ? 'Excelente! ' : 'Atenção: '}
                    </strong>
                    {currentQuiz.explanation}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                {!isAnswerSubmitted ? (
                  <button
                    onClick={handleConfirmAnswer}
                    disabled={!selectedOption}
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    Confirmar Resposta
                  </button>
                ) : (
                  <button
                    onClick={handleNextQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm shadow-md"
                  >
                    <span>{quizIndex < PARTICLE_QUIZ_QUESTIONS.length - 1 ? 'Próxima Questão' : 'Ver Resultado'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Resultado do Quiz */
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto text-2xl font-bold">
                🎉
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Quiz de Partículas Concluído!
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Você acertou <strong className="text-indigo-600 font-black">{score}</strong> de{' '}
                <strong>{PARTICLE_QUIZ_QUESTIONS.length}</strong> questões.
              </p>
              <div className="pt-2">
                <button
                  onClick={handleRestartQuiz}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Refazer Quiz</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
