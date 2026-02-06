
export enum WordType {
  NOUN = 'Noun',
  VERB = 'Verb',
  ADJECTIVE = 'Adjective',
  ADVERB = 'Adverb',
  PHRASE = 'Phrase',
  OTHER = 'Other'
}

export interface GermanWord {
  id: string;
  german: string;
  english: string;
  type: WordType;
  gender?: 'der' | 'die' | 'das';
  exampleSentence: string;
  exampleTranslation: string;
  masteryLevel: number; // 0 to 5
  createdAt: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  correctAnswer: string;
  options: string[];
  wordId: string;
}

export type AppView = 'dashboard' | 'flashcards' | 'quiz' | 'add';
