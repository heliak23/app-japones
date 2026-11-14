import React, { useState, useRef } from 'react';
import type { AlphabetType, KanaCharacter } from '../../types/kana';
import type { ExerciseType, ExerciseQuestion, UserAnswerResult, ExerciseSessionSummary } from '../../types/exercise';
import { ExerciseGenerator } from '../../services/exerciseGenerator';
import { ExerciseSelector } from './ExerciseSelector';
import { QuestionView } from './QuestionView';
import { SessionSummaryView } from './SessionSummaryView';
import { useAudio } from '../../hooks/useAudio';
import { KanaDataset } from '../../data/kanaDataset';

interface PracticeContainerProps {
  initialType?: ExerciseType;
  initialAlphabet?: 'all' | AlphabetType;
  autoStart?: boolean;
  targetCharacters?: KanaCharacter[];
  studiedCharacterIds: string[];
  onSaveSummary: (summary: ExerciseSessionSummary) => void;
  onRecordAnswer: (characterId: string, isCorrect: boolean) => void;
  onNavigateToStudy?: (alphabet: 'hiragana' | 'katakana') => void;
}

type PracticeState = 'selecting' | 'running' | 'summary';

export const PracticeContainer: React.FC<PracticeContainerProps> = ({
  initialType,
  initialAlphabet,
  autoStart = false,
  targetCharacters,
  studiedCharacterIds,
  onSaveSummary,
  onRecordAnswer,
  onNavigateToStudy,
}) => {
  // Somente inicia rodando direto se autoStart for explicitamente true.
  // Caso contrário, o usuário sempre vê a tela para escolher a modalidade de exercício.
  const shouldAutoStart = Boolean(
    autoStart && (initialType || (targetCharacters && targetCharacters.length > 0))
  );

  const [state, setState] = useState<PracticeState>(
    shouldAutoStart ? 'running' : 'selecting'
  );

  const [currentQuestions, setCurrentQuestions] = useState<ExerciseQuestion[]>(() => {
    if (!shouldAutoStart) {
      return [];
    }

    if (targetCharacters && targetCharacters.length > 0) {
      return ExerciseGenerator.generateSession(
        'recognition',
        'all',
        targetCharacters.length,
        targetCharacters
      );
    }
    return initialType
      ? ExerciseGenerator.generateSession(initialType, initialAlphabet || 'all', 10)
      : [];
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<UserAnswerResult[]>([]);
  const resultsRef = useRef<UserAnswerResult[]>([]);
  const [score, setScore] = useState(0);
  const [activeSessionSummary, setActiveSessionSummary] = useState<ExerciseSessionSummary | null>(null);

  // Parâmetros para tentar novamente
  const [lastConfig, setLastConfig] = useState<{
    type: ExerciseType;
    alphabet: 'all' | AlphabetType;
    count: number;
    onlyStudied: boolean;
  }>({
    type: initialType || 'recognition',
    alphabet: initialAlphabet || 'all',
    count: 10,
    onlyStudied: targetCharacters && targetCharacters.length > 0 ? true : false,
  });

  const { playKana, isPlaying } = useAudio();

  const handleStart = (
    type: ExerciseType,
    alphabet: 'all' | AlphabetType,
    count: number,
    onlyStudied: boolean
  ) => {
    setLastConfig({ type, alphabet, count, onlyStudied });

    let targets: KanaCharacter[] | undefined = undefined;

    if (onlyStudied) {
      // Coleta somente os caracteres que o usuário já aprendeu/estudou
      targets = studiedCharacterIds
        .map((id) => KanaDataset.getById(id))
        .filter((c): c is KanaCharacter => !!c);
    }

    const questions = ExerciseGenerator.generateSession(type, alphabet, count, targets);
    setCurrentQuestions(questions);
    setCurrentIndex(0);
    resultsRef.current = [];
    setResults([]);
    setScore(0);
    setActiveSessionSummary(null);
    setState('running');
  };

  const handleAnswer = (result: UserAnswerResult) => {
    resultsRef.current = [...resultsRef.current, result];
    setResults(resultsRef.current);

    if (result.isCorrect) {
      setScore((prev) => prev + 10);
    }

    if (result.characterId) {
      onRecordAnswer(result.characterId, result.isCorrect);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex < currentQuestions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishSession();
    }
  };

  const finishSession = () => {
    const finalResults = resultsRef.current.length > 0 ? resultsRef.current : results;
    const totalQuestions = currentQuestions.length;
    const correctCount = finalResults.filter((r) => r.isCorrect).length;
    const incorrectCount = totalQuestions - correctCount;
    const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const finalScore = correctCount * 10;

    const summary: ExerciseSessionSummary = {
      exerciseType: lastConfig.type,
      totalQuestions,
      correctCount,
      incorrectCount,
      percentage,
      score: finalScore,
      results: finalResults,
      completedAt: new Date().toISOString(),
    };

    setActiveSessionSummary(summary);
    onSaveSummary(summary);
    setState('summary');
  };

  const handleRetry = () => {
    handleStart(lastConfig.type, lastConfig.alphabet, lastConfig.count, lastConfig.onlyStudied);
  };

  const handleReviewMistakes = () => {
    const mistakenCharIds = results
      .filter((r) => !r.isCorrect && r.characterId)
      .map((r) => r.characterId as string);

    if (mistakenCharIds.length === 0) return;

    const targetChars = mistakenCharIds
      .map((id) => KanaDataset.getById(id))
      .filter((c): c is NonNullable<typeof c> => !!c);

    const questions = ExerciseGenerator.generateSession(
      'recognition',
      'all',
      targetChars.length,
      targetChars
    );

    setCurrentQuestions(questions);
    setCurrentIndex(0);
    resultsRef.current = [];
    setResults([]);
    setScore(0);
    setState('running');
  };

  const handleChooseAnother = () => {
    setState('selecting');
  };

  return (
    <div>
      {state === 'selecting' && (
        <ExerciseSelector
          onStart={handleStart}
          studiedCharacterIds={studiedCharacterIds}
          initialType={initialType || lastConfig.type}
          initialAlphabet={initialAlphabet || lastConfig.alphabet}
          onNavigateToStudy={onNavigateToStudy}
        />
      )}

      {state === 'running' && currentQuestions.length > 0 && (
        <QuestionView
          key={currentQuestions[currentIndex].id}
          question={currentQuestions[currentIndex]}
          currentIndex={currentIndex}
          totalQuestions={currentQuestions.length}
          currentScore={score}
          onAnswer={handleAnswer}
          onNextQuestion={handleNextQuestion}
          onPlayAudio={(text) => playKana(text)}
          isPlayingAudio={isPlaying}
        />
      )}

      {state === 'summary' && activeSessionSummary && (
        <SessionSummaryView
          summary={activeSessionSummary}
          onRetry={handleRetry}
          onChooseAnother={handleChooseAnother}
          onReviewMistakes={results.some((r) => !r.isCorrect) ? handleReviewMistakes : undefined}
        />
      )}
    </div>
  );
};
