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
  CheckCircle2,
} from 'lucide-react';

interface StudyViewProps {
  alphabet: AlphabetType;
  studiedIds: string[];
  onMarkStudied: (characterId: string) => void;
  onUnmarkStudied?: (characterId: string) => void;
  onToggleStudied?: (characterId: string) => void;
  onSetMultipleStudied?: (characterIds: string[], studied: boolean) => void;
  onNavigateToPractice?: () => void;
}

type ViewMode = 'table' | 'cards' | 'flashcards';
type FilterGroupType = KanaGroupId | 'all' | 'yoon' | 'special';

export const StudyView: React.FC<StudyViewProps> = ({
  alphabet,
  studiedIds,
  onMarkStudied,
  onToggleStudied,
  onSetMultipleStudied,
  onNavigateToPractice,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [selectedGroup, setSelectedGroup] = useState<FilterGroupType>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<KanaCharacter | null>(null);

  const { playKana, isPlaying, currentText } = useAudio();

  const isHiragana = alphabet === 'hiragana';
  const allAlphabetChars = KanaDataset.getByAlphabet(alphabet);
  const yoonChars = KanaDataset.getYoonByAlphabet(alphabet);
  const specialChars = !isHiragana ? KanaDataset.getSpecialKatakana() : [];
  const fullAlphabetPool = [...allAlphabetChars, ...yoonChars, ...specialChars];

  const studiedInThisAlphabet = allAlphabetChars.filter((c) => studiedIds.includes(c.id));
  const progressPercent = Math.round((studiedInThisAlphabet.length / allAlphabetChars.length) * 100);

  // Filtragem flexível de caracteres para cards e flashcards
  let displayedChars: KanaCharacter[] = allAlphabetChars;
  if (selectedGroup === 'yoon') {
    displayedChars = yoonChars;
  } else if (selectedGroup === 'special') {
    displayedChars = specialChars;
  } else if (selectedGroup !== 'all') {
    displayedChars = fullAlphabetPool.filter((c) => c.group === selectedGroup);
  }

  // Navegação no Modal com suporte a todo o pool (básicos, yoon e especiais)
  const currentIndex = selectedCharacter ? fullAlphabetPool.findIndex((c) => c.id === selectedCharacter.id) : -1;
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < fullAlphabetPool.length - 1 && currentIndex !== -1;

  const handlePrevChar = () => {
    if (hasPrev) setSelectedCharacter(fullAlphabetPool[currentIndex - 1]);
  };

  const handleNextChar = () => {
    if (hasNext) setSelectedCharacter(fullAlphabetPool[currentIndex + 1]);
  };

  const handlePlayAudio = (e: React.MouseEvent | string, char?: string) => {
    const textToPlay = typeof e === 'string' ? e : char;
    if (textToPlay) {
      if (typeof e !== 'string') e.stopPropagation();
      playKana(textToPlay);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner do Alfabeto */}
      <section className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold uppercase tracking-wider bg-brand-50 dark:bg-brand-950/50 text-brand-700 dark:text-brand-300 border border-brand-200 dark:border-brand-800/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isHiragana ? 'Alfabeto Nativo' : 'Alfabeto de Estrangeirismos'}</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-baseline gap-2 sm:gap-3 flex-wrap">
              <span>{isHiragana ? 'Hiragana' : 'Katakana'}</span>
              <span className="font-jp text-xl sm:text-2xl text-slate-400 dark:text-slate-500 font-normal whitespace-nowrap">
                {isHiragana ? 'ひらがな' : 'カタカナ'}
              </span>
            </h1>

            <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-base max-w-2xl leading-relaxed">
              {isHiragana
                ? 'Composto por 46 caracteres básicos curvilíneos, 25 modificados (Tenten/Maru) e 33 combinações Yōon. Utilizado para palavras nativas e partículas gramaticais.'
                : 'Composto por 46 caracteres básicos angulares, 25 modificados, 33 combinações Yōon e 19 sons modernos. Utilizado para palavras ocidentais, nomes próprios e marcas.'}
            </p>
          </div>

          {/* Card de Progresso do Alfabeto Atual */}
          <div className="w-full lg:w-72 bg-slate-50 dark:bg-[#0f172a] p-4 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200/80 dark:border-slate-800 shrink-0 transition-colors">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
              <span>Progresso Base</span>
              <span className="text-brand-600 dark:text-brand-400">
                {studiedInThisAlphabet.length} / {allAlphabetChars.length}
              </span>
            </div>
            <div className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              {progressPercent}% <span className="text-xs font-normal text-slate-400 dark:text-slate-500">concluído</span>
            </div>
            <ProgressBar
              current={studiedInThisAlphabet.length}
              total={allAlphabetChars.length}
              color={isHiragana ? 'brand' : 'amber'}
              size="md"
              showPercentage={false}
            />

            {onNavigateToPractice && (
              <button
                onClick={onNavigateToPractice}
                className={`w-full mt-4 py-2.5 px-3 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm ${
                  isHiragana
                    ? 'bg-brand-600 hover:bg-brand-500 shadow-brand-500/20'
                    : 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20'
                }`}
              >
                <span>Fazer Exercícios deste Alfabeto</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Barra de Controles: Modos de Visualização & Filtros */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Alternador de Modo de Visualização */}
        <div className="grid grid-cols-3 sm:inline-flex p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl w-full sm:w-auto transition-colors gap-1 sm:gap-0">
          <button
            onClick={() => setViewMode('table')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'table'
                ? 'bg-white dark:bg-[#131b2e] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Table className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Tabela</span>
              <span className="hidden sm:inline">Tabela Completa (Gojūon & Yōon)</span>
            </span>
          </button>

          <button
            onClick={() => setViewMode('cards')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'cards'
                ? 'bg-white dark:bg-[#131b2e] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Cards</span>
              <span className="hidden sm:inline">Grade de Cards</span>
            </span>
          </button>

          <button
            onClick={() => setViewMode('flashcards')}
            className={`flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'flashcards'
                ? 'bg-white dark:bg-[#131b2e] text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span className="truncate">
              <span className="sm:hidden">Flashcards</span>
              <span className="hidden sm:inline">Modo Flashcards</span>
            </span>
          </button>
        </div>

        {/* Filtro por Família/Grupo (habilitado em cards e flashcards) */}
        {viewMode !== 'table' && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 dark:text-slate-500 shrink-0" />
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value as FilterGroupType)}
              className="w-full sm:w-auto bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="all">Caracteres Básicos e Modificados ({allAlphabetChars.length})</option>
              <option value="yoon">✨ Combinações Yōon (33 sons: kya, sha...)</option>
              {!isHiragana && (
                <option value="special">🌐 Katakana Especial / Moderno (19 sons: va, fa...)</option>
              )}
              <optgroup label="Famílias Individuais">
                {KANA_GROUPS.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        )}
      </div>

      {/* Conteúdo Principal baseado no Modo de Visualização */}

      {/* Modo 1: Tabela Completa (Gojūon, Dakuon, Yōon, Katakana Especial e Sokuon) */}
      {viewMode === 'table' && (
        <AlphabetTable
          alphabet={alphabet}
          characters={allAlphabetChars}
          studiedIds={studiedIds}
          onSelectCharacter={(char) => setSelectedCharacter(char)}
          onPlayAudio={handlePlayAudio}
          onToggleCharacterStudied={onToggleStudied}
          onToggleRowStudied={(charIds, studied) => onSetMultipleStudied?.(charIds, studied)}
        />
      )}

      {/* Modo 2: Grade de Cards agrupada por famílias */}
      {viewMode === 'cards' && (
        <div className="space-y-8">
          {selectedGroup === 'all' ? (
            KANA_GROUPS.map((group) => {
              const groupChars = allAlphabetChars.filter((c) => c.group === group.id);
              if (groupChars.length === 0) return null;
              const groupCharIds = groupChars.map((c) => c.id);
              const allGroupStudied = groupChars.every((c) => studiedIds.includes(c.id));

              return (
                <div key={group.id} className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
                    <div>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                        {group.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{group.description}</p>
                    </div>

                    {onSetMultipleStudied && (
                      <button
                        type="button"
                        onClick={() => onSetMultipleStudied(groupCharIds, !allGroupStudied)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors self-start sm:self-auto ${
                          allGroupStudied
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-slate-100 dark:bg-[#182238] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{allGroupStudied ? 'Família Concluída' : 'Marcar Família Toda'}</span>
                      </button>
                    )}
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
                        onToggleStudied={onToggleStudied}
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
                  onToggleStudied={onToggleStudied}
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

      {/* Modal de Detalhes do Caractere com navegação sequencial ampliada */}
      <CharacterDetailModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        onNext={handleNextChar}
        onPrev={handlePrevChar}
        hasNext={hasNext}
        hasPrev={hasPrev}
        isStudied={selectedCharacter ? studiedIds.includes(selectedCharacter.id) : false}
        onMarkStudied={onMarkStudied}
        onToggleStudied={onToggleStudied}
        onPlayAudio={(char) => playKana(char)}
        isPlaying={isPlaying}
      />

    </div>
  );
};
