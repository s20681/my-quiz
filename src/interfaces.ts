export interface Answer {
    id: number;
    content: string;
    isCorrect: boolean;
  }  
  
export interface Question {
    id: number;
    quizId: number;
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
    [key: string]: string | number | Question[]; // to allow sorting it was needed to add index signature that allows accessing its properties using a string key.
  }

export interface UserData {
    login: string;
    id: string;
    email: string;
    isActivated: string;
    verificationCode: string;
  }

export interface Highscore {
  id: string;
  userName: string;
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

export interface NewQuizFormState {
  name: string,
  description: string, //Few words about the quiz
  category: string,   // Animals, History etc. if user inputs a non existent category name it will create one
  difficulty: string, // high, medium, low
}
  
export interface AuthContextType {
    user: UserData | null;
    login: (userData: UserData) => void;
    logout: () => void;
  }

export interface AuthProviderProps {
    children: React.ReactNode; // Define the children prop
  }