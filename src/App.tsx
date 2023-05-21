import './App.css';
import React from 'react';
import LoginComponent from './components/LoginComponent';
import NewQuestionForm from './components/NewQuestionFormComponent';
import NewQuizForm from './components/NewQuizFormComponent';
import RegisterComponent from './components/RegisterComponent';
import QuizListComponent from './components/QuizListComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent/>}/>
        <Route path="/register" element={<RegisterComponent/>}/>
          {/* <Route path="blogs" element={<Blogs />} /> */}
          <Route path="/question/new" element={<NewQuestionForm/>} />
          <Route path="/quiz/new" element={<NewQuizForm/>} />
          <Route path="/quiz/all" element={<QuizListComponent/>} />
          {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
