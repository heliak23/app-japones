import React, { useState } from 'react';
import type { PhraseLesson } from '../../types/phrase';
import { PHRASE_MODULES, PHRASE_LESSONS } from '../../data/phraseTracks';
import { PhraseStorageService } from '../../services/phraseStorageService';
import { PhraseStepViewer } from './PhraseStepViewer';
import { PhraseQuizViewer } from './PhraseQuizViewer';
import { KosoadoVisualizer } from './KosoadoVisualizer';
import { DialoguePlayer } from './DialoguePlayer';
import { ParticlesGuide } from '../grammar/ParticlesGuide';
import { ConjugatorView } from '../grammar/ConjugatorView';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Trophy,
  Compass,
  BookOpen,
  Layers,
  FileText,
  MessageSquare,
} from 'lucide-react';

export const PhraseTrackView: React.FC = () => {
  const [mainTab, setMainTab] = useState<'lessons' | 'particles' | 'conjugator' | 'kosoado' | 'dialogues'>('lessons');
  const [selectedLesson, setSelectedLesson] = useState<PhraseLesson | null>(null);
  const [mode, setMode] = useState<'list' | 'steps' | 'quiz'>('list');
  const [selectedModuleFilter, setSelectedModuleFilter] = useState<string>('all');
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    return PhraseStorageService.getProgress().completedLessonIds;
  });

  const totalLessons = PHRASE_LESSONS.length;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const handleStartLesson = (lesson: PhraseLesson) => {
    setSelectedLesson(lesson);
    setMode('steps');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinishSteps = () => {
    setMode('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLessonCompleted = () => {
    if (selectedLesson) {
      const updated = PhraseStorageService.markLessonCompleted(selectedLesson.id);
      setCompletedLessonIds([...updated.completedLessonIds]);
    }
    setMode('list');
    setSelectedLesson(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToList = () => {
    setMode('list');
    setSelectedLesson(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Se estiver visualizando os passos ou o quiz
  if (selectedLesson && mode === 'steps') {
    return (
      <PhraseStepViewer
        lesson={selectedLesson}
        onFinishSteps={handleFinishSteps}
        onBackToList={handleBackToList}
      />
    );
  }

  if (selectedLesson && mode === 'quiz') {
    return (
      <PhraseQuizViewer
        lesson={selectedLesson}
        onLessonCompleted={handleLessonCompleted}
        onBackToSteps={() => setMode('steps')}
      />
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Banner Principal da Trilha de Frases */}
      <section className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspirado no Método Desvendando a Língua Japonesa</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
              <span>Trilha de Frases</span>
              <span className="font-jp text-xl sm:text-2xl text-slate-400 dark:text-slate-500 font-normal">
                文の道
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
              Aprenda a construir e entender frases reais em japonês de forma progressiva: como blocos de LEGO. Da simples afirmação <code className="text-brand-600 dark:text-brand-400 font-bold">車です</code> até sentenças completas com tópicos, adjetivos e ações contínuas.
            </p>
          </div>

          {/* Card de Progresso Geral */}
          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl min-w-[260px] space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="flex items-center gap-1.5">
                <Trophy className="w-4 h-4 text-amber-500" />
                Seu Avanço na Trilha
              </span>
              <span className="text-brand-600 dark:text-brand-400 font-black">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>{completedCount} de {totalLessons} lições dominadas</span>
              <span>12 lições totais</span>
            </div>
          </div>
        </div>
      </section>

      {/* Navegação entre Trilha e Ferramentas Didáticas (Apostila 1 e 2) */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800">
          <button
            onClick={() => setMainTab('lessons')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'lessons'
                ? 'bg-white dark:bg-[#131b2e] text-brand-600 dark:text-brand-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Lições da Trilha ({totalLessons})</span>
          </button>

          <button
            onClick={() => setMainTab('particles')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'particles'
                ? 'bg-white dark:bg-[#131b2e] text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4 text-indigo-500" />
            <span>12 Partículas (は, が, を...)</span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
              Novo
            </span>
          </button>

          <button
            onClick={() => setMainTab('conjugator')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'conjugator'
                ? 'bg-white dark:bg-[#131b2e] text-emerald-600 dark:text-emerald-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-500" />
            <span>Conjugador (Verbos & Adjetivos)</span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              Novo
            </span>
          </button>

          <button
            onClick={() => setMainTab('kosoado')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'kosoado'
                ? 'bg-white dark:bg-[#131b2e] text-amber-600 dark:text-amber-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Ko-So-A-Do (こ・そ・あ・ど)</span>
          </button>

          <button
            onClick={() => setMainTab('dialogues')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              mainTab === 'dialogues'
                ? 'bg-white dark:bg-[#131b2e] text-rose-600 dark:text-rose-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-rose-500" />
            <span>Diálogos Reais (Sakura & Takeshi)</span>
            <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300">
              Novo
            </span>
          </button>
        </div>

        {mainTab === 'lessons' && (
          <div className="hidden lg:flex items-center gap-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            <button
              onClick={() => setMainTab('particles')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              12 Partículas →
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setMainTab('conjugator')}
              className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
            >
              Conjugador →
            </button>
            <span>&bull;</span>
            <button
              onClick={() => setMainTab('dialogues')}
              className="hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              Diálogo Sakura & Takeshi →
            </button>
          </div>
        )}
      </div>

      {/* Conteúdo da aba selecionada */}
      {mainTab === 'particles' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMainTab('lessons')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e]"
            >
              ← Voltar para as Lições da Trilha
            </button>
          </div>
          <ParticlesGuide />
        </div>
      )}

      {mainTab === 'conjugator' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMainTab('lessons')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e]"
            >
              ← Voltar para as Lições da Trilha
            </button>
          </div>
          <ConjugatorView />
        </div>
      )}

      {mainTab === 'kosoado' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMainTab('lessons')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e]"
            >
              ← Voltar para as Lições da Trilha
            </button>
          </div>
          <KosoadoVisualizer />
        </div>
      )}

      {mainTab === 'dialogues' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setMainTab('lessons')}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2e]"
            >
              ← Voltar para as Lições da Trilha
            </button>
          </div>
          <DialoguePlayer />
        </div>
      )}

      {mainTab === 'lessons' && (
        <>
          {/* Filtros de Módulo */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedModuleFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
            selectedModuleFilter === 'all'
              ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
              : 'bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          Todos os Módulos ({totalLessons})
        </button>

        {PHRASE_MODULES.map((mod) => {
          const modLessons = PHRASE_LESSONS.filter((l) => l.moduleId === mod.id);
          const modCompleted = modLessons.filter((l) => completedLessonIds.includes(l.id)).length;
          const isSelected = selectedModuleFilter === mod.id;

          return (
            <button
              key={mod.id}
              onClick={() => setSelectedModuleFilter(mod.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isSelected
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm'
                  : 'bg-white dark:bg-[#131b2e] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span>{mod.badge}</span>
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-extrabold ${isSelected ? 'bg-white/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                {modCompleted}/{modLessons.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid de Módulos e Lições */}
      <div className="space-y-8">
        {PHRASE_MODULES.filter(
          (m) => selectedModuleFilter === 'all' || selectedModuleFilter === m.id
        ).map((module) => {
          const moduleLessons = PHRASE_LESSONS.filter((l) => l.moduleId === module.id);

          return (
            <div key={module.id} className="space-y-4">
              {/* Header do Módulo */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-slate-200/80 dark:border-slate-800/80">
                <div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-500 inline-block" />
                    <span>{module.title}</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                    {module.description}
                  </p>
                </div>
              </div>

              {/* Cards das Lições deste Módulo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
                {moduleLessons.map((lesson) => {
                  const isCompleted = completedLessonIds.includes(lesson.id);

                  return (
                    <div
                      key={lesson.id}
                      className={`relative flex flex-col justify-between bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-5 sm:p-6 border transition-all duration-200 hover:shadow-md ${
                        isCompleted
                          ? 'border-emerald-300 dark:border-emerald-800/50 shadow-sm'
                          : 'border-slate-200/90 dark:border-slate-800'
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                            Lição #{lesson.lessonOrder} • {lesson.level}
                          </span>

                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Concluída</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-medium text-slate-400">
                              {lesson.steps.length} passos
                            </span>
                          )}
                        </div>

                        <div>
                          <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                            {lesson.title}
                          </h4>
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                            {lesson.description}
                          </p>
                        </div>

                        {/* Regra-Chave Resumida */}
                        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium">
                          <strong className="text-slate-800 dark:text-slate-200">Regra Chave: </strong>
                          <span>{lesson.keyRule}</span>
                        </div>
                      </div>

                      {/* Botão de Ação */}
                      <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800/60">
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 italic truncate max-w-[180px]">
                          {lesson.bookChapter}
                        </span>

                        <button
                          onClick={() => handleStartLesson(lesson)}
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                            isCompleted
                              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              : 'bg-brand-600 hover:bg-brand-500 text-white shadow-sm shadow-brand-900/20 hover:scale-[1.02] active:scale-[0.98]'
                          }`}
                        >
                          <span>{isCompleted ? 'Revisar Passos' : 'Iniciar Lição'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
        </>
      )}
    </div>
  );
};
