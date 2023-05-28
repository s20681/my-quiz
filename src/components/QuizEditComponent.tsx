import { response } from 'express';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from './AuthContext';

const QuestionListContainer = styled.div`
  ul {
    list-style: none;
    padding: 0;
  }

  li {
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #f5f5f5;
    }
  }
`;

interface Quiz {
  id: number;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  ownerName: string;
  questions: any[];
}

interface Answer {
  id: number;
  content: string;
  correct: boolean;
}

interface Question {
  id: number;
  content: string;
  correctAnswerIndex: number;
  questionType: string;
  answers: Answer[];
}

const QuizEdit: React.FC = () => {
  const location = useLocation();
  const [selectedQuiz, setEditedQuiz] = useState<Quiz>();
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState('');
  const [questions, setQuestions] = useState<Question[]>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log("id value right before fetching:" + location.state.id)
    fetch(`http://localhost:8080/quiz/get?id=${location.state.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        console.log("data received: " + JSON.stringify(data));
        if (data) {
          // Ustawienie pobranej listy quizów w stanie komponentu
          setEditedQuiz(data as Quiz);
        } else {
          setResponseMessage("quiz data empty?");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz to edit.');
      });
  }, []);

  const handleEditQuestion = (quizId: number, index: number) => {
    //TODO: navigate to a view identical as new question one, but with slightly changed logic.
    //it should update existing question object, if not possible then just remove and create a new one in its place.
  };

  const handleCreateNewQuestion = () => {
    //navigate to new question view
    navigate(`/question/new`, { state: selectedQuiz });
  };

  const handleDeleteQuestion = () => {
    //TODO: send deletion request to backend, after response pull question list again from backend
  };

  const handleDeleteQuiz = () => {
    //TODO: send deletion request to backend, after response navigate to quiz list.
  };

  const handleGoHome = () => {
    navigate(`/quiz/all`);
  };

  const handleLogout = () => {
    authContext.logout();
    navigate(`/login`);
  };

  return (
    <div>
      {authContext.user ? (
        <QuestionListContainer>
          <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
          <p>Currently editing quiz: {selectedQuiz?.id} {selectedQuiz?.name}</p>
          <button onClick={() => handleGoHome()}> Go back to quiz list </button>
          <button onClick={() => handleCreateNewQuestion()}> Add new question </button>
          <button onClick={() => handleDeleteQuiz()}> Delete the quiz </button>
          <button onClick={() => handleLogout()}> LOGOUT </button>
          <ul>
            {selectedQuiz?.questions?.map((question, index) => (
              <li key={question.id} onClick={() => handleEditQuestion(question.id, index)}>
                <div>Question: {question.content}</div>
                <div>Type: {question.questionType}</div>
                <div>
                  <button>REMOVE</button>
                </div>

              </li>
            ))}
          </ul>
        </QuestionListContainer>
      ) : (
        <p>User not logged in</p>
      )}

    {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default QuizEdit;
