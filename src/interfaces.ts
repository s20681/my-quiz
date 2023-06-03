export interface Answer {
    id: number;
    content: string;
    isCorrect: boolean;
  }  
  
export interface Question {
    id: number;
    content: string;
    correctAnswerIndex: number;
    questionType: string;
    answers: Answer[];
  }

export interface Quiz {
    id: number;
    name: string;
    description: string;
    category: string;
    difficulty: string;
    ownerName: string;
    questions: Question[];
  }

export interface UserData {
    login: string;
    id: string;
  }

export interface Highscore {
  id: string;
  person: {};
  quiz: Quiz;
  points: number;
  localDateTime: string;
}
  
export interface AuthContextType {
    user: UserData | null;
    login: (userData: UserData) => void;
    logout: () => void;
  }

export interface AuthProviderProps {
    children: React.ReactNode; // Define the children prop
  }