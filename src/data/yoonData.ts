import type { KanaCharacter, PhoneticFeatureExample } from '../types/kana';

// -------------------------------------------------------------
// 1. HIRAGANA YŌON (33 Combinações Contraídas)
// -------------------------------------------------------------
export const YOON_HIRAGANA_CHARACTERS: KanaCharacter[] = [
  // Linha K (Ki + ya, yu, yo)
  {
    id: 'hira_kya',
    character: 'きゃ',
    romaji: 'kya',
    ptPronunciation: 'Como o som de "quiá" pronunciado de forma rápida e unida',
    group: 'yoon_k',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ki (き) + ya pequeno (ゃ). Exemplo: kyaku (cliente).',
  },
  {
    id: 'hira_kyu',
    character: 'きゅ',
    romaji: 'kyu',
    ptPronunciation: 'Como "quiú" rápido e unido, como na letra Q em inglês',
    group: 'yoon_k',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ki (き) + yu pequeno (ゅ). Exemplo: kyuuri (pepino).',
  },
  {
    id: 'hira_kyo',
    character: 'きょ',
    romaji: 'kyo',
    ptPronunciation: 'Como "quió" rápido e único, como em "Kyoto"',
    group: 'yoon_k',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ki (き) + yo pequeno (ょ). Exemplo: kyou (hoje).',
  },

  // Linha S (Shi + ya, yu, yo)
  {
    id: 'hira_sha',
    character: 'しゃ',
    romaji: 'sha',
    ptPronunciation: 'Como o som de "chá" em português',
    group: 'yoon_s',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Shi (し) + ya pequeno (ゃ). Exemplo: shashin (foto).',
  },
  {
    id: 'hira_shu',
    character: 'しゅ',
    romaji: 'shu',
    ptPronunciation: 'Como o som de "chu" em "chupar" ou "chute"',
    group: 'yoon_s',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Shi (し) + yu pequeno (ゅ). Exemplo: shumi (hobby).',
  },
  {
    id: 'hira_sho',
    character: 'しょ',
    romaji: 'sho',
    ptPronunciation: 'Como o som de "chó" em "chocolate"',
    group: 'yoon_s',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Shi (し) + yo pequeno (ょ). Exemplo: shokuji (refeição).',
  },

  // Linha T (Chi + ya, yu, yo)
  {
    id: 'hira_cha',
    character: 'ちゃ',
    romaji: 'cha',
    ptPronunciation: 'Como "tchá" em "tchau"',
    group: 'yoon_t',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Chi (ち) + ya pequeno (ゃ). Exemplo: ocha (chá).',
  },
  {
    id: 'hira_chu',
    character: 'ちゅ',
    romaji: 'chu',
    ptPronunciation: 'Como "tchu" em "tchauzinho" ou "tchurma"',
    group: 'yoon_t',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Chi (ち) + yu pequeno (ゅ). Exemplo: chuusha (injeção).',
  },
  {
    id: 'hira_cho',
    character: 'ちょ',
    romaji: 'cho',
    ptPronunciation: 'Como "tchó", som enérgico e seco',
    group: 'yoon_t',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Chi (ち) + yo pequeno (ょ). Exemplo: chotto (um pouco).',
  },

  // Linha N (Ni + ya, yu, yo)
  {
    id: 'hira_nya',
    character: 'にゃ',
    romaji: 'nya',
    ptPronunciation: 'Como "nhá" em "manhã". O miado do gato em japonês!',
    group: 'yoon_n',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ni (に) + ya pequeno (ゃ). Exemplo: nyanko (gatinho).',
  },
  {
    id: 'hira_nyu',
    character: 'にゅ',
    romaji: 'nyu',
    ptPronunciation: 'Como "nhu" em "nenhum"',
    group: 'yoon_n',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ni (に) + yu pequeno (ゅ). Exemplo: gyuunyuu (leite).',
  },
  {
    id: 'hira_nyo',
    character: 'にょ',
    romaji: 'nyo',
    ptPronunciation: 'Como "nhó" em "nhoque"',
    group: 'yoon_n',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ni (に) + yo pequeno (ょ). Exemplo: nyobou (esposa - tradicional).',
  },

  // Linha H (Hi + ya, yu, yo)
  {
    id: 'hira_hya',
    character: 'ひゃ',
    romaji: 'hya',
    ptPronunciation: 'Como "riá" soprando ar de leve pelo céu da boca',
    group: 'yoon_h',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Hi (ひ) + ya pequeno (ゃ). Exemplo: hyaku (cem - 100).',
  },
  {
    id: 'hira_hyu',
    character: 'ひゅ',
    romaji: 'hyu',
    ptPronunciation: 'Como "riú" aspirado, imitando som de vento',
    group: 'yoon_h',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Hi (ひ) + yu pequeno (ゅ). Exemplo: hyuuga (lugar ensolarado).',
  },
  {
    id: 'hira_hyo',
    character: 'ひょ',
    romaji: 'hyo',
    ptPronunciation: 'Como "rió" aspirado suave',
    group: 'yoon_h',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Hi (ひ) + yo pequeno (ょ). Exemplo: hyoushi (capa de livro).',
  },

  // Linha M (Mi + ya, yu, yo)
  {
    id: 'hira_mya',
    character: 'みゃ',
    romaji: 'mya',
    ptPronunciation: 'Como "miá" rápido e suave',
    group: 'yoon_m',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Mi (み) + ya pequeno (ゃ). Exemplo: myaku (pulso).',
  },
  {
    id: 'hira_myu',
    character: 'みゅ',
    romaji: 'myu',
    ptPronunciation: 'Como "miú" em "miúdo"',
    group: 'yoon_m',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Mi (み) + yu pequeno (ゅ). Exemplo: myuujikku (música).',
  },
  {
    id: 'hira_myo',
    character: 'みょ',
    romaji: 'myo',
    ptPronunciation: 'Como "mió" em "miolo"',
    group: 'yoon_m',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Mi (み) + yo pequeno (ょ). Exemplo: myouji (sobrenome).',
  },

  // Linha R (Ri + ya, yu, yo)
  {
    id: 'hira_rya',
    character: 'りゃ',
    romaji: 'rya',
    ptPronunciation: 'Como "riá" com a ponta da língua vibrando no céu da boca',
    group: 'yoon_r',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ri (り) + ya pequeno (ゃ). Exemplo: ryaku (abreviação).',
  },
  {
    id: 'hira_ryu',
    character: 'りゅ',
    romaji: 'ryu',
    ptPronunciation: 'Como "riú" com o "r" de arara vibrado suavemente',
    group: 'yoon_r',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ri (り) + yu pequeno (ゅ). Exemplo: ryuu (dragão).',
  },
  {
    id: 'hira_ryo',
    character: 'りょ',
    romaji: 'ryo',
    ptPronunciation: 'Como "rió" com o "r" batido suavemente',
    group: 'yoon_r',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ri (り) + yo pequeno (ょ). Exemplo: ryokou (viagem).',
  },

  // Linha G (Gi + ya, yu, yo) • Dakuon
  {
    id: 'hira_gya',
    character: 'ぎゃ',
    romaji: 'gya',
    ptPronunciation: 'Como "guiá" rápido em uma só sílaba',
    group: 'yoon_g',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Gi (ぎ) + ya pequeno (ゃ). Exemplo: gyaku (inverso/oposto).',
  },
  {
    id: 'hira_gyu',
    character: 'ぎゅ',
    romaji: 'gyu',
    ptPronunciation: 'Como "guiú" rápido, famoso em gyuudon (tigela de carne)',
    group: 'yoon_g',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Gi (ぎ) + yu pequeno (ゅ). Exemplo: gyuuniku (carne bovina).',
  },
  {
    id: 'hira_gyo',
    character: 'ぎょ',
    romaji: 'gyo',
    ptPronunciation: 'Como "guió" rápido e firme',
    group: 'yoon_g',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Gi (ぎ) + yo pequeno (ょ). Exemplo: gyouza (pastel japonês).',
  },

  // Linha J (Ji + ya, yu, yo) • Dakuon
  {
    id: 'hira_ja',
    character: 'じゃ',
    romaji: 'ja',
    ptPronunciation: 'Como "djá" ou "já" suave. Exatamente o "ja" de "janai"',
    group: 'yoon_j',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ji (じ) + ya pequeno (ゃ). Exemplo: ja, mata ne (até logo).',
  },
  {
    id: 'hira_ju',
    character: 'じゅ',
    romaji: 'ju',
    ptPronunciation: 'Como "dju" ou "ju" em "judo"',
    group: 'yoon_j',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ji (じ) + yu pequeno (ゅ). Exemplo: juusho (endereço).',
  },
  {
    id: 'hira_jo',
    character: 'じょ',
    romaji: 'jo',
    ptPronunciation: 'Como "djó" ou "jó" em "jornal"',
    group: 'yoon_j',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Ji (じ) + yo pequeno (ょ). Exemplo: josei (mulher).',
  },

  // Linha B (Bi + ya, yu, yo) • Dakuon
  {
    id: 'hira_bya',
    character: 'びゃ',
    romaji: 'bya',
    ptPronunciation: 'Como "biá" unindo os lábios',
    group: 'yoon_b',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Bi (び) + ya pequeno (ゃ). Exemplo: byakuren (lótus branco).',
  },
  {
    id: 'hira_byu',
    character: 'びゅ',
    romaji: 'byu',
    ptPronunciation: 'Como "biú" rápido',
    group: 'yoon_b',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Bi (び) + yu pequeno (ゅ). Exemplo: byuun (som de veloz).',
  },
  {
    id: 'hira_byo',
    character: 'びょ',
    romaji: 'byo',
    ptPronunciation: 'Como "bió" rápido e sonoro',
    group: 'yoon_b',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Bi (び) + yo pequeno (ょ). Exemplo: byouin (hospital).',
  },

  // Linha P (Pi + ya, yu, yo) • Handakuon
  {
    id: 'hira_pya',
    character: 'ぴゃ',
    romaji: 'pya',
    ptPronunciation: 'Como "piá" rápido e seco com explosão dos lábios',
    group: 'yoon_p',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Pi (ぴ) + ya pequeno (ゃ). Exemplo: roppyaku (seiscentos).',
  },
  {
    id: 'hira_pyu',
    character: 'ぴゅ',
    romaji: 'pyu',
    ptPronunciation: 'Como "piú" veloz e agudo',
    group: 'yoon_p',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Pi (ぴ) + yu pequeno (ゅ). Exemplo: pyun (som de flecha).',
  },
  {
    id: 'hira_pyo',
    character: 'ぴょ',
    romaji: 'pyo',
    ptPronunciation: 'Como "pió" leve e saltitante',
    group: 'yoon_p',
    alphabet: 'hiragana',
    category: 'yoon',
    mnemonicNote: 'Pi (ぴ) + yo pequeno (ょ). Exemplo: pyonpyon (pulo do coelho).',
  },
];

// -------------------------------------------------------------
// 2. KATAKANA YŌON (33 Combinações Contraídas)
// -------------------------------------------------------------
export const YOON_KATAKANA_CHARACTERS: KanaCharacter[] = [
  // Linha K
  { id: 'kata_kya', character: 'キャ', romaji: 'kya', ptPronunciation: 'Como "quiá" rápido', group: 'yoon_k', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: kyabetsu (repolho).' },
  { id: 'kata_kyu', character: 'キュ', romaji: 'kyu', ptPronunciation: 'Como "quiú" rápido', group: 'yoon_k', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: kyutto (apertado).' },
  { id: 'kata_kyo', character: 'キョ', romaji: 'kyo', ptPronunciation: 'Como "quió" rápido', group: 'yoon_k', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: kyofu (medo).' },

  // Linha S
  { id: 'kata_sha', character: 'シャ', romaji: 'sha', ptPronunciation: 'Como "chá"', group: 'yoon_s', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: shatsu (camisa).' },
  { id: 'kata_shu', character: 'シュ', romaji: 'shu', ptPronunciation: 'Como "chu" em chute', group: 'yoon_s', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: shuukuriimu (profiterole).' },
  { id: 'kata_sho', character: 'ショ', romaji: 'sho', ptPronunciation: 'Como "chó" em chocolate', group: 'yoon_s', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: shoppu (loja / shop).' },

  // Linha T
  { id: 'kata_cha', character: 'チャ', romaji: 'cha', ptPronunciation: 'Como "tchá" em tchau', group: 'yoon_t', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: chanto (correto/direito).' },
  { id: 'kata_chu', character: 'チュ', romaji: 'chu', ptPronunciation: 'Como "tchu"', group: 'yoon_t', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: chuupu (tubo/tube).' },
  { id: 'kata_cho', character: 'チョ', romaji: 'cho', ptPronunciation: 'Como "tchó"', group: 'yoon_t', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: choko (chocolate).' },

  // Linha N
  { id: 'kata_nya', character: 'ニャ', romaji: 'nya', ptPronunciation: 'Como "nhá"', group: 'yoon_n', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: nyaa (miau).' },
  { id: 'kata_nyu', character: 'ニュ', romaji: 'nyu', ptPronunciation: 'Como "nhu"', group: 'yoon_n', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: nyuusu (notícias / news).' },
  { id: 'kata_nyo', character: 'ニョ', romaji: 'nyo', ptPronunciation: 'Como "nhó"', group: 'yoon_n', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: nyokinyoki (crescer rápido).' },

  // Linha H
  { id: 'kata_hya', character: 'ヒャ', romaji: 'hya', ptPronunciation: 'Como "riá" aspirado', group: 'yoon_h', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: hyatto (susto).' },
  { id: 'kata_hyu', character: 'ヒュ', romaji: 'hyu', ptPronunciation: 'Como "riú" aspirado', group: 'yoon_h', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: hyuuzu (fusível / fuse).' },
  { id: 'kata_hyo', character: 'ヒョ', romaji: 'hyo', ptPronunciation: 'Como "rió" aspirado', group: 'yoon_h', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: hyou (tabela/leopardo).' },

  // Linha M
  { id: 'kata_mya', character: 'ミャ', romaji: 'mya', ptPronunciation: 'Como "miá"', group: 'yoon_m', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: myanmaa (Mianmar).' },
  { id: 'kata_myu', character: 'ミュ', romaji: 'myu', ptPronunciation: 'Como "miú"', group: 'yoon_m', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: myuujikaru (musical).' },
  { id: 'kata_myo', character: 'ミョ', romaji: 'myo', ptPronunciation: 'Como "mió"', group: 'yoon_m', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: myooga (gengibre japonês).' },

  // Linha R
  { id: 'kata_rya', character: 'リャ', romaji: 'rya', ptPronunciation: 'Como "riá" vibrado', group: 'yoon_r', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: ryukku (mochila/rucksack).' },
  { id: 'kata_ryu', character: 'リュ', romaji: 'ryu', ptPronunciation: 'Como "riú" vibrado', group: 'yoon_r', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: ryuuto (alaúde).' },
  { id: 'kata_ryo', character: 'リョ', romaji: 'ryo', ptPronunciation: 'Como "rió" vibrado', group: 'yoon_r', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: ryokan (pousada tradicional).' },

  // Linha G • Dakuon
  { id: 'kata_gya', character: 'ギャ', romaji: 'gya', ptPronunciation: 'Como "guiá" rápido', group: 'yoon_g', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: gyararii (galeria).' },
  { id: 'kata_gyu', character: 'ギュ', romaji: 'gyu', ptPronunciation: 'Como "guiú" rápido', group: 'yoon_g', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: gyutto (aperto firme).' },
  { id: 'kata_gyo', character: 'ギョ', romaji: 'gyo', ptPronunciation: 'Como "guió" rápido', group: 'yoon_g', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: gyora (gôndola).' },

  // Linha J • Dakuon
  { id: 'kata_ja', character: 'ジャ', romaji: 'ja', ptPronunciation: 'Como "djá" ou "já" suave', group: 'yoon_j', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: jamu (geleia / jam).' },
  { id: 'kata_ju', character: 'ジュ', romaji: 'ju', ptPronunciation: 'Como "dju" ou "ju"', group: 'yoon_j', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: juusu (suco / juice).' },
  { id: 'kata_jo', character: 'ジョ', romaji: 'jo', ptPronunciation: 'Como "djó" ou "jó"', group: 'yoon_j', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: jogingu (cooper / jogging).' },

  // Linha B • Dakuon
  { id: 'kata_bya', character: 'ビャ', romaji: 'bya', ptPronunciation: 'Como "biá"', group: 'yoon_b', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: byaku (branco puro).' },
  { id: 'kata_byu', character: 'ビュ', romaji: 'byu', ptPronunciation: 'Como "biú"', group: 'yoon_b', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: byuffe (bufê / buffet).' },
  { id: 'kata_byo', character: 'ビョ', romaji: 'byo', ptPronunciation: 'Como "bió"', group: 'yoon_b', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: byou (segundo de tempo).' },

  // Linha P • Handakuon
  { id: 'kata_pya', character: 'ピャ', romaji: 'pya', ptPronunciation: 'Como "piá" rápido', group: 'yoon_p', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: pyatto (em um instante).' },
  { id: 'kata_pyu', character: 'ピュ', romaji: 'pyu', ptPronunciation: 'Como "piú" rápido', group: 'yoon_p', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: pyua (puro / pure).' },
  { id: 'kata_pyo', character: 'ピョ', romaji: 'pyo', ptPronunciation: 'Como "pió" saltitante', group: 'yoon_p', alphabet: 'katakana', category: 'yoon', mnemonicNote: 'Exemplo: pyoko (pulo curto).' },
];

// -------------------------------------------------------------
// 3. SONS ESPECIAIS DO KATAKANA MODERNO (Apostila 1, págs. 39-40)
// -------------------------------------------------------------
export const SPECIAL_KATAKANA_CHARACTERS: KanaCharacter[] = [
  // Família V (ヴ + a, i, u, e, o)
  { id: 'kata_va', character: 'ヴァ', romaji: 'va', ptPronunciation: 'Som de "va" (u com tenten + a pequeno)', group: 'special_v', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: vanpaya (vampiro).' },
  { id: 'kata_vi', character: 'ヴィ', romaji: 'vi', ptPronunciation: 'Som de "vi" (u com tenten + i pequeno)', group: 'special_v', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: bideo / video (vídeo).' },
  { id: 'kata_vu', character: 'ヴ', romaji: 'vu', ptPronunciation: 'Som de "vu" (u com tenten)', group: 'special_v', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: vuduu (vudu).' },
  { id: 'kata_ve', character: 'ヴェ', romaji: 've', ptPronunciation: 'Som de "ve" (u com tenten + e pequeno)', group: 'special_v', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: venisu (Veneza).' },
  { id: 'kata_vo', character: 'ヴォ', romaji: 'vo', ptPronunciation: 'Som de "vo" (u com tenten + o pequeno)', group: 'special_v', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: voruteeji (voltagem).' },

  // Família F (フ + a, i, e, o)
  { id: 'kata_fa', character: 'ファ', romaji: 'fa', ptPronunciation: 'Som de "fa" como em faca (fu + a pequeno)', group: 'special_f', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: faa (pele/fur) ou faito (luta/fight).' },
  { id: 'kata_fi', character: 'フィ', romaji: 'fi', ptPronunciation: 'Som de "fi" como em fita (fu + i pequeno)', group: 'special_f', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: firumu (filme).' },
  { id: 'kata_fe', character: 'フェ', romaji: 'fe', ptPronunciation: 'Som de "fe" como em festa (fu + e pequeno)', group: 'special_f', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: fesutibaru (festival).' },
  { id: 'kata_fo', character: 'フォ', romaji: 'fo', ptPronunciation: 'Som de "fo" como em foto (fu + o pequeno)', group: 'special_f', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: fooku (garfo / fork).' },

  // Família W (ウ + i, e, o)
  { id: 'kata_wi', character: 'ウィ', romaji: 'wi', ptPronunciation: 'Som de "ui" rápido (u + i pequeno)', group: 'special_w', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: wii (Nintendo Wii) e wisukii (uísque).' },
  { id: 'kata_we', character: 'ウェ', romaji: 'we', ptPronunciation: 'Som de "ue" rápido (u + e pequeno)', group: 'special_w', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: webbu (web) e weetoresu (garçonete).' },
  { id: 'kata_wo_sound', character: 'ウォ', romaji: 'wo', ptPronunciation: 'Som real de "uó" articulado com W (u + o pequeno)', group: 'special_w', alphabet: 'katakana', category: 'special', mnemonicNote: 'Diferente de ヲ (que tem som de o). Ex: wootaa (água/water).' },

  // Outros Sons Ocidentais (ti, di, tu, du, she, je, che)
  { id: 'kata_she', character: 'シェ', romaji: 'she', ptPronunciation: 'Som suave de "chê" em inglês (shi + e pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: shefu (chefe de cozinha / chef).' },
  { id: 'kata_je', character: 'ジェ', romaji: 'je', ptPronunciation: 'Som de "djê" (ji + e pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: jento (gentil / gentleman).' },
  { id: 'kata_che', character: 'チェ', romaji: 'che', ptPronunciation: 'Som de "tchê" (chi + e pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: chekku (cheque / checar).' },
  { id: 'kata_ti', character: 'ティ', romaji: 'ti', ptPronunciation: 'Som de "ti" seco como em "típico" (te + i pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: paatii (festa / party).' },
  { id: 'kata_di', character: 'ディ', romaji: 'di', ptPronunciation: 'Som de "di" seco (de + i pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: disuko (discoteca).' },
  { id: 'kata_tu_sound', character: 'トゥ', romaji: 'tu', ptPronunciation: 'Som de "tu" ocidental verdadeiro (to + u pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Evita a pronúncia japonesa "tsu".' },
  { id: 'kata_du_sound', character: 'ドゥ', romaji: 'du', ptPronunciation: 'Som de "du" ocidental (do + u pequeno)', group: 'special_other', alphabet: 'katakana', category: 'special', mnemonicNote: 'Exemplo: duetto (dueto).' },
];

// -------------------------------------------------------------
// 4. EXEMPLOS DIDÁTICOS DE SOKUON (促音 - Pausa Fonética com っ / ッ)
// -------------------------------------------------------------
export const SOKUON_EXAMPLES: PhoneticFeatureExample[] = [
  {
    word: 'がっこう',
    romaji: 'gakkou',
    translation: 'Escola',
    explanation: 'O "tsu pequeno" (っ) corta o ar antes do "ko", gerando a pausa e dobrando a consoante na escrita ocidental (k).',
    alphabet: 'hiragana',
  },
  {
    word: 'ざっし',
    romaji: 'zasshi',
    translation: 'Revista',
    explanation: 'Corte de ar entre "za" e "shi", gerando o som enfático "zas-shi".',
    alphabet: 'hiragana',
  },
  {
    word: 'びっくり',
    romaji: 'bikkuri',
    translation: 'Surpreso / Assustado',
    explanation: 'Pausa rápida na garganta antes do "ku". Exclamação clássica em animes e conversas!',
    alphabet: 'hiragana',
  },
  {
    word: 'せっけん',
    romaji: 'sekken',
    translation: 'Sabão / Sabonete',
    explanation: 'Corte de ar audível entre "se" e "ken".',
    alphabet: 'hiragana',
  },
  {
    word: 'しっぽ',
    romaji: 'shippo',
    translation: 'Cauda / Rabo (de animal)',
    explanation: 'Pausa nítida com os lábios fechados antes de soltar a sílaba "po".',
    alphabet: 'hiragana',
  },
  {
    word: 'ベッド',
    romaji: 'beddo',
    translation: 'Cama (do inglês "bed")',
    explanation: 'No Katakana, o ッ pequeno é usado para representar consoantes finais secas do inglês.',
    alphabet: 'katakana',
  },
  {
    word: 'チケット',
    romaji: 'chiketto',
    translation: 'Ingresso / Bilhete (do inglês "ticket")',
    explanation: 'Pausa glotal rápida antes da terminação "to".',
    alphabet: 'katakana',
  },
  {
    word: 'コップ',
    romaji: 'koppu',
    translation: 'Copo (do holandês "kop")',
    explanation: 'Fechamento abrupto dos lábios antes do "pu".',
    alphabet: 'katakana',
  },
];

// -------------------------------------------------------------
// 5. EXEMPLOS DO SINAL DE PROLONGAMENTO NO KATAKANA (ー Chōonpu)
// -------------------------------------------------------------
export const CHOONPU_EXAMPLES: PhoneticFeatureExample[] = [
  {
    word: 'コーヒー',
    romaji: 'koohii',
    translation: 'Café (coffee)',
    explanation: 'O traço ー dobra a duração da vogal anterior: "ko-o-hi-i".',
    alphabet: 'katakana',
  },
  {
    word: 'アパート',
    romaji: 'apaato',
    translation: 'Apartamento',
    explanation: 'A vogal "a" é prolongada no meio da palavra: "a-pa-a-to".',
    alphabet: 'katakana',
  },
  {
    word: 'ハンバーグ',
    romaji: 'hanbaagu',
    translation: 'Hambúrguer (o prato com bife)',
    explanation: 'Prolonga a sílaba "baa" para aproximar da sonoridade original do inglês.',
    alphabet: 'katakana',
  },
  {
    word: 'スカート',
    romaji: 'sukaato',
    translation: 'Saia (skirt)',
    explanation: 'O "kaa" é pronunciado com o dobro de tempo.',
    alphabet: 'katakana',
  },
  {
    word: 'スピード',
    romaji: 'supiido',
    translation: 'Velocidade (speed)',
    explanation: 'O "pii" ganha ênfase prolongada.',
    alphabet: 'katakana',
  },
  {
    word: 'ホームページ',
    romaji: 'hoomupeeji',
    translation: 'Página inicial / Site (homepage)',
    explanation: 'Possui dois prolongamentos: "hoo" e "pee".',
    alphabet: 'katakana',
  },
];

// -------------------------------------------------------------
// 6. ESTRUTURA PARA RENDERIZAÇÃO DA GRADE YŌON NA TABELA
// -------------------------------------------------------------
export interface YoonGridRow {
  label: string;
  sublabel: string;
  baseConsonant: string;
  slots: [string, string, string]; // [ya, yu, yo]
}

export const YOON_ROWS: YoonGridRow[] = [
  { label: 'K', sublabel: 'Ki (き/キ)', baseConsonant: 'k', slots: ['kya', 'kyu', 'kyo'] },
  { label: 'S', sublabel: 'Shi (し/シ)', baseConsonant: 's', slots: ['sha', 'shu', 'sho'] },
  { label: 'T', sublabel: 'Chi (ち/チ)', baseConsonant: 't', slots: ['cha', 'chu', 'cho'] },
  { label: 'N', sublabel: 'Ni (に/ニ)', baseConsonant: 'n', slots: ['nya', 'nyu', 'nyo'] },
  { label: 'H', sublabel: 'Hi (ひ/ヒ)', baseConsonant: 'h', slots: ['hya', 'hyu', 'hyo'] },
  { label: 'M', sublabel: 'Mi (み/ミ)', baseConsonant: 'm', slots: ['mya', 'myu', 'myo'] },
  { label: 'R', sublabel: 'Ri (り/リ)', baseConsonant: 'r', slots: ['rya', 'ryu', 'ryo'] },
  { label: 'G', sublabel: 'Gi (ぎ/ギ)', baseConsonant: 'g', slots: ['gya', 'gyu', 'gyo'] },
  { label: 'J', sublabel: 'Ji (じ/ジ)', baseConsonant: 'j', slots: ['ja', 'ju', 'jo'] },
  { label: 'B', sublabel: 'Bi (び/ビ)', baseConsonant: 'b', slots: ['bya', 'byu', 'byo'] },
  { label: 'P', sublabel: 'Pi (ぴ/ピ)', baseConsonant: 'p', slots: ['pya', 'pyu', 'pyo'] },
];
