import React from 'react';
import type { ActiveTab } from '../common/Navbar';
import type { UserLearningState, CurrentSessionMetrics } from '../../types/progress';
import { StatCard } from '../common/StatCard';
import { ProgressBar } from '../common/ProgressBar';
import { KanaDataset } from '../../data/kanaDataset';
import { useAuth } from '../../hooks/useAuth';
import { StreakWidget } from './StreakWidget';
import {
  Sparkles,
  BookOpen,
  Trophy,
  ArrowRight,
  RotateCcw,
  Volume2,
  Zap,
  Target,
  Brain,
  HelpCircle,
  Flame,
  Layers,
} from 'lucide-react';
import { PhraseStorageService } from '../../services/phraseStorageService';
import { PHRASE_LESSONS } from '../../data/phraseTracks';
import { KanjiStorageService } from '../../services/kanjiStorageService';
import { KANJI_DATASET } from '../../data/kanjiDataset';

interface DashboardViewProps {
  onNavigate: (tab: ActiveTab) => void;
  onStartExercise?: (type?: string) => void;
  learningState: UserLearningState;
  sessionMetrics: CurrentSessionMetrics;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onStartExercise,
  learningState,
  sessionMetrics,
}) => {
  const { user, profile } = useAuth();
  const displayName = profile?.display_name || user?.email?.split('@')[0];

  const totalCharacters = KanaDataset.getAll().length;
  const totalHiragana = KanaDataset.getHiragana().length;
  const totalKatakana = KanaDataset.getKatakana().length;
  const studiedCount = learningState.studiedCharacterIds.length;
  const progressPercent = Math.min(100, Math.round((studiedCount / totalCharacters) * 100));

  const currentStreak = learningState.streak?.currentStreak || 0;
  const maxStreak = Math.max(learningState.streak?.maxStreak || 0, currentStreak);

  // Contagem de Hiragana vs Katakana estudados
  const hiraganaStudiedCount = learningState.studiedCharacterIds.filter((id) => id.startsWith('hira_')).length;
  const katakanaStudiedCount = learningState.studiedCharacterIds.filter((id) => id.startsWith('kata_')).length;

  // Caracteres com pendência de revisão por erros não superados
  const charactersNeedingReview = Object.values(learningState.characterStats)
    .filter((stat) => stat.needsReview)
    .sort((a, b) => b.incorrect - a.incorrect);

  const phraseProgress = PhraseStorageService.getProgress();
  const phraseCompletedCount = phraseProgress.completedLessonIds.length;
  const totalPhraseLessons = PHRASE_LESSONS.length;

  const kanjiProgress = KanjiStorageService.getProgress();
  const kanjiStudiedCount = kanjiProgress.studiedKanjiIds.length;
  const totalKanjis = KANJI_DATASET.length;

  const totalExercises = learningState.totalExercisesCompleted;
  const globalAccuracy =
    totalExercises > 0
      ? Math.round(
          (learningState.totalCorrect /
            (learningState.totalCorrect + learningState.totalIncorrect || 1)) *
            100
        )
      : null;

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Banner Minimalista e Adaptativo */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white via-rose-50/40 to-brand-50/60 dark:from-slate-900 dark:via-slate-800 dark:to-slate-950 text-slate-900 dark:text-white rounded-3xl p-6 sm:p-10 shadow-sm dark:shadow-xl border border-slate-200/90 dark:border-slate-800 transition-colors">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-80 h-80 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-12 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-500/20 border border-brand-200 dark:border-brand-500/30 text-brand-700 dark:text-brand-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            {displayName ? `Konnichiwa, ${displayName}! 🎌` : 'Japonês para Brasileiros (PT-BR)'}
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            Domine o <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-brand-600 dark:from-rose-400 dark:to-brand-400">Hiragana</span> e o <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-300 dark:to-orange-400">Katakana</span>
          </h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Aprenda os dois alfabetos fonéticos da língua japonesa com fonética aproximada ao português, pronúncia falada nativa, cartões interativos e 5 modalidades de exercícios.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('hiragana')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="font-jp text-base">あ</span>
              <span>Estudar Hiragana</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('katakana')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="font-jp text-base">ア</span>
              <span>Estudar Katakana</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('kanji')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm shadow-md shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="font-jp text-base font-bold">漢</span>
              <span>Estudar Kanji</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('phrases')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Layers className="w-4 h-4 text-emerald-200" />
              <span>Trilha de Frases</span>
              <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20">Novo</span>
            </button>

            <button
              onClick={() => onNavigate('practice')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-semibold text-sm border border-slate-200 dark:border-slate-600 shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Zap className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
              <span>Praticar Exercícios</span>
            </button>
          </div>
        </div>
      </section>

      {/* Widget Interativo da Ofensiva / Dias Seguidos (Streak) */}
      <StreakWidget streak={learningState.streak} />

      {/* Indicadores de Progresso da Sessão Atual e Geral */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Seu Desempenho</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Métricas da ofensiva, sessão atual e histórico geral sincronizado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            icon={<Flame className="w-6 h-6 text-orange-600 dark:text-orange-400" />}
            iconBgColor="bg-orange-50 dark:bg-orange-950/50"
            label="Ofensiva Atual"
            value={`${currentStreak} ${currentStreak === 1 ? 'dia' : 'dias'}`}
            badge={`Recorde: ${maxStreak}d`}
            subtitle={
              currentStreak > 0
                ? `${learningState.streak?.activeDates?.length || 1} dias totais registrados`
                : 'Entre todo dia para evoluir'
            }
          />

          <StatCard
            icon={<BookOpen className="w-6 h-6 text-brand-600 dark:text-brand-400" />}
            iconBgColor="bg-brand-50 dark:bg-brand-950/50"
            label="Total Estudado"
            value={`${studiedCount} / ${totalCharacters}`}
            badge={`${progressPercent}%`}
            subtitle={`${hiraganaStudiedCount} Hiragana • ${katakanaStudiedCount} Katakana`}
          />

          <StatCard
            icon={<Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />}
            iconBgColor="bg-indigo-50 dark:bg-indigo-950/50"
            label="Exercícios na Sessão"
            value={sessionMetrics.exercisesCompletedInCurrentSession}
            subtitle={
              sessionMetrics.exercisesCompletedInCurrentSession > 0
                ? `${sessionMetrics.sessionScore} pts acumulados nesta sessão`
                : 'Nenhum exercício feito hoje'
            }
          />

          <StatCard
            icon={<Trophy className="w-6 h-6 text-amber-600 dark:text-amber-400" />}
            iconBgColor="bg-amber-50 dark:bg-amber-950/50"
            label="Aproveitamento Geral"
            value={globalAccuracy !== null ? `${globalAccuracy}%` : '—'}
            subtitle={
              totalExercises > 0
                ? `${learningState.totalCorrect} acertos em ${totalExercises} testes`
                : 'Faça exercícios para calcular'
            }
          />

          <StatCard
            icon={<RotateCcw className="w-6 h-6 text-rose-600 dark:text-rose-400" />}
            iconBgColor="bg-rose-50 dark:bg-rose-950/50"
            label="Revisão Pendente"
            value={charactersNeedingReview.length}
            badge={charactersNeedingReview.length > 0 ? 'Atenção' : 'Em dia'}
            subtitle={
              charactersNeedingReview.length > 0
                ? 'Caracteres com erros que precisam de reforço'
                : 'Nenhum caractere com dificuldade'
            }
          />
        </div>

        {/* Barra de Progresso Geral */}
        <div className="bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Progresso do Alfabeto Japonês (Gojūon & Dakuon)
            </span>
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">{studiedCount} de {totalCharacters} caracteres</span>
          </div>
          <ProgressBar current={studiedCount} total={totalCharacters} color="brand" size="md" showPercentage={false} />
        </div>
      </section>

      {/* Acesso Rápido aos Três Sistemas de Escrita (Hiragana, Katakana e Kanji) */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sistemas de Escrita do Japonês</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Os 3 sistemas complementares usados simultaneamente na língua japonesa</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card Hiragana */}
          <div className="group bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
                  Sistema Principal
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                  <span>Hiragana</span>
                  <span className="font-jp text-lg text-slate-400 dark:text-slate-500 font-normal">ひらがな</span>
                </h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 flex items-center justify-center text-3xl font-jp font-black text-brand-600 dark:text-brand-400">
                あ
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Utilizado para palavras nativas japonesas, partículas gramaticais e desinências de verbos. É o primeiro alfabeto ensinado no Japão.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{hiraganaStudiedCount} de {totalHiragana} caracteres estudados</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round((hiraganaStudiedCount / (totalHiragana || 1)) * 100)}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar current={hiraganaStudiedCount} total={totalHiragana} color="brand" size="sm" showPercentage={false} />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onNavigate('hiragana')}
                className="flex-1 py-3 px-4 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Abrir Tabela e Flashcards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Katakana */}
          <div className="group bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                  Palavras Estrangeiras
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                  <span>Katakana</span>
                  <span className="font-jp text-lg text-slate-400 dark:text-slate-500 font-normal">カタカナ</span>
                </h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-3xl font-jp font-black text-amber-600 dark:text-amber-400">
                ア
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Utilizado para palavras importadas de outras línguas (como <em>kohii</em> / café, <em>terebi</em> / TV), nomes estrangeiros, onomatopeias e ênfase visual.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{katakanaStudiedCount} de {totalKatakana} caracteres estudados</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round((katakanaStudiedCount / (totalKatakana || 1)) * 100)}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar current={katakanaStudiedCount} total={totalKatakana} color="amber" size="sm" showPercentage={false} />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onNavigate('katakana')}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Abrir Tabela e Flashcards</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card Kanji */}
          <div className="group bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-7 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60">
                  Ideogramas & Ideias
                </span>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-3 flex items-center gap-2">
                  <span>Kanji</span>
                  <span className="font-jp text-lg text-slate-400 dark:text-slate-500 font-normal">漢字</span>
                </h3>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-3xl font-jp font-black text-rose-600 dark:text-rose-400">
                漢
              </div>
            </div>

            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Ideogramas que representam ideias e conceitos. Aprenda através de peças de montar (radicais) e a fórmula Forma ➔ Som ➔ Significado.
            </p>

            <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>{kanjiStudiedCount} de {totalKanjis} ideogramas dominados</span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">{Math.round((kanjiStudiedCount / (totalKanjis || 1)) * 100)}%</span>
            </div>
            <div className="mt-2">
              <ProgressBar current={kanjiStudiedCount} total={totalKanjis} color="brand" size="sm" showPercentage={false} />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => onNavigate('kanji')}
                className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <span>Explorar Kanjis & Radicais</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* Banner Card Especial: Trilha de Frases */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-50 via-teal-50/50 to-white dark:from-emerald-950 dark:via-[#131b2e] dark:to-slate-900 border border-emerald-200 dark:border-emerald-500/30 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-md transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100/70 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Nova Funcionalidade • Do Alfabeto à Conversação</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Trilha de Frases Passo a Passo</span>
                <span className="font-jp text-lg text-emerald-600 dark:text-emerald-400 font-normal">文の道</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Aprenda a pensar em japonês como blocos de LEGO! Descubra a ordem SOV, as partículas essenciais (は, が, を, の, と, や) e o segredo de です/だ e verbos na prática com dupla tradução (literal vs natural).
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 min-w-[220px]">
              <div className="text-left lg:text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Progresso da Trilha:</span>
                <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  {phraseCompletedCount} de {totalPhraseLessons} lições dominadas
                </p>
              </div>
              <button
                onClick={() => onNavigate('phrases')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Acessar Trilha de Frases</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Banner Card Especial: Biblioteca Tadoku */}
        <div className="relative overflow-hidden bg-gradient-to-r from-teal-50 via-cyan-50/50 to-white dark:from-teal-950 dark:via-[#131b2e] dark:to-slate-900 border border-teal-200 dark:border-teal-500/30 rounded-3xl p-6 sm:p-8 shadow-sm dark:shadow-md transition-colors">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-teal-100/70 dark:bg-teal-500/20 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-500/30">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Metodologia Japonesa • Leitura Extensiva</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Biblioteca de Leituras Tadoku</span>
                <span className="font-jp text-lg text-teal-600 dark:text-teal-400 font-normal">多読ライブラリ</span>
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Pratique sua leitura com histórias ilustradas graduadas (nível N5), áudio nativo japonês e furigana dinâmico. Comece com a clássica fábula de Esopo <em>キツネとツル (A Raposa e o Grou)</em>!
              </p>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-3 min-w-[220px]">
              <div className="text-left lg:text-right">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">Leitura Recomendada:</span>
                <p className="text-base font-black text-teal-600 dark:text-teal-400">
                  キツネとツル (Nível 0)
                </p>
              </div>
              <button
                onClick={() => onNavigate('stories')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Abrir Biblioteca</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Área de Exercícios Interativos (Vitrine das 5 Modalidades) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Modalidades de Exercícios</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">Pratique a leitura, audição, digitação e fixação na memória</p>
          </div>
          <button
            onClick={() => onNavigate('practice')}
            className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 flex items-center gap-1"
          >
            <span>Ver todos</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Exercício 1 */}
          <div
            onClick={() => {
              if (onStartExercise) onStartExercise('recognition');
              else onNavigate('practice');
            }}
            className="cursor-pointer bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <EyeIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              1. Reconhecimento
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Veja o caractere japonês e escolha a alternativa correta em Romaji entre 4 opções.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 gap-1">
              <span>Iniciar teste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Exercício 2 */}
          <div
            onClick={() => {
              if (onStartExercise) onStartExercise('typing');
              else onNavigate('practice');
            }}
            className="cursor-pointer bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-brand-300 dark:hover:border-brand-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <KeyboardIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              2. Digitação
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Exibe o caractere japonês e você digita a romanização correta no teclado com validação inteligente.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-brand-600 dark:text-brand-400 gap-1">
              <span>Iniciar teste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Exercício 3 */}
          <div
            onClick={() => {
              if (onStartExercise) onStartExercise('conversion');
              else onNavigate('practice');
            }}
            className="cursor-pointer bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <SwapIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              3. Conversão Romaji ➔ Kana
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Apresenta uma sílaba em Romaji para converter diretamente para Hiragana ou Katakana.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-amber-600 dark:text-amber-400 gap-1">
              <span>Iniciar teste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Exercício 4 */}
          <div
            onClick={() => {
              if (onStartExercise) onStartExercise('alphabet_id');
              else onNavigate('practice');
            }}
            className="cursor-pointer bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-teal-300 dark:hover:border-teal-500 hover:shadow-md transition-all group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
              4. Identificação do Alfabeto
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
              Identifique rapidamente se o caractere apresentado é Hiragana ou Katakana.
            </p>
            <div className="mt-4 flex items-center text-xs font-semibold text-teal-600 dark:text-teal-400 gap-1">
              <span>Iniciar teste</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Exercício 5 */}
          <div
            onClick={() => {
              if (onStartExercise) onStartExercise('review_random');
              else onNavigate('practice');
            }}
            className="cursor-pointer bg-white dark:bg-[#131b2e] p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500 hover:shadow-md transition-all group sm:col-span-2 lg:col-span-2"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  5. Revisão Geral Aleatória
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                  Desafio misto com perguntas aleatórias de todos os grupos estudados para fixação definitiva na memória de longo prazo.
                </p>
                <div className="mt-3 flex items-center text-xs font-semibold text-purple-600 dark:text-purple-400 gap-1">
                  <span>Iniciar maratona mista</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Dicas de Pronúncia em Português Brasileiro (Didática Diferencial) */}
      <section className="bg-white dark:bg-[#131b2e] rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Dicas Fonéticas para Brasileiros</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">O japonês é muito fácil de pronunciar para quem fala português brasileiro</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">Vogais Puras (A, I, U, E, O)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              São abertas e curtas, idênticas às do português (ex.: o <strong>U</strong> nunca vira biquinho francês nem "iu").
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">O som do "R" (ら, り, る...)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Sempre vibrado com a ponta da língua, como em <em>a<strong>r</strong>a<strong>r</strong>a</em> ou <em>ca<strong>r</strong>o</em> (nunca como o "r" de rato).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">O som do "H" (は, へ, ほ...)</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Aspirado como no inglês <em>house</em>, muito similar ao "r" carioca ou mineiro em <em><strong>r</strong>ua</em>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0f172a] border border-slate-100 dark:border-slate-800">
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">O som do "CH" e "SH"</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              <strong>CHI</strong> soa como "tch" em <em>tchau</em>; <strong>SHI</strong> soa como "ch" em <em>chave</em>.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

// Ícones auxiliares inline com Tailwind
function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function KeyboardIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M6 12h.01M10 12h.01M14 12h.01M18 12h.01M7 16h10" />
    </svg>
  );
}

function SwapIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m16 3 4 4-4 4" />
      <path d="M20 7H4" />
      <path d="m8 21-4-4 4-4" />
      <path d="M4 17h16" />
    </svg>
  );
}
