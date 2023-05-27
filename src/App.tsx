import './App.css';
import React from 'react';
import { AuthProvider } from './components/AuthContext';
import LoginComponent from './components/LoginComponent';
import NewQuestionForm from './components/NewQuestionFormComponent';
import NewQuizForm from './components/NewQuizFormComponent';
import RegisterComponent from './components/RegisterComponent';
import QuizListComponent from './components/QuizListComponent';
import QuizComponent from './components/QuizComponent';
import QuizHighScores from './components/QuizHighscoresComponent';
import ActivateAccountComponent from './components/ActivateAccountComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent />} />
        <Route path="/register" element={<RegisterComponent />} />
        <Route path="/activate" element={<ActivateAccountComponent />} />
        {/* <Route path="blogs" element={<Blogs />} /> */}
        <Route path="/question/new" element={<NewQuestionForm />} />
        <Route path="/quiz/new" element={<NewQuizForm />} />
        <Route path="/quiz/all" element={<QuizListComponent />} />
        <Route path="/quiz/highscores" element={<QuizHighScores />} />
        <Route path="/quiz/:quizId" element={<QuizComponent />} />

        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
