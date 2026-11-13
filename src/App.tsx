import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudyView } from './components/study/StudyView';
import { PracticeContainer } from './components/practice/PracticeContainer';
import { ReviewView } from './components/review/ReviewView';
import type { ExerciseType } from './types/exercise';
import type { KanaCharacter } from './types/kana';
import { KanaDataset } from './data/kanaDataset';
import { useLearningProgress } from './hooks/useLearningProgress';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [selectedPracticeType, setSelectedPracticeType] = useState<ExerciseType | undefined>(undefined);
  const [targetReviewChars, setTargetReviewChars] = useState<KanaCharacter[] | undefined>(undefined);
  
  const {
    learningState,
    sessionMetrics,
    markAsStudied,
    saveSummary,
    recordAnswer,
    resetProgress,
  } = useLearningProgress();

  const handleStartExercise = (exerciseType?: string) => {
    setTargetReviewChars(undefined);
    setSelectedPracticeType((exerciseType as ExerciseType) || undefined);
    setActiveTab('practice');
  };

  const handleStartTargetedReview = (characterIds: string[]) => {
    const chars = characterIds
      .map((id) => KanaDataset.getById(id))
      .filter((c): c is KanaCharacter => !!c);

    setTargetReviewChars(chars);
    setSelectedPracticeType('review_random');
    setActiveTab('practice');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800 selection:bg-brand-100 selection:text-brand-900">
      {/* Navbar Superior & Navegação Móvel */}
      <Navbar 
        activeTab={activeTab} 
        onSelectTab={setActiveTab} 
        studiedCount={learningState.studiedCharacterIds.length}
        totalCount={92}
        onResetProgress={resetProgress}
      />

      {/* Conteúdo Dinâmico por Aba */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {activeTab === 'dashboard' && (
          <DashboardView
            onNavigate={setActiveTab}
            onStartExercise={handleStartExercise}
            learningState={learningState}
            sessionMetrics={sessionMetrics}
          />
        )}

        {activeTab === 'hiragana' && (
          <StudyView
            alphabet="hiragana"
            studiedIds={learningState.studiedCharacterIds}
            onMarkStudied={markAsStudied}
            onNavigateToPractice={() => handleStartExercise('recognition')}
          />
        )}

        {activeTab === 'katakana' && (
          <StudyView
            alphabet="katakana"
            studiedIds={learningState.studiedCharacterIds}
            onMarkStudied={markAsStudied}
            onNavigateToPractice={() => handleStartExercise('recognition')}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeContainer
            key={`${selectedPracticeType || 'default'}_${targetReviewChars?.length || 0}`}
            initialType={selectedPracticeType}
            targetCharacters={targetReviewChars}
            studiedCharacterIds={learningState.studiedCharacterIds}
            onSaveSummary={saveSummary}
            onRecordAnswer={recordAnswer}
            onNavigateToStudy={(alphabet) => setActiveTab(alphabet)}
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
      <footer className="border-t border-slate-200 bg-white py-6 mt-auto text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>NihonGo! • Modo 100% Offline e Seguro no seu Navegador</span>
          </div>
          <div className="text-slate-400">
            Hiragana & Katakana para Falantes de Português Brasileiro (PT-BR)
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
