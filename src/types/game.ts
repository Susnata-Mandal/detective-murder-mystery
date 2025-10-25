export interface Suspect {
  id: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  questionsRemaining: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface CaseData {
  title: string;
  description: string;
  suspects: Suspect[];
  correctSuspect: string;
  theme?: 'hollywood' | 'mumbai';
}

export interface GameState {
  detectiveName: string;
  currentCase: CaseData | null;
  conversations: Record<string, Message[]>;
  gameOver: boolean;
  won: boolean;
}