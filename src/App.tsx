import './App.css';
import React from 'react';
import { AuthProvider } from './components/AuthContext';
import LoginComponent from './components/LoginComponent';
import NewQuestionForm from './components/NewQuestionFormComponent';
import EditQuestionForm from './components/EditQuestionFormComponent';
import NewQuizForm from './components/NewQuizFormComponent';
import RegisterComponent from './components/RegisterComponent';
import QuizListComponent from './components/QuizListComponent';
import QuizEdit from './components/QuizEditComponent';
import QuizComponent from './components/QuizComponent';
import HighScores from './components/HighscoresComponent';
import ActivateAccountComponent from './components/ActivateAccountComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserRanking from './components/UserRankingComponent';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/activate" element={<ActivateAccountComponent />} />
        <Route path="/ranking" element={<UserRanking />} />
        <Route path="/quiz/all" element={<QuizListComponent />} />
        <Route path="/quiz/solve/:quizId" element={<QuizComponent />} />
        <Route path="/quiz/highscores" element={<HighScores />} />


        <Route path="/quiz/new" element={<NewQuizForm />} />
        <Route path="/quiz/edit/:quizId" element={<QuizEdit />} />
        <Route path="/question/new" element={<NewQuestionForm />} />
        <Route path="/question/edit/:questionId" element={<EditQuestionForm />} />

        
        

        {/* <Route path="*" element={<NoPage />} /> */}
        {/* <Route path="blogs" element={<Blogs />} /> */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
