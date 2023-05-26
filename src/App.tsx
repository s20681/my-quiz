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

const quizzes = [
  {
    "id": 1, "name": "quiz1", "description": "blabla animals", "category": "xdd", "difficulty": "MEDIUM", "ownerName": "defaultusername", "questions": [
      {
        "id": 1, "content": "animals question", "correctAnswerIndex": 2, "questionType": "SINGLE_CHOICE", "answers": [
          { "id": 3, "content": "akndsand", "correct": false }, { "id": 4, "content": "iadasodusad", "correct": false }, { "id": 5, "content": "d09usa09dsa09d", "correct": true }, { "id": 6, "content": "d09sada", "correct": false }]
      },
      {
        "id": 2, "content": "blabla bla second question", "correctAnswerIndex": 1, "questionType": "SINGLE_CHOICE", "answers": [
          { "id": 3, "content": "answer 2 1", "correct": false }, { "id": 4, "content": "answer 2 2", "correct": false }, { "id": 5, "content": "answer 2 3", "correct": true }, { "id": 6, "content": "answer 2 4", "correct": true }]
      },

    ]
  },
  { "id": 2, "name": "quiz2", "description": "blabla history", "category": "history", "difficulty": "HIGH", "ownerName": "defaultusername", "questions": [] }
]


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
        <Route path="/quiz/all" element={<QuizListComponent quizzes={quizzes} />} />
        <Route path="/quiz/highscores" element={<QuizHighScores />} />
        <Route path="/quiz/:quizId" element={<QuizComponent />} />

        {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
