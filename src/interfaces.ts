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
  person: UserData;
  quiz: Quiz;
  points: number;
  date: string;
}

export interface Ranking {
  userName: string;
  totalPoints: number;
  totalQuizzes: number;
  totalEasyQuizzes: number;
  totalMediumQuizzes: number;
  totalHardQuizzes: number;  
}  
  
export interface AuthContextType {
    user: UserData | null;
    login: (userData: UserData) => void;
    logout: () => void;
  }

export interface AuthProviderProps {
    children: React.ReactNode; // Define the children prop
  }