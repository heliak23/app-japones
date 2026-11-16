import { useState } from 'react';
import { Navbar } from './components/common/Navbar';
import type { ActiveTab } from './components/common/Navbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { StudyView } from './components/study/StudyView';
import { PracticeContainer } from './components/practice/PracticeContainer';
import { ReviewView } from './components/review/ReviewView';
import { PhraseTrackView } from './components/phrases/PhraseTrackView';
import { KanjiView } from './components/kanji/KanjiView';
import type { ExerciseType } from './types/exercise';
import type { AlphabetType, KanaCharacter } from './types/kana';
import { KanaDataset } from './data/kanaDataset';
import { useLearningProgress } from './hooks/useLearningProgress';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './components/auth/AuthPage';
import { ResetPasswordModal } from './components/auth/ResetPasswordModal';

export function App() {
  const { user, loading, isPasswordRecovery, setIsPasswordRecovery } = useAuth();
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

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
    dismissReview,
  } = useLearningProgress();

  // 1. Tela de Carregamento inicial enquanto o Supabase verifica a sessão
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-rose-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-brand-500/20 animate-bounce">
          あ
        </div>
        <p className="mt-4 text-sm font-bold text-slate-700 dark:text-slate-300 animate-pulse">
          Carregando NihonGo!...
        </p>
      </div>
    );
  }

  // 2. Se NÃO estiver autenticado, exibe a Página de Login / Cadastro obrigatória
  if (!user) {
    return <AuthPage />;
  }

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
        totalCount={KanaDataset.getAll().length}
        streak={learningState.streak}
        onOpenChangePassword={() => setChangePasswordOpen(true)}
      />

      {/* Conteúdo Dinâmico por Aba */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))] lg:pb-8">
        
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

        {activeTab === 'kanji' && (
          <KanjiView />
        )}

        {activeTab === 'phrases' && (
          <PhraseTrackView />
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
            onDismissReview={dismissReview}
          />
        )}

      </main>

      {/* Rodapé Elegante */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] py-6 mt-auto text-center text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            <span>NihonGo! • Modo 100% Offline e Seguro no seu Navegador</span>
          </div>
          <div className="text-slate-400 dark:text-slate-500">
            Hiragana & Katakana para Falantes de Português Brasileiro (PT-BR)
          </div>
        </div>
      </footer>

      {/* Modal de Redefinição de Senha (Fluxo Esqueci Senha ou Alteração de Senha) */}
      <ResetPasswordModal
        isOpen={isPasswordRecovery || changePasswordOpen}
        isMandatory={isPasswordRecovery}
        onClose={() => {
          setIsPasswordRecovery(false);
          setChangePasswordOpen(false);
        }}
      />
    </div>
  );
}

export default App;
