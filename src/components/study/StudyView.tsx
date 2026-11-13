import React, { useState } from 'react';
import type { AlphabetType, KanaCharacter, KanaGroupId } from '../../types/kana';
import { KanaDataset } from '../../data/kanaDataset';
import { KANA_GROUPS } from '../../data/kanaGroups';
import { CharacterCard } from './CharacterCard';
import { AlphabetTable } from './AlphabetTable';
import { FlashcardView } from './FlashcardView';
import { CharacterDetailModal } from './CharacterDetailModal';
import { ProgressBar } from '../common/ProgressBar';
import { useAudio } from '../../hooks/useAudio';
import {
  Table,
  Grid,
  Layers,
  Sparkles,
  Filter,
} from 'lucide-react';

interface StudyViewProps {
  alphabet: AlphabetType;
  studiedIds: string[];
  onMarkStudied: (characterId: string) => void;
  onNavigateToPractice?: () => void;
}

type ViewMode = 'table' | 'cards' | 'flashcards';

export const StudyView: React.FC<StudyViewProps> = ({
  alphabet,
  studiedIds,
  onMarkStudied,
  onNavigateToPractice,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedGroup, setSelectedGroup] = useState<KanaGroupId | 'all'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<KanaCharacter | null>(null);

  const { playKana, isPlaying, currentText } = useAudio();

  const allAlphabetChars = KanaDataset.getByAlphabet(alphabet);
  const studiedInThisAlphabet = allAlphabetChars.filter((c) => studiedIds.includes(c.id));
  const progressPercent = Math.round((studiedInThisAlphabet.length / allAlphabetChars.length) * 100);

  // Filtragem por grupo
  const displayedChars =
    selectedGroup === 'all'
      ? allAlphabetChars
      : allAlphabetChars.filter((c) => c.group === selectedGroup);

  // Navegação no Modal
  const currentIndex = selectedCharacter ? allAlphabetChars.findIndex((c) => c.id === selectedCharacter.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < allAlphabetChars.length - 1 && currentIndex !== -1;

  const handlePrevChar = () => {
    if (hasPrev) setSelectedCharacter(allAlphabetChars[currentIndex - 1]);
  };

  const handleNextChar = () => {
    if (hasNext) setSelectedCharacter(allAlphabetChars[currentIndex + 1]);
  };

  const handlePlayAudio = (e: React.MouseEvent | string, char?: string) => {
    const textToPlay = typeof e === 'string' ? e : char;
    if (textToPlay) {
      if (typeof e !== 'string') e.stopPropagation();
      playKana(textToPlay);
    }
  };

  const isHiragana = alphabet === 'hiragana';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner do Alfabeto */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-50 text-brand-700 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHiragana ? 'Alfabeto Nativo' : 'Alfabeto de Estrangeirismos'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <span>{isHiragana ? 'Hiragana' : 'Katakana'}</span>
              <span className="font-jp text-2xl text-slate-400 font-normal">
                {isHiragana ? 'ひらがな' : 'カタカナ'}
              </span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isHiragana
                ? 'Composto por 46 caracteres básicos curvilíneos. Utilizado para escrever todas as palavras de origem puramente japonesa e as partículas gramaticais.'
                : 'Composto por 46 caracteres básicos angulares e retos. Utilizado para palavras emprestadas de outras línguas (como televisão, café), nomes estrangeiros e onomatopeias.'}
            </p>
          </div>

          {/* Card de Progresso do Alfabeto Atual */}
          <div className="w-full lg:w-72 bg-slate-50 p-5 rounded-2xl border border-slate-200/80 shrink-0">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
              <span>Progresso</span>
              <span className="text-brand-600">{studiedInThisAlphabet.length} / 46</span>
            </div>
            <div className="text-2xl font-black text-slate-900 mb-2">
              {progressPercent}% <span className="text-xs font-normal text-slate-400">concluído</span>
            </div>
            <ProgressBar
              current={studiedInThisAlphabet.length}
              total={46}
              color={isHiragana ? 'brand' : 'amber'}
              size="md"
              showPercentage={false}
            />

            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className="w-full mt-4 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Fazer Exercícios deste Alfabeto</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Barra de Controles: Modos de Visualização & Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Alternador de Modo de Visualização */}
        <div className="inline-flex p-1 bg-slate-200/70 rounded-2xl self-start">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-4 h-4" />
            <span>Tabela Tradicional (Gojūon)</span>
          </button>

          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Grade de Cards</span>
          </button>

          <button
            onClick={() => setViewMode('flashcards')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'flashcards'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Modo Flashcards</span>
          </button>
        </div>

        {/* Filtro por Família/Grupo (habilitado em cards e flashcards) */}
        {viewMode !== 'table' && (
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as KanaGroupId | 'all')}
              className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Todas as 11 Famílias (46 caracteres)</option>
              {KANA_GROUPS.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Conteúdo Principal baseado no Modo de Visualização */}

      {/* Modo 1: Tabela Tradicional Gojūon */}
      {viewMode === 'table' && (
        <AlphabetTable
          alphabet={alphabet}
          characters={allAlphabetChars}
          studiedIds={studiedIds}
          onSelectCharacter={(char) => setSelectedCharacter(char)}
          onPlayAudio={handlePlayAudio}
        />
      )}

      {/* Modo 2: Grade de Cards agrupada por famílias */}
      {viewMode === 'cards' && (
        <div className="space-y-8">
          {selectedGroup === 'all' ? (
            KANA_GROUPS.map((group) => {
              const groupChars = allAlphabetChars.filter((c) => c.group === group.id);
              if (groupChars.length === 0) return null;

              return (
                <div key={group.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate-100 pb-3 gap-1">
                    <h3 className="font-extrabold text-lg text-slate-900">
                      {group.name}
                    </h3>
                    <p className="text-xs text-slate-500">{group.description}</p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                    {groupChars.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        isStudied={studiedIds.includes(char.id)}
                        isPlaying={isPlaying && currentText === char.character}
                        onPlayAudio={handlePlayAudio}
                        onSelect={(c) => setSelectedCharacter(c)}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {displayedChars.map((char) => (
                <CharacterCard
                  key={char.id}
                  character={char}
                  isStudied={studiedIds.includes(char.id)}
                  isPlaying={isPlaying && currentText === char.character}
                  onPlayAudio={handlePlayAudio}
                  onSelect={(c) => setSelectedCharacter(c)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modo 3: Flashcards de Memorização */}
      {viewMode === 'flashcards' && (
        <FlashcardView
          characters={displayedChars}
          studiedIds={studiedIds}
          onMarkStudied={onMarkStudied}
          onPlayAudio={(char) => playKana(char)}
          isPlaying={isPlaying}
        />
      )}

      {/* Modal de Detalhes do Caractere com navegação sequencial */}
      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        onNext={handleNextChar}
        onPrev={handlePrevChar}
        hasNext={hasNext}
        hasPrev={hasPrev}
        isStudied={selectedCharacter ? studiedIds.includes(selectedCharacter.id) : false}
        onMarkStudied={onMarkStudied}
        onPlayAudio={(char) => playKana(char)}
        isPlaying={isPlaying}
      />

    </div>
  );
};
