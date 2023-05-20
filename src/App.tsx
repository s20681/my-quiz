import './App.css';
import React from 'react';
import LoginComponent from './components/LoginComponent';
import NewQuestionForm from './components/NewQuestionFormComponent';
import RegisterComponent from './components/RegisterComponent';
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route index element={<LoginComponent />} />
        <Route path="/login" element={<LoginComponent/>}/>
        <Route path="/register" element={<RegisterComponent/>}/>
          {/* <Route path="blogs" element={<Blogs />} /> */}
          <Route path="/admin" element={<NewQuestionForm/>} />
          {/* <Route path="*" element={<NoPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
