export interface DialogueCharacter {
  id: string;
  name: string;
  japaneseName: string;
  avatar: string;
  color: string;
  gender: 'female' | 'male';
}

export interface DialogueLine {
  id: string;
  characterId: string;
  japanese: string;
  romaji: string;
  translation: string;
  notes?: string;
}

export interface DialogueQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DialogueItem {
  id: string;
  title: string;
  japaneseTitle: string;
  description: string;
  level: string;
  characters: DialogueCharacter[];
  lines: DialogueLine[];
  comprehensionQuiz: DialogueQuestion[];
}
