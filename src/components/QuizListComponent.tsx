import React, { useContext } from 'react';
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

interface QuizListComponentProps {
  quizzes: Quiz[];
}

const QuizListComponent: React.FC<QuizListComponentProps> = ({ quizzes }) => {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleQuizClick = (quizId: number, index: number) => {
    // Handle quiz click, navigate to the quiz component or perform any other action
    navigate(`/quiz/${quizId}`, { state: quizzes[index] });
  };

  const handleLogout = () => {
    authContext.logout();
    navigate(`/login`);
  };

  return (
    <div>
      {authContext.user ? (
        <QuizListContainer>
          <p>Logged in as username: {authContext.user.login} Id: {authContext.user.id}</p>
          <button onClick={() => handleLogout()}> LOGOUT </button>
          <ul>
            {quizzes.map((quiz, index) => (
              <li key={quiz.id} onClick={() => handleQuizClick(quiz.id, index)}>
                <div>Name: {quiz.name}</div>
                <div>Category: {quiz.category}</div>
                <div>Description: {quiz.description}</div>
                <div>Difficulty: {quiz.difficulty}</div>
                <div>Owner: {quiz.ownerName}</div>
                { authContext.user?.login == quiz.ownerName && <button>EDIT</button>}

                
              </li>
            ))}
          </ul>
        </QuizListContainer>
      ) : (
        <p>User not logged in</p>
      )}
    </div>
  );
};

export default QuizListComponent;
