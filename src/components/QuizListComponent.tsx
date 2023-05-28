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
          setResponseMessage("Quiz list seems empty for now.");
        }
      })
      .catch((error) => {
        console.error('Error:', error);
        setResponseMessage('An error occurred while fetching quiz list.');
      });
  };

  const handleQuizClick = (quizId: number, index: number) => {
    if (quizzes !== undefined && quizzes[index].questions.length > 0) {
      navigate(`/quiz/solve/${quizId}`, { state: quizzes[index] });
    } else {
      setResponseMessage("Quiz does not exist or does not have any questions yet.");
    }
  };

  const handleEditQuizClick = (quizId: number, index: number) => {
    if (quizzes !== undefined) {
      navigate(`/quiz/edit/${quizId}`, { state: quizzes[index] });
    } else {
      setResponseMessage("Something went wrong.");
    }
  };

  const handleLogout = () => {
    authContext.logout();
    navigate(`/login`);
  };

  const handleCreateNew = () => {
    navigate(`/quiz/new`);
  };

  const handleRanking = () => {
    navigate(`/ranking`);
  };

  return (
    <div>
      {authContext.user ? (
        <QuizListContainer>
          <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
          <button onClick={() => handleCreateNew()}> Create new quiz </button>
          <button onClick={() => handleRanking()}> User ranking </button>
          <button onClick={() => handleLogout()}> LOGOUT </button>
          <ul>

            {quizzes?.map((quiz, index) => (
              <li key={quiz.id}>
                <div
                  onClick={() => handleQuizClick(quiz.id, index)}
                  style={{ cursor: 'pointer' }}
                >
                  <div>Name: {quiz.name}</div>
                  <div>Category: {quiz.category}</div>
                  <div>Description: {quiz.description}</div>
                  <div>Difficulty: {quiz.difficulty}</div>
                  <div>Owner: {quiz.ownerName}</div>
                </div>
                {authContext.user?.login === quiz.ownerName && <button onClick={() => handleEditQuizClick(quiz.id, index)}>EDIT</button>}

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
