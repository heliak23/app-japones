import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudyView } from './components/study/StudyView';
import { PracticeContainer } from './components/practice/PracticeContainer';
import { ReviewView } from './components/review/ReviewView';
import type { ExerciseType } from './types/exercise';
import type { AlphabetType, KanaCharacter } from './types/kana';
import { KanaDataset } from './data/kanaDataset';
import { useLearningProgress } from './hooks/useLearningProgress';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPracticeType, setSelectedPracticeType] = useState<ExerciseType | undefined>(undefined);
  const [selectedPracticeAlphabet, setSelectedPracticeAlphabet] = useState<'all' | AlphabetType | undefined>(undefined);
  const [targetReviewChars, setTargetReviewChars] = useState<KanaCharacter[] | undefined>(undefined);
  const [practiceAutoStart, setPracticeAutoStart] = useState<boolean>(false);
  const [practiceSessionKey, setPracticeSessionKey] = useState<number>(0);
  
  const {
    learningState,
    sessionMetrics,
    markAsStudied,
    unmarkAsStudied,
    toggleStudied,
    setMultipleStudied,
    saveSummary,
    recordAnswer,
    resetProgress,
  } = useLearningProgress();

  // Navegação para a aba de exercícios
  const handleOpenPractice = (options?: {
    type?: ExerciseType;
    alphabet?: 'all' | AlphabetType;
    targetChars?: KanaCharacter[];
    autoStart?: boolean;
  }) => {
    setSelectedPracticeType(options?.type);
    setSelectedPracticeAlphabet(options?.alphabet);
    setTargetReviewChars(options?.targetChars);
    setPracticeAutoStart(options?.autoStart ?? false);
    setPracticeSessionKey((prev) => prev + 1);
    setActiveTab('practice');
  };

  // Troca de aba global (Navbar, atalhos, etc.)
  const handleSelectTab = (tab: ActiveTab) => {
    if (tab === 'practice') {
      // Quando o usuário clica em "Exercícios" na Navbar ou menu,
      // SEMPRE abrimos a tela para o usuário escolher a modalidade do exercício!
      handleOpenPractice();
    } else {
      // Ao trocar para outra aba, limpamos os estados residuais de exercícios anteriores
      setSelectedPracticeType(undefined);
      setSelectedPracticeAlphabet(undefined);
      setTargetReviewChars(undefined);
      setPracticeAutoStart(false);
      setActiveTab(tab);
    }
  };

  const handleStartTargetedReview = (characterIds: string[]) => {
    const chars = characterIds
      .map((id) => KanaDataset.getById(id))
      .filter((c): c is KanaCharacter => !!c);

    handleOpenPractice({
      type: 'review_random',
      targetChars: chars,
      autoStart: true,
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col text-slate-800 dark:text-slate-100 selection:bg-brand-100 selection:text-brand-900 dark:selection:bg-brand-900/50 dark:selection:text-brand-200 transition-colors duration-200">
      {/* Navbar Superior & Navegação Móvel */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={handleSelectTab} 
        studiedCount={learningState.studiedCharacterIds.length}
        totalCount={92}
        onResetProgress={resetProgress}
      />

      {/* Conteúdo Dinâmico por Aba */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] md:pb-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={handleSelectTab}
            onStartExercise={(type) => handleOpenPractice({ type: type as ExerciseType })}
            learningState={learningState}
            sessionMetrics={sessionMetrics}
          />
        )}

        {activeTab === 'hiragana' && (
          <StudyView
            alphabet="hiragana"
            studiedIds={learningState.studiedCharacterIds}
            onMarkStudied={markAsStudied}
            onUnmarkStudied={unmarkAsStudied}
            onToggleStudied={toggleStudied}
            onSetMultipleStudied={setMultipleStudied}
            onNavigateToPractice={() => handleOpenPractice({ alphabet: 'hiragana' })}
          />
        )}

        {activeTab === 'katakana' && (
          <StudyView
            alphabet="katakana"
            studiedIds={learningState.studiedCharacterIds}
            onMarkStudied={markAsStudied}
            onUnmarkStudied={unmarkAsStudied}
            onToggleStudied={toggleStudied}
            onSetMultipleStudied={setMultipleStudied}
            onNavigateToPractice={() => handleOpenPractice({ alphabet: 'katakana' })}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeContainer
            key={`practice_${practiceSessionKey}`}
            initialType={selectedPracticeType}
            initialAlphabet={selectedPracticeAlphabet}
            autoStart={practiceAutoStart}
            targetCharacters={targetReviewChars}
            studiedCharacterIds={learningState.studiedCharacterIds}
            onSaveSummary={saveSummary}
            onRecordAnswer={recordAnswer}
            onNavigateToStudy={(alphabet) => handleSelectTab(alphabet)}
          />
        )}

        {activeTab === 'review' && (
          <ReviewView
            learningState={learningState}
            onStartReviewSession={handleStartTargetedReview}
            onStartStudiedSession={handleStartTargetedReview}
          />
        )}

      </main>

      {/* Rodapé Elegante */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] py-6 mt-auto text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>NihonGo! • Modo 100% Offline e Seguro no seu Navegador</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Hiragana & Katakana para Falantes de Português Brasileiro (PT-BR)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
