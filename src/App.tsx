import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './components/User/AuthContext';
import './App.css';

import LoginComponent from './components/User/LoginComponent';
import ActivateAccountComponent from './components/User/ActivateAccountComponent';
import RegisterComponent from './components/User/RegisterComponent';
import ManageAccountComponent from './components/User/ManageAccount';

import QuizListComponent from './components/Quiz/QuizListComponent';
import QuizEdit from './components/Quiz/QuizEditComponent';
import QuizComponent from './components/Quiz/QuizComponent';
import NewQuizForm from './components/Quiz/NewQuizFormComponent';
import QuestionEdit from './components/Quiz/QuestionEditComponent';
import NewQuestionForm from './components/Quiz/NewQuestionFormComponent';

import HighScores from './components/Highscores/HighscoresComponent';
import UserRanking from './components/Highscores/UserRankingComponent';

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/activate" element={<ActivateAccountComponent />} />
        <Route path="/manage" element={<ManageAccountComponent />} />
        <Route path="/ranking" element={<UserRanking />} />

        <Route path="/quiz/all" element={<QuizListComponent />} />
        <Route path="/quiz/solve/:quizId" element={<QuizComponent />} />
        <Route path="/quiz/highscores" element={<HighScores />} />
        <Route path="/quiz/new" element={<NewQuizForm />} />
        <Route path="/quiz/edit/:quizId" element={<QuizEdit />} />
        <Route path="/question/new" element={<NewQuestionForm />} />
        <Route path="/question/edit/:questionId" element={<QuestionEdit />} />      

      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
