import { response } from 'express';
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AuthContext } from './AuthContext';

const QuizListContainer = styled.div`
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

const QuizListComponent: React.FC = () => {
  const navigate = useNavigate();
  const [responseMessage, setResponseMessage] = useState('');
  const [quizzes, setQuizzes] = useState<Quiz[]>();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    fetchQuizList();
  }, []);

  const fetchQuizList = () => {
    fetch('http://localhost:8080/quiz/getall', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(
        (response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.length > 0) {
          // Ustawienie pobranej listy quizów w stanie komponentu
          setQuizzes(data);
        } else {
          setResponseMessage("An error occurred while fetching quiz list.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz list.');
      });
  };

  const handleQuizClick = (quizId: number, index: number) => {
    fetch(`http://localhost:8080/quiz/get?id=${quizId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success === "true") {
          navigate(`/quiz/${quizId}`, { state: data.quiz });
        } else {
            setResponseMessage(data.message);
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred during registration.');
      });
  };

  const handleLogout = () => {
    authContext.logout();
    navigate(`/login`);
  };

  const handleCreateNew = () => {
    navigate(`/quiz/new`);
  };

  return (
    <div>
      {authContext.user ? (
        <QuizListContainer>
          <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
          <button onClick={() => handleLogout()}> LOGOUT </button>
          <button onClick={() => handleCreateNew()}> Create new quiz </button>
          <ul>
            {quizzes?.map((quiz, index) => (
              <li key={quiz.id} onClick={() => handleQuizClick(quiz.id, index)}>
                <div>Name: {quiz.name}</div>
                <div>Category: {quiz.category}</div>
                <div>Description: {quiz.description}</div>
                <div>Difficulty: {quiz.difficulty}</div>
                <div>Owner: {quiz.ownerName}</div>
                { authContext.user?.login === quiz.ownerName && <button>EDIT</button>}

              </li>
            ))}
          </ul>
        </QuizListContainer>
      ) : (
        <p>User not logged in</p>
      )}

    {responseMessage && <p>{responseMessage}</p>}
    </div>
  );
};

export default QuizListComponent;
