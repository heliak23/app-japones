import React from 'react';
import type { AlphabetType, KanaCharacter } from '../../types/kana';
import { Volume2, CheckCircle2 } from 'lucide-react';

interface AlphabetTableProps {
  alphabet: AlphabetType;
  characters: KanaCharacter[];
  studiedIds: string[];
  onSelectCharacter: (char: KanaCharacter) => void;
  onPlayAudio: (e: React.MouseEvent, char: string) => void;
}

// Estrutura tradicional do Gojūon (50 sons)
// Linhas: '', 'k', 's', 't', 'n', 'h', 'm', 'y', 'r', 'w', 'n_final'
interface GridRow {
  label: string;
  sublabel: string;
  slots: (string | null)[]; // romaji correspondente para as 5 colunas: [a, i, u, e, o]
}

const TABLE_ROWS: GridRow[] = [
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

export const AlphabetTable: React.FC<AlphabetTableProps> = ({
  alphabet,
  characters,
  studiedIds,
  onSelectCharacter,
  onPlayAudio,
}) => {
  // Mapa de Romaji para KanaCharacter
  const charMap = new Map<string, KanaCharacter>();
  characters.forEach((c) => charMap.set(c.romaji.toLowerCase(), c));

  // Caractere 'n' final
  const finalN = charMap.get('n');
  const isFinalNStudied = finalN ? studiedIds.includes(finalN.id) : false;

  const isHiragana = alphabet === 'hiragana';
  const tableHeaderBg = isHiragana ? 'bg-brand-600' : 'bg-amber-600';

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
      {/* Cabeçalho da Tabela */}
      <div className={`p-4 sm:p-5 ${tableHeaderBg} text-white flex flex-col sm:flex-row sm:items-center justify-between gap-2`}>
        <div>
          <h3 className="font-extrabold text-lg sm:text-xl tracking-tight">
            Tabela Tradicional Gojūon (五十音)
          </h3>
          <p className="text-xs text-white/80">
            A matriz clássica de sons do japonês organizada por 5 vogais e 10 famílias de consoantes
          </p>
        </div>
        <div className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full self-start sm:self-auto">
          Clique em qualquer caractere para estudar detalhes
        </div>
      </div>

      {/* Grade com Scroll Horizontal Responsivo */}
      <div className="overflow-x-auto p-4 sm:p-6">
        <table className="w-full min-w-[580px] border-collapse">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-3 px-2 text-left text-xs font-bold uppercase tracking-wider text-slate-400 w-24">
                Família
              </th>
              {['A', 'I', 'U', 'E', 'O'].map((vowel) => (
                <th key={vowel} className="py-3 px-2 text-center text-sm font-extrabold text-slate-700">
                  <div className="inline-flex flex-col items-center">
                    <span>Coluna {vowel}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {TABLE_ROWS.map((row) => (
              <tr key={row.label} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3 px-2">
                  <span className="font-bold text-sm text-slate-900 block">{row.label}</span>
                  <span className="text-[10px] text-slate-400">{row.sublabel}</span>
                </td>

                {row.slots.map((romajiKey, colIdx) => {
                  if (!romajiKey) {
                    return (
                      <td key={colIdx} className="py-2 px-1.5 text-center">
                        <div className="h-16 rounded-xl bg-slate-50/50 border border-dashed border-slate-200 flex items-center justify-center">
                          <span className="text-xs text-slate-300 font-mono">—</span>
                        </div>
                      </td>
                    );
                  }

                  const char = charMap.get(romajiKey);
                  if (!char) return <td key={colIdx} />;

                  const isStudied = studiedIds.includes(char.id);

                  return (
                    <td key={colIdx} className="py-2 px-1.5 text-center">
                      <div
                        onClick={() => onSelectCharacter(char)}
                        className={`group relative h-16 rounded-xl border p-2 flex flex-col justify-between items-center cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md ${
                          isStudied
                            ? 'bg-emerald-50/40 border-emerald-200/80 hover:border-emerald-400'
                            : 'bg-white border-slate-200 hover:border-slate-400'
                        }`}
                      >
                        {/* Indicador de Estudado */}
                        {isStudied && (
                          <div className="absolute top-1 right-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-500 fill-emerald-100" />
                          </div>
                        )}

                        {/* Caractere Japonês */}
                        <span className="font-jp text-2xl font-black text-slate-900 leading-none mt-0.5">
                          {char.character}
                        </span>

                        {/* Romaji + Botão de áudio sutil */}
                        <div className="w-full flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
                          <span className="uppercase">{char.romaji}</span>
                          <button
                            onClick={(e) => onPlayAudio(e, char.character)}
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-800 transition-opacity p-0.5"
                            title="Ouvir som"
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Linha especial para o 'N' final */}
        {finalN && (
          <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between bg-slate-50 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <div
                onClick={() => onSelectCharacter(finalN)}
                className={`w-14 h-14 rounded-xl border flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-all shadow-sm ${
                  isFinalNStudied
                    ? 'bg-emerald-50 border-emerald-300'
                    : 'bg-white border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="font-jp text-2xl font-black text-slate-900 leading-none">
                  {finalN.character}
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase mt-0.5">
                  {finalN.romaji}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-slate-900">
                    Caractere Especial Final (ん / ン)
                  </h4>
                  {isFinalNStudied && (
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                      Estudado
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  A única consoante isolada do japonês. Possui som nasal próprio e encerra sílabas.
                </p>
              </div>
            </div>

            <button
              onClick={(e) => onPlayAudio(e, finalN.character)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <Volume2 className="w-4 h-4 text-brand-600" />
              <span>Ouvir</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

