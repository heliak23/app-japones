import React, { useState } from 'react';
import type { AlphabetType, KanaCharacter } from '../../types/kana';
import { KanaDataset } from '../../data/kanaDataset';
import { Volume2, CheckCircle2, Check, Minus, Sparkles, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface AlphabetTableProps {
  alphabet: AlphabetType;
  characters: KanaCharacter[];
  studiedIds: string[];
  onSelectCharacter: (char: KanaCharacter) => void;
  onPlayAudio: (e: React.MouseEvent, char: string) => void;
  onToggleCharacterStudied?: (characterId: string) => void;
  onToggleRowStudied?: (characterIds: string[], studied: boolean) => void;
}

interface GridRow {
  label: string;
  sublabel: string;
  slots: (string | null)[];
}

// 1. Estrutura tradicional do Gojūon (50 sons básicos)
const GOJUON_ROWS: GridRow[] = [
  { label: 'Vogais', sublabel: 'Puras', slots: ['a', 'i', 'u', 'e', 'o'] },
  { label: 'K', sublabel: 'Ka', slots: ['ka', 'ki', 'ku', 'ke', 'ko'] },
  { label: 'S', sublabel: 'Sa', slots: ['sa', 'shi', 'su', 'se', 'so'] },
  { label: 'T', sublabel: 'Ta', slots: ['ta', 'chi', 'tsu', 'te', 'to'] },
  { label: 'N', sublabel: 'Na', slots: ['na', 'ni', 'nu', 'ne', 'no'] },
  { label: 'H', sublabel: 'Ha', slots: ['ha', 'hi', 'fu', 'he', 'ho'] },
  { label: 'M', sublabel: 'Ma', slots: ['ma', 'mi', 'mu', 'me', 'mo'] },
  { label: 'Y', sublabel: 'Ya', slots: ['ya', null, 'yu', null, 'yo'] },
  { label: 'R', sublabel: 'Ra', slots: ['ra', 'ri', 'ru', 're', 'ro'] },
  { label: 'W', sublabel: 'Wa', slots: ['wa', null, null, null, 'wo'] },
];

// 2. Modificações Fonéticas (Dakuon e Handakuon)
const DAKUON_ROWS: GridRow[] = [
  { label: 'G', sublabel: 'Ga', slots: ['ga', 'gi', 'gu', 'ge', 'go'] },
  { label: 'Z', sublabel: 'Za', slots: ['za', 'z_ji', 'z_zu', 'ze', 'zo'] },
  { label: 'D', sublabel: 'Da', slots: ['da', 'd_ji', 'd_zu', 'de', 'do'] },
  { label: 'B', sublabel: 'Ba', slots: ['ba', 'bi', 'bu', 'be', 'bo'] },
  { label: 'P', sublabel: 'Pa', slots: ['pa', 'pi', 'pu', 'pe', 'po'] },
];

export const AlphabetTable: React.FC<AlphabetTableProps> = ({
  alphabet,
  characters,
  studiedIds,
  onSelectCharacter,
  onPlayAudio,
  onToggleCharacterStudied,
  onToggleRowStudied,
}) => {
  const isHiragana = alphabet === 'hiragana';
  const tableHeaderBg = isHiragana ? 'bg-brand-600 dark:bg-brand-700' : 'bg-amber-600 dark:bg-amber-700';

  // Yōon Characters
  const yoonChars = KanaDataset.getYoonByAlphabet(alphabet);
  const yoonRows = KanaDataset.getYoonRows();
  const specialKatakana = !isHiragana ? KanaDataset.getSpecialKatakana() : [];
  const sokuonExamples = KanaDataset.getSokuonExamples(alphabet);
  const choonpuExamples = !isHiragana ? KanaDataset.getChoonpuExamples() : [];

  // Mapa consolidado de Kanas
  const charMap = new Map<string, KanaCharacter>();
  characters.forEach((c) => {
    charMap.set(c.romaji.toLowerCase(), c);
    charMap.set(c.id, c);
    charMap.set(`${c.group}_${c.romaji.toLowerCase()}`, c);
  });

  // Mapeia também os caracteres de Yōon
  const yoonMap = new Map<string, KanaCharacter>();
  yoonChars.forEach((c) => {
    yoonMap.set(c.romaji.toLowerCase(), c);
    yoonMap.set(c.id, c);
  });

  // Caractere 'n' final
  const finalN = charMap.get('n');
  const isFinalNStudied = finalN ? studiedIds.includes(finalN.id) : false;

  // Status geral do alfabeto base
  const allAlphabetIds = characters.map((c) => c.id);
  const studiedInThisAlphabet = allAlphabetIds.filter((id) => studiedIds.includes(id)).length;
  const isAllAlphabetStudied = allAlphabetIds.length > 0 && studiedInThisAlphabet === allAlphabetIds.length;
  const isPartiallyAlphabetStudied = studiedInThisAlphabet > 0 && !isAllAlphabetStudied;

  // Status do Yōon
  const allYoonIds = yoonChars.map((c) => c.id);
  const studiedYoonCount = allYoonIds.filter((id) => studiedIds.includes(id)).length;

  // Estados de acordeão para seções didáticas
  const [showSokuon, setShowSokuon] = useState(false);
  const [showChoonpu, setShowChoonpu] = useState(false);

  // Renderizador de célula genérica de caractere
  const renderCell = (char: KanaCharacter | undefined | null) => {
    if (!char) {
      return (
        <div className="h-13 sm:h-16 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center">
          <span className="text-xs text-slate-300 dark:text-slate-600 font-mono">—</span>
        </div>
      );
    }

    const isStudied = studiedIds.includes(char.id);

    return (
      <div
        onClick={() => onSelectCharacter(char)}
        className={`group relative h-13 sm:h-16 rounded-xl border p-1 sm:p-2 flex flex-col justify-between items-center cursor-pointer transition-all duration-150 active:scale-95 hover:scale-105 hover:shadow-md ${
          isStudied
            ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800/80 hover:border-emerald-400'
            : 'bg-white dark:bg-[#182238] border-slate-200 dark:border-slate-700/80 hover:border-slate-400 dark:hover:border-slate-500'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleCharacterStudied?.(char.id);
          }}
          title={
            isStudied
              ? `Desmarcar ${char.character} (${char.romaji})`
              : `Marcar ${char.character} (${char.romaji}) como estudado`
          }
          className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-all z-10"
        >
          {isStudied ? (
            <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/60" />
          ) : (
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full border border-slate-300 dark:border-slate-600 block opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </button>

        <span className="font-jp text-base sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-none mt-0.5 sm:mt-1">
          {char.character}
        </span>

        <div className="w-full flex items-center justify-center sm:justify-between text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 px-0.5 sm:px-1">
          <span className="uppercase tracking-tight sm:tracking-normal">{char.romaji}</span>
          <button
            onClick={(e) => onPlayAudio(e, char.character)}
            className="hidden sm:block opacity-0 group-hover:opacity-100 text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-opacity p-0.5"
            title="Ouvir som"
          >
            <Volume2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // Renderizador de linha Gojūon / Dakuon
  const renderRow = (row: GridRow) => {
    const validCharsInRow = row.slots
      .map((key) => (key ? charMap.get(key) : null))
      .filter((c): c is KanaCharacter => !!c);
    const rowCharIds = validCharsInRow.map((c) => c.id);
    const studiedInRow = rowCharIds.filter((id) => studiedIds.includes(id)).length;
    const isAllRowStudied = validCharsInRow.length > 0 && studiedInRow === validCharsInRow.length;
    const isPartiallyStudied = studiedInRow > 0 && !isAllRowStudied;

    return (
      <tr key={row.label} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
        <td className="py-1.5 sm:py-3 px-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2">
            <button
              type="button"
              role="checkbox"
              aria-checked={isAllRowStudied ? 'true' : isPartiallyStudied ? 'mixed' : 'false'}
              onClick={() => onToggleRowStudied?.(rowCharIds, !isAllRowStudied)}
              title={
                isAllRowStudied
                  ? `Desmarcar toda linha ${row.label} (${studiedInRow}/${validCharsInRow.length})`
                  : `Marcar toda linha ${row.label} (${studiedInRow}/${validCharsInRow.length})`
              }
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                isAllRowStudied
                  ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                  : isPartiallyStudied
                  ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                  : 'bg-white dark:bg-[#182238] border-slate-300 dark:border-slate-700 hover:border-slate-400'
              }`}
            >
              {isAllRowStudied ? (
                <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
              ) : isPartiallyStudied ? (
                <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
              ) : null}
            </button>

            <div className="leading-tight text-center sm:text-left">
              <span className="font-extrabold text-[11px] sm:text-sm text-slate-900 dark:text-white block">
                {row.label === 'Vogais' ? (
                  <>
                    <span className="sm:hidden">Vog.</span>
                    <span className="hidden sm:inline">Vogais</span>
                  </>
                ) : (
                  row.label
                )}
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                {row.sublabel}
              </span>
            </div>
          </div>
        </td>

        {row.slots.map((key, colIdx) => (
          <td key={colIdx} className="py-1 sm:py-2 px-0.5 sm:px-1.5 text-center">
            {renderCell(key ? charMap.get(key) : null)}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div className="space-y-8">
      {/* 1. Tabela Gojūon Básica */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className={`p-3.5 sm:p-5 ${tableHeaderBg} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
          <div>
            <h3 className="font-extrabold text-base sm:text-xl tracking-tight">
              Tabela Tradicional Gojūon (五十音)
            </h3>
            <p className="text-xs text-white/85">
              A matriz clássica de 46 sons organizada por 5 vogais e 10 famílias de consoantes
            </p>
          </div>
          <div className="text-[11px] sm:text-xs font-semibold bg-white/20 dark:bg-black/20 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto">
            {studiedInThisAlphabet}/{allAlphabetIds.length} dominados
          </div>
        </div>

        <div className="overflow-x-auto p-1.5 sm:p-6">
          <table className="w-full table-fixed border-collapse min-w-[320px] sm:min-w-[540px]">
            <colgroup>
              <col className="w-11 sm:w-24" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center sm:text-left text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isAllAlphabetStudied ? 'true' : isPartiallyAlphabetStudied ? 'mixed' : 'false'}
                      onClick={() => onToggleRowStudied?.(allAlphabetIds, !isAllAlphabetStudied)}
                      title={
                        isAllAlphabetStudied
                          ? 'Desmarcar todo o alfabeto'
                          : `Marcar todos os caracteres (${studiedInThisAlphabet}/${allAlphabetIds.length})`
                      }
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                        isAllAlphabetStudied
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : isPartiallyAlphabetStudied
                          ? 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300'
                          : 'bg-white dark:bg-[#182238] border-slate-300 dark:border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      {isAllAlphabetStudied ? (
                        <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                      ) : isPartiallyAlphabetStudied ? (
                        <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                      ) : null}
                    </button>
                    <span className="sm:hidden text-[10px]">Tudo</span>
                    <span className="hidden sm:inline">Famílias</span>
                  </div>
                </th>
                {['A', 'I', 'U', 'E', 'O'].map((vowel) => (
                  <th key={vowel} className="py-2 sm:py-3 px-0.5 sm:px-2 text-center text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    <span className="sm:hidden">{vowel}</span>
                    <span className="hidden sm:inline">Coluna {vowel}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {GOJUON_ROWS.map(renderRow)}
            </tbody>
          </table>

          {/* Caractere Especial Final N */}
          {finalN && (
            <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 dark:bg-[#0f172a] p-3 sm:p-4 rounded-xl sm:rounded-2xl transition-colors">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={isFinalNStudied}
                  onClick={() => onToggleCharacterStudied?.(finalN.id)}
                  title={isFinalNStudied ? 'Desmarcar caractere especial N' : 'Marcar caractere especial N como estudado'}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                    isFinalNStudied
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                      : 'bg-white dark:bg-[#182238] border-slate-300 dark:border-slate-700 hover:border-slate-400'
                  }`}
                >
                  {isFinalNStudied && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </button>

                <div
                  onClick={() => onSelectCharacter(finalN)}
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl border flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-sm shrink-0 ${
                    isFinalNStudied
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-300 dark:border-emerald-800'
                      : 'bg-white dark:bg-[#182238] border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                  }`}
                >
                  <span className="font-jp text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 leading-none">
                    {finalN.character}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                    {finalN.romaji}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                      Caractere Especial Final ({finalN.character})
                    </h4>
                    {isFinalNStudied && (
                      <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800/60">
                        Estudado
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Consoante nasal que encerra sílabas japonesas.
                  </p>
                </div>
              </div>

              <button
                onClick={(e) => onPlayAudio(e, finalN.character)}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#182238] border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shrink-0"
              >
                <Volume2 className="w-4 h-4 text-brand-600 dark:text-brand-400" />
                <span>Ouvir Som</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 2. Tabela de Modificações Fonéticas (Dakuon e Handakuon) */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 dark:from-slate-800 dark:to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-600/30 dark:border-slate-700/60 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white border border-white/30">
                <Sparkles className="w-3 h-3" />
                Dakuon & Handakuon (濁音・半濁音)
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-xl tracking-tight mt-1">
              Sons Sonoros & Modificados
            </h3>
            <p className="text-xs text-white/90">
              Variações sonoras formadas com dakuten (<span className="text-amber-200 font-bold">゛</span>) nas linhas G, Z, D, B e handakuten (<span className="text-amber-200 font-bold">゜</span>) na linha P
            </p>
          </div>
          <div className="text-[11px] sm:text-xs font-semibold bg-white/20 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto text-white">
            25 novos sons fonéticos
          </div>
        </div>

        <div className="overflow-x-auto p-1.5 sm:p-6">
          <table className="w-full table-fixed border-collapse min-w-[320px] sm:min-w-[540px]">
            <colgroup>
              <col className="w-11 sm:w-24" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
              <col className="w-[17.8%] sm:w-[15.2%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center sm:text-left text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  <span className="sm:hidden text-[10px]">Fam.</span>
                  <span className="hidden sm:inline">Famílias</span>
                </th>
                {['A', 'I', 'U', 'E', 'O'].map((vowel) => (
                  <th key={vowel} className="py-2 sm:py-3 px-0.5 sm:px-2 text-center text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                    <span className="sm:hidden">{vowel}</span>
                    <span className="hidden sm:inline">Coluna {vowel}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {DAKUON_ROWS.map(renderRow)}
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. Tabela de Combinações Yōon (33 sons contraídos) */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-3.5 sm:p-5 bg-gradient-to-r from-purple-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-800/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-purple-400/20 text-purple-200 border border-purple-400/30">
                <Sparkles className="w-3 h-3" />
                Yōon (拗音) • 33 Combinações
              </span>
            </div>
            <h3 className="font-extrabold text-base sm:text-xl tracking-tight mt-1">
              Sons Contraídos (Junção com {isHiragana ? 'ゃ, ゅ, ょ' : 'ャ, ュ, ョ'} pequenos)
            </h3>
            <p className="text-xs text-purple-200/90">
              Formados unindo os caracteres da coluna "I" (ki, shi, chi...) com versões reduzidas de Ya, Yu e Yo em uma só sílaba.
            </p>
          </div>
          <div className="text-[11px] sm:text-xs font-semibold bg-white/10 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto text-purple-100">
            {studiedYoonCount}/33 dominados
          </div>
        </div>

        <div className="overflow-x-auto p-1.5 sm:p-6">
          <table className="w-full table-fixed border-collapse min-w-[320px] sm:min-w-[500px]">
            <colgroup>
              <col className="w-16 sm:w-28" />
              <col className="w-[28%]" />
              <col className="w-[28%]" />
              <col className="w-[28%]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800">
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center sm:text-left text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  Base (I)
                </th>
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  Coluna YA ({isHiragana ? 'ゃ' : 'ャ'})
                </th>
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  Coluna YU ({isHiragana ? 'ゅ' : 'ュ'})
                </th>
                <th className="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm font-extrabold text-slate-700 dark:text-slate-300">
                  Coluna YO ({isHiragana ? 'ょ' : 'ョ'})
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {yoonRows.map((row) => {
                const charsInRow = row.slots.map((s) => yoonMap.get(s)).filter((c): c is KanaCharacter => !!c);
                const rowIds = charsInRow.map((c) => c.id);
                const allRowStudied = charsInRow.length > 0 && charsInRow.every((c) => studiedIds.includes(c.id));
                const partRowStudied = charsInRow.some((c) => studiedIds.includes(c.id)) && !allRowStudied;

                return (
                  <tr key={row.label} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 sm:py-3 px-1 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={allRowStudied ? 'true' : partRowStudied ? 'mixed' : 'false'}
                          onClick={() => onToggleRowStudied?.(rowIds, !allRowStudied)}
                          title={allRowStudied ? `Desmarcar linha Yōon ${row.label}` : `Marcar linha Yōon ${row.label}`}
                          className={`w-4 h-4 sm:w-5 sm:h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer shrink-0 ${
                            allRowStudied
                              ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                              : partRowStudied
                              ? 'bg-purple-100 dark:bg-purple-950/60 border-purple-500 text-purple-700 dark:text-purple-300'
                              : 'bg-white dark:bg-[#182238] border-slate-300 dark:border-slate-700 hover:border-slate-400'
                          }`}
                        >
                          {allRowStudied ? (
                            <Check className="w-3 h-3 sm:w-3.5 sm:h-3.5 stroke-[3]" />
                          ) : partRowStudied ? (
                            <Minus className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                          ) : null}
                        </button>

                        <div className="leading-tight text-center sm:text-left">
                          <span className="font-extrabold text-[11px] sm:text-sm text-slate-900 dark:text-white block">
                            Linha {row.label}
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 hidden sm:block">
                            {row.sublabel}
                          </span>
                        </div>
                      </div>
                    </td>

                    {row.slots.map((romaji) => (
                      <td key={romaji} className="py-1 sm:py-2 px-1 sm:px-2 text-center">
                        {renderCell(yoonMap.get(romaji))}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Katakana Sons Especiais Modernos (Apenas para Katakana) */}
      {!isHiragana && specialKatakana.length > 0 && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-3.5 sm:p-5 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-teal-700/60">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-400/20 text-teal-200 border border-teal-400/30">
                  <Sparkles className="w-3 h-3" />
                  Katakana Especial (Gairaigo)
                </span>
              </div>
              <h3 className="font-extrabold text-base sm:text-xl tracking-tight mt-1">
                Sons Estrangeiros Modernos (Va, Fa, Wi, Ti...)
              </h3>
              <p className="text-xs text-teal-200/90">
                Criados para expressar sons que não existiam no japonês clássico ao importar palavras do ocidente.
              </p>
            </div>
            <div className="text-[11px] sm:text-xs font-semibold bg-white/10 px-2.5 sm:px-3 py-1 rounded-full self-start sm:self-auto text-teal-100">
              19 sons modernos
            </div>
          </div>

          <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-3">
            {specialKatakana.map((char) => (
              <div key={char.id}>
                {renderCell(char)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Guia Interativo do Sokuon (Pausa Fonética っ / ッ) */}
      <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <button
          type="button"
          onClick={() => setShowSokuon(!showSokuon)}
          className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100/80 dark:hover:bg-[#151f36] flex items-center justify-between transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-brand-600 dark:text-rose-400 flex items-center justify-center font-jp font-black text-xl shrink-0">
              {isHiragana ? 'っ' : 'ッ'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                  Sokuon (促音) • O "Tsu Pequeno" e a Pausa de Ar
                </h4>
                <span className="text-[10px] font-bold bg-brand-100 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 px-2 py-0.5 rounded-full">
                  Guia Prático
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Aprenda como o corte de ar funciona na pronúncia real com exemplos em áudio
              </p>
            </div>
          </div>
          <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            {showSokuon ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showSokuon && (
          <div className="p-4 sm:p-6 space-y-4 border-t border-slate-200 dark:border-slate-800">
            <div className="bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/70 dark:border-brand-900/50 p-4 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              <p className="font-semibold text-brand-900 dark:text-brand-300 mb-1 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" /> Dica de Ouro da Apostila:
              </p>
              Ao ver um <span className="font-jp font-black text-brand-600 dark:text-rose-400">{isHiragana ? 'っ' : 'ッ'} pequeno</span>, a boca corta o fluxo de ar por um instante antes de soltar a sílaba seguinte. Na romanização ocidental, isso é representado duplicando a consoante seguinte (ex: <em>k</em>, <em>s</em>, <em>t</em>, <em>p</em>).
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sokuonExamples.map((ex) => (
                <div
                  key={ex.word}
                  className="bg-slate-50 dark:bg-[#182238] border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:border-brand-400 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="font-jp text-xl font-black text-slate-900 dark:text-white block leading-tight">
                        {ex.word}
                      </span>
                      <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 uppercase tracking-wide">
                        {ex.romaji}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => onPlayAudio(e, ex.word)}
                      className="p-2 rounded-lg bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-brand-600 hover:border-brand-400 transition-all shadow-xs"
                      title="Ouvir pronúncia com pausa"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      {ex.translation}
                    </span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                      {ex.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 6. Guia do Sinal de Prolongamento (ー) para Katakana */}
      {!isHiragana && (
        <div className="bg-white dark:bg-[#131b2e] rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <button
            type="button"
            onClick={() => setShowChoonpu(!showChoonpu)}
            className="w-full p-4 sm:p-5 bg-slate-50 dark:bg-[#0f172a] hover:bg-slate-100/80 dark:hover:bg-[#151f36] flex items-center justify-between transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center font-jp font-black text-2xl shrink-0">
                ー
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                    Chōonpu (ー) • O Sinal de Prolongamento do Katakana
                  </h4>
                  <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full">
                    Essencial
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Dobra o tempo de pronúncia da vogal anterior para reproduzir palavras importadas
                </p>
              </div>
            </div>
            <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              {showChoonpu ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
          </button>

          {showChoonpu && (
            <div className="p-4 sm:p-6 space-y-4 border-t border-slate-200 dark:border-slate-800">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {choonpuExamples.map((ex) => (
                  <div
                    key={ex.word}
                    className="bg-slate-50 dark:bg-[#182238] border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-3.5 flex flex-col justify-between gap-2.5 hover:border-amber-400 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-jp text-xl font-black text-slate-900 dark:text-white block leading-tight">
                          {ex.word}
                        </span>
                        <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          {ex.romaji}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => onPlayAudio(e, ex.word)}
                        className="p-2 rounded-lg bg-white dark:bg-[#131b2e] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-amber-600 hover:border-amber-400 transition-all shadow-xs"
                        title="Ouvir pronúncia prolongada"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {ex.translation}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                        {ex.explanation}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
