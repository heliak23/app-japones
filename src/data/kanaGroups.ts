import type { KanaGroupId, KanaGroupInfo } from '../types/kana';

export const KANA_GROUPS: KanaGroupInfo[] = [
  {
    id: 'vowels',
    name: 'Vogais (A, I, U, E, O)',
    description: 'A base fonética de toda a língua japonesa. Sons puros e curtos.',
    rowLabel: 'Vogais',
  },
  {
    id: 'k',
    name: 'Linha K (Ka, Ki, Ku, Ke, Ko)',
    description: 'Consoante K com som claro e seco, como em "casa" ou "quilo".',
    rowLabel: 'K',
  },
  {
    id: 's',
    name: 'Linha S (Sa, Shi, Su, Se, So)',
    description: 'Atenção ao "SHI", pronunciado como "ch" em "chave".',
    rowLabel: 'S',
  },
  {
    id: 't',
    name: 'Linha T (Ta, Chi, Tsu, Te, To)',
    description: 'Atenção ao "CHI" (som de "tchau") e "TSU" (som de "tsunami" / "pizza").',
    rowLabel: 'T',
  },
  {
    id: 'n',
    name: 'Linha N (Na, Ni, Nu, Ne, No)',
    description: 'Consoante nasal limpa, como em "navio" e "noite".',
    rowLabel: 'N',
  },
  {
    id: 'h',
    name: 'Linha H (Ha, Hi, Fu, He, Ho)',
    description: 'Som aspirado similar ao "house" em inglês ou ao "r" de "rua". Atenção ao "FU" suave soprando entre os lábios.',
    rowLabel: 'H',
  },
  {
    id: 'm',
    name: 'Linha M (Ma, Mi, Mu, Me, Mo)',
    description: 'Consoante M idêntica ao português de "mãe" e "muro".',
    rowLabel: 'M',
  },
  {
    id: 'y',
    name: 'Linha Y (Ya, Yu, Yo)',
    description: 'Semivogal com som de "i" semivocálico: "iá", "iú", "ió". Possui apenas 3 caracteres.',
    rowLabel: 'Y',
  },
  {
    id: 'r',
    name: 'Linha R (Ra, Ri, Ru, Re, Ro)',
    description: 'Sempre com a ponta da língua vibrando suavemente no céu da boca, como em "arara", NUNCA como o "r" de "rato".',
    rowLabel: 'R',
  },
  {
    id: 'w',
    name: 'Linha W (Wa, Wo)',
    description: '"WA" soa como "uá". "WO" é pronunciado simplesmente como "o" e usado como partícula gramatical.',
    rowLabel: 'W',
  },
  {
    id: 'n_final',
    name: 'Caractere Especial N (ん / ン)',
    description: 'A única consoante isolada do japonês. Som nasal profundo no final de sílabas.',
    rowLabel: 'N Final',
  },
];

export const GROUP_MAP: Record<KanaGroupId, KanaGroupInfo> = KANA_GROUPS.reduce(
  (acc, curr) => {
    acc[curr.id] = curr;
    return acc;
  },
  {} as Record<KanaGroupId, KanaGroupInfo>
);

