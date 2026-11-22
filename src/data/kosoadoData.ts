export interface KosoadoItem {
  id: 'ko' | 'so' | 'a' | 'do';
  prefix: string;
  romajiPrefix: string;
  spatialMeaning: string;
  mnemonic: string;
  color: string;
  objectWord: { japanese: string; romaji: string; translation: string };
  modifierWord: { japanese: string; romaji: string; translation: string };
  placeWord: { japanese: string; romaji: string; translation: string };
  directionWord: { japanese: string; romaji: string; translation: string };
  exampleSentence: {
    japanese: string;
    romaji: string;
    translation: string;
    explanation: string;
  };
}

export const KOSOADO_ITEMS: KosoadoItem[] = [
  {
    id: 'ko',
    prefix: 'こ',
    romajiPrefix: 'KO',
    spatialMeaning: 'Perto de mim (o falante)',
    mnemonic: 'KO = "Comigo" / "Colado a mim"',
    color: 'emerald',
    objectWord: { japanese: 'これ', romaji: 'kore', translation: 'Isto (objeto perto de mim)' },
    modifierWord: { japanese: 'この', romaji: 'kono', translation: 'Este / Esta (este livro...)' },
    placeWord: { japanese: 'ここ', romaji: 'koko', translation: 'Aqui (este lugar)' },
    directionWord: { japanese: 'こちら', romaji: 'kochira', translation: 'Por aqui / Esta pessoa (cortês)' },
    exampleSentence: {
      japanese: 'これはペンです。',
      romaji: 'kore wa pen desu.',
      translation: 'Isto é uma caneta.',
      explanation: 'O objeto está nas mãos do falante ou no espaço pessoal dele.',
    },
  },
  {
    id: 'so',
    prefix: 'そ',
    romajiPrefix: 'SO',
    spatialMeaning: 'Perto da pessoa com quem falo (ouvinte)',
    mnemonic: 'SO = "Sobre você" / "Seu"',
    color: 'sky',
    objectWord: { japanese: 'それ', romaji: 'sore', translation: 'Isso (objeto perto de você)' },
    modifierWord: { japanese: 'その', romaji: 'sono', translation: 'Esse / Essa (essa camisa...)' },
    placeWord: { japanese: 'そこ', romaji: 'soko', translation: 'Aí (onde você está)' },
    directionWord: { japanese: 'そちら', romaji: 'sochira', translation: 'Por aí / O senhor/você (cortês)' },
    exampleSentence: {
      japanese: 'それはいぬです。',
      romaji: 'sore wa inu desu.',
      translation: 'Isso é um cachorro.',
      explanation: 'O objeto ou animal está próximo do ouvinte, e não de quem fala.',
    },
  },
  {
    id: 'a',
    prefix: 'あ',
    romajiPrefix: 'A',
    spatialMeaning: 'Longe de mim e longe de você (ambos distantes)',
    mnemonic: 'A = "Acolá" / "Além no horizonte"',
    color: 'purple',
    objectWord: { japanese: 'あれ', romaji: 'are', translation: 'Aquilo (longe de nós dois)' },
    modifierWord: { japanese: 'あの', romaji: 'ano', translation: 'Aquele / Aquela (aquele prédio...)' },
    placeWord: { japanese: 'あそこ', romaji: 'asoko', translation: 'Lá / Aquele lugar adiante' },
    directionWord: { japanese: 'あちら', romaji: 'achira', translation: 'Por lá / Acolá (cortês)' },
    exampleSentence: {
      japanese: 'あれはやまです。',
      romaji: 'are wa yama desu.',
      translation: 'Aquilo é uma montanha.',
      explanation: 'O elemento está visível no horizonte, distante de ambos os interlocutores.',
    },
  },
  {
    id: 'do',
    prefix: 'ど',
    romajiPrefix: 'DO',
    spatialMeaning: 'Pergunta / Dúvida / Escolha entre opções',
    mnemonic: 'DO = "Dúvida" / "Qual?"',
    color: 'amber',
    objectWord: { japanese: 'どれ', romaji: 'dore', translation: 'Qual? (dentre vários objetos)' },
    modifierWord: { japanese: 'どの', romaji: 'dono', translation: 'Qual...? (qual livro?)' },
    placeWord: { japanese: 'どこ', romaji: 'doko', translation: 'Onde? / Em que lugar?' },
    directionWord: { japanese: 'どちら', romaji: 'dochira', translation: 'Para onde? / Qual dos dois? (cortês)' },
    exampleSentence: {
      japanese: 'どれですか？',
      romaji: 'dore desu ka?',
      translation: 'Qual deles é?',
      explanation: 'Usado para solicitar que a outra pessoa aponte ou escolha entre opções.',
    },
  },
];

export interface KosoadoQuizQuestion {
  id: string;
  scenario: string;
  situationRole: 'speaker' | 'listener' | 'distant' | 'question';
  question: string;
  correctAnswer: string;
  romajiAnswer: string;
  options: { label: string; romaji: string; explanation: string }[];
}

export const KOSOADO_QUIZ_QUESTIONS: KosoadoQuizQuestion[] = [
  {
    id: 'kq_1',
    scenario: 'Você está segurando um livro novo nas mãos e quer mostrá-lo ao seu amigo.',
    situationRole: 'speaker',
    question: 'Como dizer: "Isto é um livro"?',
    correctAnswer: 'これは本です。',
    romajiAnswer: 'kore wa hon desu.',
    options: [
      { label: 'これは本です。', romaji: 'kore wa hon desu.', explanation: 'Correto! KO (これ) é usado quando o objeto está perto do falante.' },
      { label: 'それは本です。', romaji: 'sore wa hon desu.', explanation: 'Incorreto. "Sore" indicaria que o livro está perto do amigo, não de você.' },
      { label: 'あれは本です。', romaji: 'are wa hon desu.', explanation: 'Incorreto. "Are" indicaria que o livro está distante de ambos.' },
      { label: 'どれは本です。', romaji: 'dore wa hon desu.', explanation: 'Incorreto. "Dore" é interrogativo (qual objeto) e não afirmação.' },
    ],
  },
  {
    id: 'kq_2',
    scenario: 'Seu amigo está usando uma camiseta bonita e você quer falar sobre a camiseta dele.',
    situationRole: 'listener',
    question: 'Como dizer: "Isso é uma camiseta"?',
    correctAnswer: 'それはシャツです。',
    romajiAnswer: 'sore wa shatsu desu.',
    options: [
      { label: 'これはシャツです。', romaji: 'kore wa shatsu desu.', explanation: 'Incorreto. "Kore" é para algo perto de quem está falando.' },
      { label: 'それはシャツです。', romaji: 'sore wa shatsu desu.', explanation: 'Perfeito! SO (それ) é usado para o que está com o interlocutor.' },
      { label: 'あれはシャツです。', romaji: 'are wa shatsu desu.', explanation: 'Incorreto. "Are" indicaria uma camisa distante de ambos.' },
      { label: 'どれはシャツです。', romaji: 'dore wa shatsu desu.', explanation: 'Incorreto. "Dore" é pronome interrogativo (qual).' },
    ],
  },
  {
    id: 'kq_3',
    scenario: 'Você e seu amigo estão na rua e avistam um castelo histórico lá no alto da colina.',
    situationRole: 'distant',
    question: 'Como dizer: "Aquilo é um castelo"?',
    correctAnswer: 'あれは城です。',
    romajiAnswer: 'are wa shiro desu.',
    options: [
      { label: 'これは城です。', romaji: 'kore wa shiro desu.', explanation: 'Incorreto. O castelo não está com você.' },
      { label: 'それは城です。', romaji: 'sore wa shiro desu.', explanation: 'Incorreto. O castelo também não está colado ao seu amigo.' },
      { label: 'あれは城です。', romaji: 'are wa shiro desu.', explanation: 'Exato! A (あれ) representa o que está distante de ambos os falantes.' },
      { label: 'どれは城です。', romaji: 'dore wa shiro desu.', explanation: 'Incorreto. "Dore" é interrogativo e não cabe nesta afirmação.' },
    ],
  },
  {
    id: 'kq_4',
    scenario: 'Há três sapatos diferentes no chão e você quer perguntar qual é o sapato do seu amigo.',
    situationRole: 'question',
    question: 'Como perguntar: "Falando sobre o seu sapato, qual é?"',
    correctAnswer: 'あなたの靴はどれですか？',
    romajiAnswer: 'anata no kutsu wa dore desu ka?',
    options: [
      { label: 'あなたの靴はどれですか？', romaji: 'anata no kutsu wa dore desu ka?', explanation: 'Excelente! DO (どれ) é o pronome interrogativo para escolher entre objetos.' },
      { label: 'あなたの靴はあれですか？', romaji: 'anata no kutsu wa are desu ka?', explanation: 'Incorreto. Isso perguntaria "Seu sapato é aquele lá longe?".' },
      { label: 'あなたの靴はこれですか？', romaji: 'anata no kutsu wa kore desu ka?', explanation: 'Incorreto. Isso perguntaria "Seu sapato é este aqui na minha mão?".' },
      { label: 'あなたの靴はそれですか？', romaji: 'anata no kutsu wa sore desu ka?', explanation: 'Incorreto. Isso perguntaria "Seu sapato é esse aí com você?".' },
    ],
  },
  {
    id: 'kq_5',
    scenario: 'Você quer indicar que o lugar onde você e a outra pessoa estão sentados agora é Tóquio.',
    situationRole: 'speaker',
    question: 'Como dizer: "Aqui é Tóquio"?',
    correctAnswer: 'ここは東京です。',
    romajiAnswer: 'koko wa toukyou desu.',
    options: [
      { label: 'ここは東京です。', romaji: 'koko wa toukyou desu.', explanation: 'Correto! KO + KO (ここ) significa "aqui" (o lugar do falante).' },
      { label: 'そこは東京です。', romaji: 'soko wa toukyou desu.', explanation: 'Incorreto. "Soko" é "aí" (onde a outra pessoa está).' },
      { label: 'あそこは東京です。', romaji: 'asoko wa toukyou desu.', explanation: 'Incorreto. "Asoko" é "lá adiante".' },
      { label: 'どこは東京です。', romaji: 'doko wa toukyou desu.', explanation: 'Incorreto. "Doko" é pronome interrogativo ("onde").' },
    ],
  },
  {
    id: 'kq_6',
    scenario: 'Você quer perguntar onde fica a estação de trem.',
    situationRole: 'question',
    question: 'Como perguntar: "Onde é a estação?" (Eki = estação)',
    correctAnswer: '駅はどこですか？',
    romajiAnswer: 'eki wa doko desu ka?',
    options: [
      { label: '駅はどこですか？', romaji: 'eki wa doko desu ka?', explanation: 'Perfeito! DO + KO (どこ) significa "onde" (lugar da dúvida).' },
      { label: '駅はどれですか？', romaji: 'eki wa dore desu ka?', explanation: 'Incorreto. "Dore" se refere a qual objeto, e não qual lugar.' },
      { label: '駅はここですか？', romaji: 'eki wa koko desu ka?', explanation: 'Incorreto. Isso perguntaria "A estação é aqui?".' },
      { label: '駅はあそこですか？', romaji: 'eki wa asoko desu ka?', explanation: 'Incorreto. Isso perguntaria "A estação é aquela lá longe?".' },
    ],
  },
];
